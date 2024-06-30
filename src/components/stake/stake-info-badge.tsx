"use client"

import React from "react"
import { BN, formatBalance } from "@polkadot/util"
import { useInkathon } from "@scio-labs/use-inkathon"

import useStakingInfo from "@/hooks/use-staking-info"

import { Badge } from "../ui/badge"

const StakingInfoBadge = ({
  className,
  withValidator,
  inPool,
  isLoading,
  error,
}: {
  className: string
  withValidator: BN | undefined
  inPool: BN | undefined
  isLoading?: boolean
  error?: Error | null
}) => {
  const { activeChain } = useInkathon()

  const badgeClass = `text-xs text-primary-500 ${className}`

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
        Staking{" "}
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
    <div className={badgeClass}>
      {/*@ts-ignore */}
      Not staking {activeChain?.tokenSymbol} yet
    </div>
  )
}

export default StakingInfoBadge
