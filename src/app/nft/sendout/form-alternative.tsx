"use client"

import { useState } from "react"
import type { Prefix } from "@kodadot1/uniquery"
import { useInkathon } from "@scio-labs/use-inkathon"
import { Loader2 } from "lucide-react"

import { useNftApi } from "@/hooks/use-nft-api"
import { useReferendumDetail } from "@/hooks/use-referendum-detail"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Step, Steps } from "@/components/ui/steps"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { SelectCollectionId } from "./select-collection-id"
import { UploadIpfsImage } from "./select-ipfs-image"

export type Network = Prefix | "paseo"

export function FormSendout({
  referenda,
}: {
  referenda: { id: string; status: string }[]
}) {
  const [step, setStep] = useState(1)
  const [txs, setTxs] = useState<any[]>([])
  const [selectedNetwork, setSelectedNetwork] = useState<Network>("ahp")
  const [selectedReferendum, setSelectedReferendum] = useState<
    string | undefined
  >()
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

  const checkTxs = async () => {
    // ... (keep the existing checkTxs function)
  }

  const mintNfts = async () => {
    // ... (keep the existing mintNfts function)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Send NFTs to Referendum Participants</CardTitle>
        <CardDescription>
          Follow the steps below to mint and send NFTs to referendum voters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Steps activeStep={step} className="mb-8">
          <Step title="Select Referendum and Network" />
          <Step title="Choose Collection and Image" />
          <Step title="Review and Mint" />
        </Steps>

        {step === 1 && (
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Polkadot Referendum ID</Label>
                <Select
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
              </div>
              <div className="flex flex-col gap-2">
                <Label>Network to mint NFTs on</Label>
                <Select
                  value={selectedNetwork}
                  onValueChange={(value) => {
                    setSelectedNetwork(value as Network)
                    setProgress("initial")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ahp">Polkadot Asset Hub</SelectItem>
                    <SelectItem value="ahk">Kusama Asset Hub</SelectItem>
                    <SelectItem value="paseo">Paseo Asset Hub</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={() => setStep(2)}
              disabled={!selectedReferendum || !selectedNetwork}
            >
              Next
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectCollectionId
                network={selectedNetwork}
                onChange={(collectionId) => setCollectionId(collectionId)}
              />
              <UploadIpfsImage onImageSelected={() => {}} />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!collectionId}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-6">
            <div className="referendum-info text-sm">
              <h3 className="text-lg font-semibold mb-2">
                Voters on Referendum {selectedReferendum} (
                {referendumDetail?.length} voters)
              </h3>
              {isReferendumDetailError ? (
                <div>Error loading referendum voters, try refreshing</div>
              ) : isReferendumDetailLoading ? (
                <div className="flex flex-row gap-2">
                  <Loader2 className="mr-2 animate-spin" /> Loading referendum{" "}
                  {selectedReferendum} voters from chain...
                </div>
              ) : (
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
                      <p className="mb-2">
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
              )}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
