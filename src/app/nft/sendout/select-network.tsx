"use client"

import { KusamaIcon, PolkadotIcon } from "@/icons"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectNetworkProps {
  value: string
  onChange: (value: "polkadot" | "kusama") => void
}

export function SelectNetwork({ value, onChange }: SelectNetworkProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Network</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a network" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="polkadot">
            <div className="flex items-center flex-row">
              <PolkadotIcon className="w-4 h-4 mr-2" /> Polkadot
            </div>
          </SelectItem>
          <SelectItem value="kusama">
            <div className="flex items-center flex-row">
              <KusamaIcon className="w-4 h-4 mr-2" /> Kusama
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
