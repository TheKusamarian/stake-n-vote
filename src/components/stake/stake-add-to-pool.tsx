import { Dispatch, SetStateAction, useCallback, useState } from "react"
import { parseBN, trimAddress } from "@/util"
import { Tooltip } from "@nextui-org/tooltip"
import { ApiPromise } from "@polkadot/api"
import { Signer } from "@polkadot/api/types"
import { InjectedAccount } from "@polkadot/extension-inject/types"
import { BN, BN_ZERO, bnToBn } from "@polkadot/util"
import { SubstrateChain } from "@scio-labs/use-inkathon"

import { kusamaRelay, polkadotRelay } from "@/config/chains"
import { CHAIN_CONFIG } from "@/config/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { bondAndNominateTx, joinPool, nominateTx } from "@/app/txs/txs"

export function MaybeAddToPool({
  api,
  signer,
  tokenSymbol,
  tokenDecimals,
  activeChain,
  accountBalance,
  activeAccount,
  minNominatorBond,
  minimumActiveStake,
  minPoolJoinBond,
  stakeAmount,
  setStakeAmount,
  stakeBalance,
  amountSmallerThanMinNominatorBond,
  amountSmallerThanMinPoolJoinBond,
}: {
  api: ApiPromise | undefined
  signer: Signer | undefined
  activeChain: SubstrateChain | undefined
  tokenSymbol: string
  tokenDecimals: number
  accountBalance: any
  activeAccount: InjectedAccount | null
  minNominatorBond: any
  minimumActiveStake: any
  minPoolJoinBond: any
  stakeAmount: number | undefined
  setStakeAmount: Dispatch<SetStateAction<number | undefined>>
  stakeBalance: BN
  amountSmallerThanMinNominatorBond: boolean
  amountSmallerThanMinPoolJoinBond: boolean
}) {
  const joinNominationPool = useCallback(
    async (e: any) => {
      e.preventDefault()
      if (!activeChain || !activeChain?.network || !api || !signer) {
        return
      }
      const poolToJoin = CHAIN_CONFIG[activeChain.network].poolId

      console.log("stakeBalance", stakeBalance.toNumber())
      console.log("stakeAmount", stakeAmount)

      console.log(
        "activeChain aaa",
        poolToJoin,
        activeChain,
        activeChain?.network,
        CHAIN_CONFIG
      )

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

      console.log("tx", tx)
    },
    [activeChain]
  )

  const bondAndNominate = async (e: any) => {
    e.preventDefault()
    const targets =
      CHAIN_CONFIG[activeChain?.network || "Polkadot"].validator_set

    const amount = bnToBn(stakeAmount)

    const tx = await bondAndNominateTx(
      api,
      signer,
      activeAccount?.address,
      targets,
      amount
    )
  }

  const stakeMax = (e: any) => {
    e.preventDefault()
    const a =
      parseBN(accountBalance.freeBalance?.toString(), tokenDecimals) - 0.2

    //parse a to 2 decimals and round down
    const b = Math.floor(a * 100) / 100
    setStakeAmount(b)
  }

  const humanReadableMinNominatorBond = parseBN(minNominatorBond, tokenDecimals)

  const isDisabled =
    activeChain === polkadotRelay
      ? stakeBalance.lte(BN_ZERO) ||
        stakeBalance.gt(accountBalance.freeBalance) ||
        stakeBalance.lt(minPoolJoinBond)
      : stakeBalance.lt(minNominatorBond) ||
        stakeBalance.gt(accountBalance.freeBalance)

  return (
    <form>
      <div className="flex w-full max-w-sm items-end space-x-2">
        <div>
          <Label htmlFor="amount" className="font-bold">
            Amount to Stake
          </Label>
          <Input
            id="amount"
            type="number"
            min={0}
            // max={}
            step={0.01}
            placeholder={
              activeChain === kusamaRelay
                ? `Enter staking amount > ${humanReadableMinNominatorBond} ${tokenSymbol}`
                : `Enter staking amount`
            }
            value={stakeAmount?.toString()}
            onChange={(e) => {
              const stakeAmount = parseFloat(e.target.value)
              setStakeAmount(stakeAmount)
            }}
            className="text-black"
          />
        </div>
        <span className="flex h-10 w-12 items-center pr-4 text-sm font-bold">
          {tokenSymbol}
        </span>
        <Button
          onClick={stakeMax}
          variant="outline"
          className="h-10 border-2"
          // disabled={!isAccountBalanceSuccess}
        >
          Stake Max
        </Button>
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
          disabled={isDisabled}
          className="mt-4 w-full"
        >
          Stake with Kus Validation and friends
        </Button>
      )}
    </form>
  )
}
