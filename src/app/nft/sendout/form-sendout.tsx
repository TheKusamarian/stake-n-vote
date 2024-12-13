"use client"

import { useState } from "react"

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

export function FormSendout({
  referenda,
}: {
  referenda: { id: string; status: string }[]
}) {
  const [selectedReferendum, setSelectedReferendum] = useState<string | null>(
    "1303"
  )

  const { data: referendumDetail, isLoading: isReferendumDetailLoading } =
    useReferendumDetail(selectedReferendum)

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
            <pre>{JSON.stringify(referendumDetail, null, 2)}</pre>
          </>
        )}
      </div>
      <Button disabled={!selectedReferendum}>Send NFTs</Button>
    </div>
  )
}
