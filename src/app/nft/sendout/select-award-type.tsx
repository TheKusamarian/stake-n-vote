"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectAwardTypeProps {
  value: "all" | "aye" | "nay"
  onChange: (value: "all" | "aye" | "nay") => void
  referendumDetail: any
  isLoading: boolean
  filterVoteInfo: string
}

export function SelectAwardType({
  value,
  onChange,
  referendumDetail,
  isLoading,
  filterVoteInfo,
}: SelectAwardTypeProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Who to award NFTs to</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select who to award NFTs to" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Voters</SelectItem>
          <SelectItem value="aye">Aye Voters</SelectItem>
          <SelectItem value="nay">Nay Voters</SelectItem>
        </SelectContent>
      </Select>
      {referendumDetail && (
        <p
          id="referendum-description"
          className="text-xs text-muted-foreground text-right"
        >
          {isLoading ? "Loading..." : filterVoteInfo}
          {value === "all"
            ? " total voters"
            : value === "aye"
            ? " Aye Voters"
            : " Nay Voters"}
        </p>
      )}
    </div>
  )
}
