"use client"

import React from "react"
import { BN, formatBalance } from "@polkadot/util"
import { useInkathon } from "@scio-labs/use-inkathon"

import { cn } from "@/lib/utils"
import useStakingInfo from "@/hooks/use-staking-info"

import { Badge } from "../ui/badge"

const StakingInfoBadge = ({
  className,
  withValidator,
  inPool,
  isLoading,
  error,
  valueOnly = false,
}: {
  className: string
  withValidator: BN | undefined
  inPool: BN | undefined
  isLoading?: boolean
  error?: Error | null
  valueOnly?: boolean
}) => {
  const { activeChain } = useInkathon()

  const badgeClass = cn(`text-xs text-primary-500`, className)

  if (isLoading) {
    return <div className={badgeClass}>Loading staking information...</div>
  }

  if (error) {
    return (
      <div className={badgeClass}>
        Error loading staking information: {error.message}
      </div>
    )
  }

  const isStakingWithValidator = withValidator && !withValidator?.isZero()
  const isStakingInPool = inPool && !inPool.isZero()

  if (isStakingWithValidator) {
    return (
      <div className={badgeClass}>
        {!valueOnly && <>Staking </>}
        {formatBalance(withValidator, {
          withUnit: false,
          // @ts-ignore
          decimals: activeChain?.tokenDecimals,
          // @ts-ignore
          forceUnit: activeChain?.tokenSymbol,
        }).slice(0, -2)}{" "}
        {/*@ts-ignore */}
        {activeChain?.tokenSymbol}
      </div>
    )
  }

  if (isStakingInPool) {
    return (
      <div className={badgeClass}>
        Staking{" "}
        {formatBalance(inPool, {
          withUnit: false,
          // @ts-ignore
          decimals: activeChain?.tokenDecimals,
          // @ts-ignore
          forceUnit: activeChain?.tokenSymbol,
        }).slice(0, -2)}{" "}
        {/*@ts-ignore */}
        {activeChain?.tokenSymbol} in pool
      </div>
    )
  }

  return (
    <span className={badgeClass}>
      {/*@ts-ignore */}
      Not staking {activeChain?.tokenSymbol} yet
    </span>
  )
}

export default StakingInfoBadge
