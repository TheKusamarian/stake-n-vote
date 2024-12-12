"use client"

import { useEffect, useMemo, useState } from "react"
import { parseBN } from "@/util"
import { BN, BN_ZERO } from "@polkadot/util"
import { useInkathon } from "@scio-labs/use-inkathon"

import { kusamaRelay } from "@/config/chains"
import {
  CHAIN_CONFIG,
  KUSAMA_DELEGATOR,
  POLKADOT_DELEGATOR,
} from "@/config/config"
import useAccountBalances from "@/hooks/use-account-balance"
import { useTransactionFee } from "@/hooks/use-fees"
import { useMaxDelegation } from "@/hooks/use-max-delegation"
import { useTracks } from "@/hooks/use-tracks"
import { useVotingFor } from "@/hooks/use-voting-for"
import { delegateTxs, sendDelegateTx } from "@/app/txs/txs"

import { AmountInput } from "../amount-input"
import { ConvictionSlider } from "../conviction-slider"
import { TrackSelect } from "../track-select"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { DelegationVoteInfo } from "./delegation-vote-info"

export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}

export function submitDelegation(prevState: State, formData: FormData) {
  return {
    errors: {
      status: ["Delegation Failed!"],
    },
    message: null,
  }
}

export default function FormDelegate() {
  const { data: accountBalance, isSuccess: isAccountBalanceSuccess } =
    useAccountBalances()
  const { data: votingFor, isLoading: isVotingForLoading } = useVotingFor()
  const { data: trackOptions, isLoading: allTracksLoading } = useTracks()
  const { activeAccount, activeSigner, activeChain, api } = useInkathon()
  const { data: maxDelegation, isLoading: isMaxDelegationLoading } =
    useMaxDelegation()

  const [amount, setAmount] = useState(0)
  const [isMaxAmount, setIsMaxAmount] = useState(false) // Track if the amount was set via "Delegate Max"
  const [tracks, setTracks] = useState<string[]>(
    trackOptions?.map((t) => t.value) || []
  )
  const [conviction, setConviction] = useState<number>(
    activeChain === kusamaRelay ? 3 : 1
  )

  const activeChainConfig = CHAIN_CONFIG[activeChain?.network || "Polkadot"]
  const target =
    activeChain === kusamaRelay ? KUSAMA_DELEGATOR : POLKADOT_DELEGATOR

  const { tokenDecimals } = activeChainConfig

  const delegateBalance =
    !isNaN(amount) && amount !== 0
      ? new BN(amount).mul(new BN(10).pow(new BN(tokenDecimals)))
      : BN_ZERO

  const tx = useMemo(() => {
    return delegateTxs(
      api,
      activeSigner,
      activeChain,
      activeAccount?.address,
      tracks,
      target,
      conviction,
      delegateBalance,
      votingFor
    )
  }, [
    api,
    activeSigner,
    activeChain,
    activeAccount?.address,
    tracks,
    target,
    conviction,
    delegateBalance,
    votingFor,
  ])

  const { data: txFees } = useTransactionFee(tx, [activeAccount?.address])

  const effectiveVotes = isNaN(amount)
    ? 0
    : conviction !== 0
    ? (amount * conviction).toFixed(2)
    : (amount * 0.1).toFixed(2)

  const maxAmount =
    isMaxDelegationLoading || !maxDelegation || !txFees
      ? amount
      : parseFloat(parseBN(maxDelegation.sub(txFees), tokenDecimals).toFixed(2))

  useEffect(() => {
    setTracks(trackOptions?.map((t) => t.value) || [])
  }, [trackOptions])

  useEffect(() => {
    if (isMaxAmount && !isMaxDelegationLoading && maxDelegation && txFees) {
      setAmount(maxAmount)
    }
  }, [
    tracks,
    maxAmount,
    isMaxAmount,
    amount,
    isMaxDelegationLoading,
    maxDelegation,
    txFees,
  ])

  const delegateToTheKus = async (e: any) => {
    e.preventDefault()

    const target =
      activeChain === kusamaRelay ? KUSAMA_DELEGATOR : POLKADOT_DELEGATOR

    await sendDelegateTx(
      api,
      activeSigner,
      activeChain,
      activeAccount?.address,
      tracks,
      target,
      conviction,
      delegateBalance,
      votingFor
    )
  }

  const delegateMax = (e: any) => {
    e.preventDefault()
    setAmount(maxAmount)
    setIsMaxAmount(true) // Mark the amount as set by "Delegate Max"
  }

  const delegateStaked = (e: any) => {
    e.preventDefault()
    setAmount(
      parseFloat(
        parseBN(
          (accountBalance?.stakedBalance || BN_ZERO).sub(txFees || BN_ZERO),
          tokenDecimals
        ).toFixed(2)
      )
    )
    setIsMaxAmount(false) // Manually setting an amount, so no longer the max
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value))
    setIsMaxAmount(false) // Manually setting an amount, so no longer the max
  }

  const handleTracksChange = (newTracks: string[]) => {
    setTracks(newTracks)

    if (isMaxAmount) {
      setAmount(maxAmount) // Update the amount if it was set to the max and tracks have changed
    }
  }

  const isDisabled =
    !isAccountBalanceSuccess ||
    allTracksLoading ||
    isVotingForLoading ||
    !amount ||
    amount <= 0 ||
    tracks.length === 0 ||
    accountBalance?.freeBalance.lte(BN_ZERO)

  const errorMessage = accountBalance?.freeBalance.lte(BN_ZERO)
    ? `Insufficient balance to pay the fees of ${parseBN(
        txFees || BN_ZERO,
        activeChainConfig.tokenDecimals
      ).toFixed(4)} ${activeChainConfig.tokenSymbol}`
    : tracks.length === 0
    ? "Please select at least 1 track"
    : amount <= 0 || isNaN(amount)
    ? "Please enter a valid amount"
    : ""

  console.log("maxDelegation", maxDelegation?.toNumber())

  return (
    <form className="flex w-full max-w-xl flex-col gap-5 relative">
      <div>
        <Label htmlFor="airplane-mode" className="font-bold">
          Governance Tracks
        </Label>
        <TrackSelect
          className="w-full"
          values={tracks}
          onChange={handleTracksChange}
        />
      </div>
      <div className="flex w-full max-w-full flex-row gap-3">
        <AmountInput
          info={`${Math.max(0, maxAmount).toFixed(2)} ${
            activeChainConfig.tokenSymbol
          } available`}
          label="Delegation Amount"
          value={amount.toString()}
          onChange={handleAmountChange}
          max={maxAmount}
        >
          <Button
            onClick={delegateStaked}
            variant="outline"
            className="h-10 border-2 flex-0 bg-default-100 hover:bg-accent hover:shadow-md md:mr-1 mb-1 md:mb-0 text-xs"
            disabled={
              !isAccountBalanceSuccess ||
              accountBalance.stakedBalance.eq(BN_ZERO)
            }
          >
            Delegate Staked
          </Button>
          <Button
            onClick={delegateMax}
            variant="outline"
            className="h-10 border-2 flex-0 bg-default-100 hover:bg-accent hover:shadow-md text-xs"
            disabled={!isAccountBalanceSuccess || maxAmount < 0}
          >
            Delegate Max
          </Button>
        </AmountInput>
      </div>
      <ConvictionSlider
        className="mb-6"
        value={conviction}
        onChange={(value) => setConviction(value as number)}
      />
      <DelegationVoteInfo
        value={votingFor}
        className="-mb-3"
        selectedTracks={tracks}
      />
      <div className="flex w-full items-start gap-1 flex-col">
        <Button
          className="w-full"
          onClick={delegateToTheKus}
          disabled={isDisabled}
        >
          Delegate {effectiveVotes} {effectiveVotes !== "1" ? "Votes" : "Vote"}
        </Button>
        {txFees && !isDisabled && (
          <span className="text-xs pl-0.5">
            Estimated Fees: {parseBN(txFees, activeChainConfig.tokenDecimals)}{" "}
            {activeChainConfig.tokenSymbol}
          </span>
        )}
        {errorMessage && (
          <span className="text-xs pl-0.5">⚠️ {errorMessage}</span>
        )}
      </div>
    </form>
  )
}
