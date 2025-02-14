"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { KusamaIcon, PolkadotIcon } from "@/icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { Prefix } from "@kodadot1/uniquery"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { useInkathon } from "@scio-labs/use-inkathon"
import { ClipboardCopy, ImageUp, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useNftApi } from "@/hooks/use-nft-api"
import { useReferendumDetail } from "@/hooks/use-referendum-detail"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DEFAULT_TOAST, sendAndFinalize } from "@/app/txs/send-and-finalize"

import { InputNftMeta } from "./input-nft-meta"
import { SelectAwardType } from "./select-award-type"
import { SelectCollectionId } from "./select-collection-id"
import { UploadIpfsImage } from "./select-ipfs-image"
import { SelectNetwork } from "./select-network"
import { SelectReferendum } from "./select-referendum"
import { SelectSendoutNetwork } from "./select-sendout-network"

export type Network = Prefix | "paseo"

const formSchema = z.object({
  network: z.enum(["polkadot", "kusama"]),
  referendumId: z.string().min(1, "Please select a referendum"),
  awardType: z.enum(["all", "aye", "nay"]),
  sendoutNetwork: z.custom<Network>(),
  collectionId: z.string().min(1, "Collection ID is required"),
  nftMeta: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    image: z.string().min(1, "Image is required"),
  }),
})

type FormValues = z.infer<typeof formSchema>

export function FormSendout({
  chain,
  referenda,
}: {
  chain: "polkadot" | "kusama"
  referenda: { id: string; status: string }[]
}) {
  const [txs, setTxs] = useState<any[]>([])
  const [progress, setProgress] = useState<
    "initial" | "checking" | "minting" | "loading"
  >("initial")
  const router = useRouter()
  const { activeAccount, activeSigner, activeChain } = useInkathon()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      network: chain,
      awardType: "all",
      sendoutNetwork: chain === "polkadot" ? "ahp" : "ahk",
      collectionId: "",
      nftMeta: {
        name: "",
        description: "",
        image: "",
      },
    },
  })

  const { watch } = form
  const selectedNetwork = watch("sendoutNetwork")
  const selectedReferendum = watch("referendumId")
  const whoToAward = watch("awardType")
  const collectionId = watch("collectionId")

  const nftApi = useNftApi(selectedNetwork)

  const {
    data: referendumDetail,
    isLoading: isReferendumDetailLoading,
    isError: isReferendumDetailError,
  } = useReferendumDetail(selectedReferendum)

  const filterVoteInfo =
    whoToAward === "all"
      ? `${referendumDetail?.length}`
      : whoToAward === "aye"
      ? `${referendumDetail?.filter((vote) => vote.aye).length}`
      : `${referendumDetail?.filter((vote) => !vote.aye).length}`

  const isSendoutDisabled =
    !referendumDetail?.length ||
    !collectionId ||
    !nftApi ||
    !activeAccount ||
    progress === "loading" ||
    selectedReferendum === undefined

  const checkTxs = async () => {
    setProgress("loading")

    try {
      if (!referendumDetail || !collectionId || !nftApi) {
        console.error("No referendum detail or collection id")
        return
      }

      const _txs = []

      const ipfsMetadataUrl =
        "ipfs://ipfs/bafkreiejhrp7wqve2rhj75qdou2wumpqyskxhrs72v5ryxa5teekgmxy5m"

      for (let i = 0; i < referendumDetail?.length; i++) {
        const assetId = `${collectionId}${i.toString().padStart(4, "0")}`
        _txs.push(
          nftApi.tx.nfts.mint(
            collectionId,
            assetId,
            referendumDetail[i].account,
            null
          )
        )

        _txs.push(
          nftApi.tx.nfts.setMetadata(collectionId, assetId, ipfsMetadataUrl)
        )
      }

      setTxs(_txs)
      setProgress("checking")
    } catch (error) {
      console.error("Error preparing transactions:", error)
      setProgress("initial")
    }
  }

  const copyCallData = () => {
    if (!referendumDetail || !nftApi) return
    const batchAll = nftApi.tx.utility.batchAll(txs)
    navigator.clipboard.writeText(batchAll?.toHex() ?? "")
  }

  const mintNfts = async () => {
    if (!referendumDetail || !nftApi) return

    console.log("minting nfts", txs)

    const batchAll = nftApi.tx.utility.batchAll(txs)

    console.log("batchAll", batchAll)

    try {
      const res = await sendAndFinalize({
        api: nftApi,
        tx: batchAll,
        signer: activeSigner,
        address: activeAccount?.address,
        activeChain: activeChain,
        toastConfig: {
          ...DEFAULT_TOAST,
          title: "Minting NFTs",
          messages: {
            ...DEFAULT_TOAST.messages,
            success: "NFTs minted successfully",
          },
        },
      })
    } catch (error) {
      console.error("Error minting NFTs", error)
    } finally {
      setProgress("initial")
      await nftApi.disconnect()
    }
  }

  return (
    <Form {...form} key={chain}>
      <form onSubmit={form.handleSubmit(checkTxs)}>
        <Card className="w-full max-w-4xl mx-auto border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-5xl font-bold text-center text-clip bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Send NFTs <br /> to Referendum Participants
            </CardTitle>
            <CardDescription className="text-center mb-4">
              Follow the steps below to mint and send NFTs to referendum voters
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="network"
                render={({ field }) => (
                  <FormItem>
                    <SelectNetwork
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value)
                        router.push(`/nft/sendout/${value}`)
                        setProgress("initial")
                      }}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referendumId"
                render={({ field }) => (
                  <FormItem>
                    <SelectReferendum
                      chain={chain}
                      referenda={referenda}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value)
                        setProgress("initial")
                        form.setValue("collectionId", "")
                      }}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="awardType"
                render={({ field }) => (
                  <FormItem>
                    <SelectAwardType
                      value={field.value}
                      onChange={field.onChange}
                      referendumDetail={referendumDetail}
                      isLoading={isReferendumDetailLoading}
                      filterVoteInfo={filterVoteInfo}
                    />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sendoutNetwork"
                render={({ field }) => (
                  <FormItem>
                    <SelectSendoutNetwork
                      value={field.value}
                      onChange={(network) => {
                        field.onChange(network)
                        setProgress("initial")
                      }}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collectionId"
                render={({ field }) => (
                  <FormItem>
                    <SelectCollectionId
                      network={selectedNetwork}
                      onChange={(value) => {
                        field.onChange(value)
                        setProgress("initial")
                      }}
                    />
                  </FormItem>
                )}
              />
            </div>

            {/* NFT Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nftMeta.image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NFT Image</FormLabel>
                    <FormControl>
                      <UploadIpfsImage onImageSelected={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nftMeta"
                  render={({ field }) => (
                    <InputNftMeta
                      {...field.value}
                      onChangeName={(name) =>
                        form.setValue("nftMeta.name", name)
                      }
                      onChangeDescription={(description) =>
                        form.setValue("nftMeta.description", description)
                      }
                      onChangeImage={(image) =>
                        form.setValue("nftMeta.image", image)
                      }
                      previewData={{
                        index: 123,
                        refId: selectedReferendum ?? "1337",
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {progress === "checking" && (
              <>
                <Button
                  variant="outline"
                  onClick={copyCallData}
                  className="w-1/3"
                >
                  <ClipboardCopy className="mr-2 h-4 w-4" /> Copy Call Data
                </Button>
                <Button className="w-2/3" onClick={mintNfts}>
                  <ImageUp className="mr-2 h-4 w-4" /> Mint {filterVoteInfo}{" "}
                  NFTs
                </Button>
              </>
            )}
            {progress === "initial" && (
              <Button
                className="w-full"
                disabled={isSendoutDisabled}
                onClick={() => {
                  if (progress === "initial") {
                    checkTxs()
                  }
                }}
              >
                {!activeAccount ? (
                  "Connect Wallet to Continue"
                ) : progress === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing Transactions...
                  </>
                ) : progress === "initial" ? (
                  "Verify NFT Sendout"
                ) : (
                  "Minting..."
                )}
              </Button>
            )}
          </div>
        </Card>
      </form>
      {progress === "checking" && (
        <div className="referendum-info text-sm">
          <b>
            {" "}
            Voters on Referendum {selectedReferendum} (
            {referendumDetail?.length} voters)
          </b>
          {isReferendumDetailError ? (
            <div>Error loading referendum voters, try refreshing</div>
          ) : isReferendumDetailLoading ? (
            <div className="flex flex-row gap-2">
              <Loader2 className="mr-2 animate-spin" /> Loading referendum{" "}
              {selectedReferendum} voters from chain...
            </div>
          ) : (
            <>
              <div className="h-[400px] overflow-y-auto">
                {progress === "initial" && (
                  <Table>
                    <TableCaption>
                      Voters on referendum #{selectedReferendum} (
                      {referendumDetail?.length} voters)
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead>Vote</TableHead>
                        <TableHead>Votes</TableHead>
                        <TableHead>isDelegating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referendumDetail?.map((vote) => {
                        const voteDirection = vote.isSplit
                          ? "Split"
                          : vote.isSplitAbstain
                          ? "Split Abstain"
                          : !vote.aye
                          ? "Nay"
                          : "Aye"

                        const votes = vote.isSplit
                          ? Number(vote.ayeVotes) + Number(vote.nayVotes)
                          : vote.isSplitAbstain
                          ? Number(vote.ayeVotes) +
                            Number(vote.nayVotes) +
                            Number(vote.abstainVotes)
                          : Number(vote.votes)

                        return (
                          <TableRow key={vote.account}>
                            <TableCell>{vote.account}</TableCell>
                            <TableCell>{voteDirection}</TableCell>
                            <TableCell>{votes}</TableCell>
                            <TableCell>
                              {vote.isDelegating ? "Yes" : "No"}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}

                {progress === "checking" && (
                  <>
                    <p>
                      Please verify the following batch transaction containing{" "}
                      {txs.length} transactions
                    </p>
                    <pre className="p-4 overflow-y-auto h-[400px] text-[10px] leading-none bg-gray-100 rounded-md">
                      {JSON.stringify(
                        txs.map((tx) => tx.method.toHuman()),
                        null,
                        2
                      )}
                    </pre>
                  </>
                )}
              </div>
              {/* <pre>{JSON.stringify(referendumDetail, null, 2)}</pre> */}
            </>
          )}
        </div>
      )}
    </Form>
  )
}
