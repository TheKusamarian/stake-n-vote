import { Dispatch, SetStateAction, useCallback, useState } from "react"
import { parseBN, trimAddress } from "@/util"
import { Tooltip } from "@nextui-org/tooltip"
import { ApiPromise } from "@polkadot/api"
import { Signer } from "@polkadot/api/types"
import { InjectedAccount } from "@polkadot/extension-inject/types"
import { BN, BN_ZERO, bnToBn } from "@polkadot/util"
import { SubstrateChain, useInkathon } from "@scio-labs/use-inkathon"

import { kusamaRelay, polkadotRelay } from "@/config/chains"
import { CHAIN_CONFIG } from "@/config/config"
import useAccountBalances from "@/hooks/use-account-balance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { bondAndNominateTx, joinPool, nominateTx } from "@/app/txs/txs"

import { AmountInput } from "../AmountInput"

export function MaybeAddToPool({
  minNominatorBond,
  signer,
  minimumActiveStake,
  minPoolJoinBond,
  stakeAmount,
  setStakeAmount,
  stakeBalance,
  amountSmallerThanMinNominatorBond,
  amountSmallerThanMinPoolJoinBond,
}: {
  minNominatorBond: any
  minimumActiveStake: any
  signer: any
  minPoolJoinBond: any
  stakeAmount: number | undefined
  setStakeAmount: Dispatch<SetStateAction<number | undefined>>
  stakeBalance: BN
  amountSmallerThanMinNominatorBond: boolean
  amountSmallerThanMinPoolJoinBond: boolean
}) {
  const { activeAccount, activeChain, api } = useInkathon()

  const {
    data: accountBalance,
    isLoading: isAccountBalanceLoading,
    isFetching: isAccountBalanceFetching,
    isSuccess: isAccountBalanceSuccess,
  } = useAccountBalances()

  // @ts-ignore
  const { tokenDecimals, tokenSymbol } = activeChain || {
    tokenDecimals: 12,
    tokenSymbol: "KSM",
  }
  const { freeBalance } = accountBalance || { freeBalance: BN_ZERO }

  const joinNominationPool = async (e: any) => {
    e.preventDefault()
    console.log("joinNominationPool", activeChain?.network, api, signer)
    if (!activeChain || !activeChain?.network || !api || !signer) {
      return
    }
    const poolToJoin = CHAIN_CONFIG[activeChain.network].poolId

    if (!poolToJoin) {
      return
    }

    const tx = await joinPool(
      api,
      signer,
      activeChain,
      activeAccount?.address,
      stakeBalance,
      poolToJoin
    )
  }

  const bondAndNominate = async (e: any) => {
    e.preventDefault()
    const targets =
      CHAIN_CONFIG[activeChain?.network || "Polkadot"].validator_set

    const tx = await bondAndNominateTx(
      api,
      signer,
      activeChain,
      activeAccount?.address,
      targets,
      stakeBalance
    )
  }

  const stakeMax = (e: any) => {
    e.preventDefault()

    let maxStake: BN
    if (activeChain === polkadotRelay) {
      if (freeBalance.gtn(Math.pow(10, tokenDecimals))) {
        maxStake = freeBalance.sub(bnToBn(Math.pow(10, tokenDecimals)))
      } else {
        maxStake = BN_ZERO
      }
    } else {
      maxStake = freeBalance
    }

    setStakeAmount(parseBN(maxStake?.toString(), tokenDecimals))
  }

  const humanReadableMinNominatorBond = parseBN(minNominatorBond, tokenDecimals)

  const isDisabled =
    activeChain === polkadotRelay
      ? stakeBalance.lte(BN_ZERO) ||
        stakeBalance.gt(freeBalance) ||
        stakeBalance.lt(minPoolJoinBond)
      : stakeBalance.lt(minNominatorBond) || stakeBalance.gt(freeBalance)

  return (
    <form>
      <div className="flex items-end flex-wrap">
        <AmountInput
          label="Amount to stake"
          value={stakeAmount?.toString() || ""}
          onChange={(e) => {
            const stakeAmount = parseFloat(e.target.value)
            setStakeAmount(stakeAmount)
          }}
        >
          <Button
            onClick={stakeMax}
            variant="outline"
            className="h-10 border-2 w-full md:w-auto mt-2 md:mt-0"
            disabled={!isAccountBalanceSuccess}
          >
            Stake Max
          </Button>
        </AmountInput>
      </div>

      {amountSmallerThanMinNominatorBond ? (
        <>
          <Tooltip
            content={`Stakes under ${humanReadableMinNominatorBond} ${tokenSymbol}
                stake do not have voting power while in nomination pools`}
            size="sm"
            color="warning"
            radius="sm"
            placement="bottom"
          >
            <Button
              onClick={joinNominationPool}
              disabled={isDisabled}
              size="lg"
              className="mt-4 w-full"
            >
              Stake with Nomination Pool
            </Button>
          </Tooltip>
        </>
      ) : (
        <Button
          onClick={bondAndNominate}
          color="danger"
          // disabled={isDisabled}
          className="mt-4 w-full"
        >
          Stake with Kus Validation and friends
        </Button>
      )}
    </form>
  )
}
