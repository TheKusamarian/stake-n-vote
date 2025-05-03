import { useMemo } from "react"
import { BN, formatBalance } from "@polkadot/util"

import { useNftFees } from "@/hooks/use-nft-fees"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Network } from "./form-sendout"

export function SelectSendoutNetwork({
  value,
  onChange,
}: {
  value: Network
  onChange: (network: Network) => void
}) {
  const { data: nftFees, isLoading, isFetching } = useNftFees(value)

  const feePerNft = useMemo(() => {
    if (!nftFees) return new BN(0)
    return new BN(nftFees.depositMetadata).add(new BN(nftFees.depositNft))
  }, [nftFees])

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
          <SelectItem value="paseo" className="flex items-center gap-4!">
            Paseo Asset Hub{" "}
            <span className="bg-teal-300 text-[10px] px-1.5 rounded-md py-0.5">
              Testnet
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
      <div className="flex flex-col md:flex-row gap-2 justify-between">
        {!feePerNft.isZero() && (
          <p className="text-xs text-muted-foreground text-right">
            Fee per NFT{" "}
            {isLoading || isFetching
              ? "..."
              : `~ ${formatBalance(feePerNft, {
                  decimals: nftFees?.decimals,
                  withUnit: nftFees?.token,
                  forceUnit: "-",
                })}`}
          </p>
        )}
      </div>
    </div>
  )
}
