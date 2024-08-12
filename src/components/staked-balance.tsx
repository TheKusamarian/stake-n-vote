"use client"

import { memo } from "react"
import { humanReadableBalance } from "@/util"
import type {
  AccountId,
  AccountIndex,
  Address,
} from "@polkadot/types/interfaces"
import { useInkathon } from "@scio-labs/use-inkathon"

import { cn } from "@/lib/utils"
import { useActiveAccountStakingInfo } from "@/hooks/use-staking-info"

interface Props {
  children?: React.ReactNode
  className?: string
  label?: React.ReactNode
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null
}

export function StakedBalance({ children, className, label, params }: Props) {
  const { api, activeChain } = useInkathon()
  const { data: stakingInfo } = useActiveAccountStakingInfo()

  const formattedBalance = humanReadableBalance(
    stakingInfo?.amount,
    // @ts-ignore
    activeChain?.tokenDecimals,
    // @ts-ignore
    activeChain?.tokenSymbol
  )

  return (
    <span className={cn("text-xs h-6", className)}>
      {formattedBalance === "0"
        ? ""
        : formattedBalance
        ? `${formattedBalance} staked`
        : "Loading Staked Balance ..."}
    </span>
  )
}

export default memo(StakedBalance)
