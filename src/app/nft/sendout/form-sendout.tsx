"use client"

import { useEffect, useMemo, useState } from "react"
import { Prefix } from "@kodadot1/uniquery"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { useInkathon } from "@scio-labs/use-inkathon"
import { Loader2 } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DEFAULT_TOAST, sendAndFinalize } from "@/app/txs/send-and-finalize"

import { InputNftMeta } from "./input-nft-meta"
import { SelectCollectionId } from "./select-collection-id"
import { UploadIpfsImage } from "./select-ipfs-image"
import { SelectNetwork } from "./select-network"

export type Network = Prefix | "paseo"

export function FormSendout({
  referenda,
}: {
  referenda: { id: string; status: string }[]
}) {
  const mutatedReferenda = [...referenda]
  const [txs, setTxs] = useState<any[]>([])
  const [selectedNetwork, setSelectedNetwork] = useState<Network>("ahp")
  const [selectedReferendum, setSelectedReferendum] = useState<
    string | undefined
  >()

  const [nftMeta, setNftMeta] = useState<{
    name: string
    description: string
    image: string
  }>({
    name: "",
    description: "",
    image: "",
  })

  const [collectionId, setCollectionId] = useState<string | undefined>("165")

  const [progress, setProgress] = useState<
    "initial" | "checking" | "minting" | "loading"
  >("initial")

  const { activeAccount, activeSigner, activeChain } = useInkathon()
  const nftApi = useNftApi(selectedNetwork)

  const {
    data: referendumDetail,
    isLoading: isReferendumDetailLoading,
    isError: isReferendumDetailError,
  } = useReferendumDetail(selectedReferendum)

  const isSendoutDisabled =
    !referendumDetail?.length ||
    !collectionId ||
    !nftApi ||
    !activeAccount ||
    progress === "loading" ||
    selectedReferendum === undefined

  console.log(
    "isSendoutDisabled",
    isSendoutDisabled,
    referendumDetail,
    collectionId,
    nftApi,
    activeAccount,
    progress,
    selectedReferendum
  )

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
    <Card className="w-full max-w-4xl mx-auto border-none">
      <CardHeader>
        <CardTitle className="text-5xl font-bold text-center text-clip bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
          Send NFTs <br /> to Referendum Participants
        </CardTitle>
        <CardDescription className="text-center mb-4">
          Follow the steps below to mint and send NFTs to referendum voters
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Label>Polkadot Referendum ID</Label>
          <Select
            aria-describedby="referendum-description"
            value={selectedReferendum}
            onValueChange={(value) => {
              setSelectedReferendum(value)
              setProgress("initial")
              setCollectionId(undefined)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a referendum" />
            </SelectTrigger>
            <SelectContent>
              {mutatedReferenda
                .sort((a, b) => Number(b.id) - Number(a.id))
                .slice(0, 300)
                .map((referendum) => (
                  <SelectItem key={referendum.id} value={referendum.id}>
                    {referendum.id}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <div className="flex flex-col md:flex-row gap-2 justify-between">
            <p className="text-xs text-muted-foreground">
              Select the referendum you want to reward
            </p>
            {referendumDetail && (
              <p
                id="referendum-description"
                className="text-xs text-muted-foreground text-right"
              >
                {isReferendumDetailLoading
                  ? "Loading..."
                  : referendumDetail?.length}
                {" voters on referendum "}
                {selectedReferendum}
              </p>
            )}
          </div>
        </div>

        <SelectNetwork
          value={selectedNetwork}
          onChange={(network) => {
            setSelectedNetwork(network)
            setProgress("initial")
          }}
        />
        <SelectCollectionId
          network={selectedNetwork}
          onChange={(collectionId) => setCollectionId(collectionId)}
        />
        <div className="grid grid-cols-2 gap-2">
          <UploadIpfsImage onImageSelected={() => {}} />
          <InputNftMeta
            name={nftMeta.name}
            description={nftMeta.description}
            image={nftMeta.image}
            onChangeName={(e) =>
              setNftMeta({ ...nftMeta, name: e.target.value })
            }
            onChangeDescription={(e) =>
              setNftMeta({ ...nftMeta, description: e.target.value })
            }
            onChangeImage={(e) =>
              setNftMeta({ ...nftMeta, image: e.target.value })
            }
          />
        </div>
      </CardContent>
      <CardFooter>
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
        {progress === "checking" && <div className="flex flex-col gap-2"></div>}
        <Button
          disabled={isSendoutDisabled}
          onClick={() => {
            if (progress === "initial") {
              checkTxs()
            } else if (progress === "checking") {
              mintNfts()
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
          ) : progress === "checking" ? (
            `Mint ${referendumDetail?.length} NFTs`
          ) : (
            "Minting..."
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
