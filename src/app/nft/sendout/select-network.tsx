import { useState } from "react"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Network } from "./form-sendout"

export function SelectNetwork({
  value,
  onChange,
}: {
  value: Network
  onChange: (network: Network) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Network to mint NFTs on</Label>
      <Select
        value={value}
        onValueChange={(value) => {
          onChange(value as Network)
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
      <div className="flex flex-col md:flex-row gap-2 justify-between">
        <p className="text-xs text-muted-foreground">
          Select the network you want to mint the NFTs on
        </p>
        <p className="text-xs text-muted-foreground text-right">
          Fee per NFT ~ 0.0001 DOT
        </p>
      </div>
    </div>
  )
}
