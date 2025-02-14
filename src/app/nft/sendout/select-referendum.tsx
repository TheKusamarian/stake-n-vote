"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectReferendumProps {
  chain: "polkadot" | "kusama"
  referenda: { id: string; status: string }[]
  value: string | undefined
  onChange: (value: string) => void
}

export function SelectReferendum({
  chain,
  referenda,
  value,
  onChange,
}: SelectReferendumProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>
        {chain === "polkadot" ? "Polkadot" : "Kusama"} Referendum ID
      </Label>
      <Select
        aria-describedby="referendum-description"
        value={value}
        onValueChange={onChange}
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
  )
}
