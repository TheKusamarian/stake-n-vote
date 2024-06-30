"use client"

import { useState } from "react"
import { useInkathon } from "@scio-labs/use-inkathon"

import useAccountBalances from "@/hooks/use-account-balance"
import { useAccountNominators } from "@/hooks/use-account-nominations"
import { useStakingMetrics } from "@/hooks/use-staking-metrics"

export function useStakeData() {
  const { activeChain, activeAccount, api, activeSigner } = useInkathon()

  const { data: nominators, isLoading: isNominatorsLoading } =
    useAccountNominators()
  const { data: accountBalance, isLoading: isAccountBalanceLoading } =
    useAccountBalances()
  const { data: stakingMetrics, isLoading: isStakingMetricsLoading } =
    useStakingMetrics()

  const [stakeAmount, setStakeAmount] = useState<number | undefined>(0)

  const isLoading =
    isNominatorsLoading || isAccountBalanceLoading || isStakingMetricsLoading

  return {
    activeChain,
    activeAccount,
    api,
    activeSigner,
    nominators,
    accountBalance,
    stakingMetrics,
    stakeAmount,
    setStakeAmount,
    isLoading,
  }
}
