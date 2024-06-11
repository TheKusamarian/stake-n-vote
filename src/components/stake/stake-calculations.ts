import { parseBN } from "@/util"
import { BN, BN_ZERO, bnToBn } from "@polkadot/util"

import { CHAIN_CONFIG } from "@/config/config"

export function useStakeCalculations({
  activeChain,
  accountBalance,
  stakingMetrics,
  stakeAmount,
}: {
  activeChain: any
  accountBalance: any
  stakingMetrics: any
  stakeAmount: number | undefined
}) {
  const { minNominatorBond, minimumActiveStake, minPoolJoinBond } =
    stakingMetrics || {
      minNominatorBond: "0",
      minimumActiveStake: "0",
      minPoolJoinBond: "0",
    }

  const {
    maxNominators,
    validator: kusValidator,
    tokenSymbol,
    tokenDecimals,
  } = CHAIN_CONFIG[activeChain?.network || "Polkadot"] || {}

  const { freeBalance } = accountBalance || { freeBalance: BN_ZERO }
  const humanFreeBalance = parseBN(freeBalance, tokenDecimals)
  const stakeBalance =
    stakeAmount && !isNaN(stakeAmount) && stakeAmount !== 0
      ? bnToBn(stakeAmount * Math.pow(10, tokenDecimals))
      : BN_ZERO

  const polkadotMinNominatorBond = bnToBn(minimumActiveStake).addn(
    tokenDecimals * 100
  )

  const amountSmallerThanMinNominatorBond =
    activeChain === "kusamaRelay"
      ? stakeBalance.lt(bnToBn(minimumActiveStake))
      : stakeBalance.lt(polkadotMinNominatorBond)

  const amountSmallerThanMinPoolJoinBond = stakeBalance.lt(
    bnToBn(minPoolJoinBond)
  )

  const showSupported = !freeBalance.eq(BN_ZERO)

  return {
    minNominatorBond,
    minPoolJoinBond,
    minimumActiveStake,
    tokenSymbol,
    tokenDecimals,
    freeBalance,
    humanFreeBalance,
    stakeBalance,
    amountSmallerThanMinNominatorBond,
    amountSmallerThanMinPoolJoinBond,
    showSupported,
    maxNominators,
    kusValidator,
  }
}
