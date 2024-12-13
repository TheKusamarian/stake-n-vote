"use client"

import { useState } from "react"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { useInkathon } from "@scio-labs/use-inkathon"

import { useReferendumDetail } from "@/hooks/use-referendum-detail"
import { Button } from "@/components/ui/button"
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
  const [selectedReferendum, setSelectedReferendum] = useState<string | null>(
    "1303"
  )

  const { activeAccount, activeSigner, activeChain, api } = useInkathon()

  const { data: referendumDetail, isLoading: isReferendumDetailLoading } =
    useReferendumDetail(selectedReferendum)

  const mintNfts = async () => {
    if (!referendumDetail) return

    console.log("minting nfts")

    const polkadotAssetHubApi = new ApiPromise({
      provider: new WsProvider("wss://rpc-asset-hub-kusama.luckyfriday.io"),
    })

    await polkadotAssetHubApi.isReady

    // nft mint collectionId, assetId, owner
    const collectionId = "504"
    const ipfsMetadataUrl =
      "ipfs://ipfs/bafkreibb3lpjoy2bs6nmkt4zwfgj4ldmh4fholynx2euuagst3azb5vlom"

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

    const txs = []

    for (let i = 0; i < referendumDetail?.length; i++) {
      const assetId = `${collectionId}${i.toString().padStart(4, "0")}`
      txs.push(
        polkadotAssetHubApi.tx.nfts.mint(
          collectionId,
          assetId,
          referendumDetail[i].voter,
          null
        )
      )
    }

    console.log("txs", txs)

    const batchAll = polkadotAssetHubApi.tx.utility.batchAll(txs)

    const res = await sendAndFinalize({
      api: polkadotAssetHubApi,
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

    // nft.set metadata (collectionId, assetId, data (ipfs://ipfs/...))
    await polkadotAssetHubApi.disconnect()
  }

  return (
    <div className="flex flex-col gap-4">
      <b>Send NFTs to referendum participants</b>
      <Select value={selectedReferendum} onValueChange={setSelectedReferendum}>
        <SelectTrigger>
          <SelectValue placeholder="Select a referendum" />
        </SelectTrigger>
        <SelectContent>
          {referenda
            .sort((a, b) => Number(b.id) - Number(a.id))
            .slice(0, 300)
            .map((referendum) => (
              <SelectItem key={referendum.id} value={referendum.id}>
                {referendum.id}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <div className="referendum-info text-sm">
        <b>
          {" "}
          Voters on Referendum {selectedReferendum} ({referendumDetail?.length}{" "}
          voters)
        </b>
        {isReferendumDetailLoading ? (
          <Skeleton className="h-4 w-full" />
        ) : (
          <>
            <div className="h-[400px] overflow-y-auto">
              <Table>
                <TableCaption>
                  Voters on Referendum {selectedReferendum} (
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
            </div>
            {/* <pre>{JSON.stringify(referendumDetail, null, 2)}</pre> */}
          </>
        )}
      </div>
      <Button disabled={!selectedReferendum} onClick={mintNfts}>
        Send NFTs
      </Button>
    </div>
  )
}
