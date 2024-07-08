"use client"

import { format } from "url"
import { memo } from "react"
import { humanReadableBalance } from "@/util"
import type { DeriveBalancesAll } from "@polkadot/api-derive/types"
import type {
  AccountId,
  AccountIndex,
  Address,
} from "@polkadot/types/interfaces"
import { staking } from "@polkadot/types/interfaces/definitions"
import { useInkathon } from "@scio-labs/use-inkathon"

import { cn } from "@/lib/utils"
import { useCall } from "@/hooks/use-call"
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

  console.log("sss", stakingInfo?.withValidator?.toString())

  return (
    <span className={cn("text-xs", className)}>
      {formattedBalance
        ? `${formattedBalance} staked`
        : "Loading Staked Balance ..."}
    </span>
  )
}

export default memo(StakedBalance)
