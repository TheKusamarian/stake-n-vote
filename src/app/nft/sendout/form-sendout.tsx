"use client"

import { useState } from "react"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { useInkathon } from "@scio-labs/use-inkathon"
import { Loader2 } from "lucide-react"

import { useReferendumDetail } from "@/hooks/use-referendum-detail"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
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

export function FormSendout({
  referenda,
}: {
  referenda: { id: string; status: string }[]
}) {
  const mutatedReferenda = [...referenda, { id: "1303", status: "active" }]

  const [txs, setTxs] = useState<any[]>([])

  const [selectedNetwork, setSelectedNetwork] = useState<string | undefined>(
    "polkadot"
  )

  const [assetHubApi, setAssetHubApi] = useState<ApiPromise | undefined>(
    undefined
  )
  const [selectedReferendum, setSelectedReferendum] = useState<
    string | undefined
  >("1303")

  const [collectionId, setCollectionId] = useState<string | undefined>("165")

  const [progress, setProgress] = useState<"initial" | "checking" | "minting">(
    "initial"
  )

  const { activeAccount, activeSigner, activeChain, api } = useInkathon()

  const {
    data: referendumDetail,
    isLoading: isReferendumDetailLoading,
    isError: isReferendumDetailError,
  } = useReferendumDetail(selectedReferendum)

  const checkTxs = async () => {
    if (!referendumDetail || !collectionId) {
      console.error("No referendum detail or collection id")
      return
    }

    const provider =
      selectedNetwork === "polkadot"
        ? "wss://rpc-asset-hub-polkadot.luckyfriday.io"
        : selectedNetwork === "kusama"
        ? "wss://rpc-asset-hub-kusama.luckyfriday.io"
        : "wss://sys.ibp.network/asset-hub-paseo"

    const _assetHubApi = new ApiPromise({
      provider: new WsProvider(provider),
    })

    await _assetHubApi.isReady

    setAssetHubApi(_assetHubApi)

    if (!assetHubApi) return

    const _txs = []

    const ipfsMetadataUrl =
      "ipfs://ipfs/bafkreiejhrp7wqve2rhj75qdou2wumpqyskxhrs72v5ryxa5teekgmxy5m"

    for (let i = 0; i < referendumDetail?.length; i++) {
      const assetId = `${collectionId}${i.toString().padStart(4, "0")}`
      _txs.push(
        assetHubApi.tx.nfts.mint(
          collectionId,
          assetId,
          referendumDetail[i].account,
          null
        )
      )

      _txs.push(
        assetHubApi.tx.nfts.setMetadata(collectionId, assetId, ipfsMetadataUrl)
      )
    }

    setTxs(_txs)

    console.log("txs", txs)

    setProgress("checking")
  }

  const mintNfts = async () => {
    if (!referendumDetail || !assetHubApi) return

    console.log("minting nfts")

    // nft mint collectionId, assetId, owner

    // const txs = referendumDetail?.reduce((acc, vote, index) => {
    //   const assetId = `${collectionId}${index.toString().padStart(4, "0")}`

    //   acc.push(
    //     polkadotAssetHubApi.tx.nfts.mint(
    //       collectionId,
    //       assetId,
    //       vote.account,
    //       ipfsMetadataUrl
    //     )
    //   )

    //   return acc
    // }, [])

    const batchAll = assetHubApi.tx.utility.batchAll(txs)

    try {
      const res = await sendAndFinalize({
        api: assetHubApi,
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
      await assetHubApi.disconnect()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <b>Send NFTs to referendum participants</b>
      <div className="flex flex-col gap-2">
        <Label>Polkadot Referendum ID</Label>
        <Select
          value={selectedReferendum}
          onValueChange={(value) => {
            setSelectedReferendum(value)
            setProgress("initial")
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
      </div>
      <div className="flex flex-col gap-2">
        <Label>Network to mint NFTs on</Label>
        <Select
          value={selectedNetwork}
          onValueChange={(value) => {
            setSelectedNetwork(value)
            setProgress("initial")
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="polkadot">Polkadot Asset Hub</SelectItem>
            <SelectItem value="kusama">Kusama Asset Hub</SelectItem>
            <SelectItem value="paseo">Paseo Asset Hub</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Mint to collection ID</Label>
        <Input
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          placeholder="Collection ID"
        />
      </div>
      <div className="referendum-info text-sm">
        <b>
          {" "}
          Voters on Referendum {selectedReferendum} ({referendumDetail?.length}{" "}
          voters)
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
        disabled={!selectedReferendum}
        onClick={() => {
          if (progress === "initial") {
            checkTxs()
          } else if (progress === "checking") {
            mintNfts()
          }
        }}
      >
        {progress === "initial"
          ? "Verify NFT Sendout"
          : progress === "checking"
          ? `Mint ${referendumDetail?.length} NFTs`
          : "Minting..."}
      </Button>
    </div>
  )
}
