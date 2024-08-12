"use client"

import { ALL } from "dns"
import { useEffect, useMemo, useState } from "react"
import { findChangedItem, parseBN, safeToBn } from "@/util"
import { Slider } from "@nextui-org/slider"
import { SubmittableExtrinsic } from "@polkadot/api/types"
import { ISubmittableResult } from "@polkadot/types/types"
import { BN, BN_ZERO, bnToBn } from "@polkadot/util"
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
import { Track, useTracks } from "@/hooks/use-tracks"
import { useVotingFor } from "@/hooks/use-voting-for"
import { delegateTxs, sendDelegateTx } from "@/app/txs/txs"

import { AmountInput } from "../AmountInput"
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
  const {
    data: accountBalance,
    isLoading: isAccountBalanceLoading,
    isFetching: isAccountBalanceFetching,
    isSuccess: isAccountBalanceSuccess,
  } = useAccountBalances()

  const { data: votingFor, isLoading: isVotingForLoading } = useVotingFor()
  const { data: trackOptions, isLoading: allTracksLoading } = useTracks()

  const [amount, setAmount] = useState(1)
  const [isMaxAmount, setIsMaxAmount] = useState(false) // Track if the amount was set via "Delegate Max"
  const [tracks, setTracks] = useState<string[]>(
    trackOptions?.map((t) => t.value) || []
  )

  useEffect(() => {
    setTracks(trackOptions?.map((t) => t.value) || [])
  }, [trackOptions])

  const { activeAccount, activeSigner, activeChain, api } = useInkathon()
  const activeChainConfig = CHAIN_CONFIG[activeChain?.network || "Polkadot"]
  const target =
    activeChain === kusamaRelay ? KUSAMA_DELEGATOR : POLKADOT_DELEGATOR

  const { tokenDecimals } = activeChainConfig

  const [conviction, setConviction] = useState<number>(
    activeChain === kusamaRelay ? 3 : 1
  )

  const delegateBalance =
    !isNaN(amount) && amount !== 0
      ? new BN(amount).mul(new BN(10).pow(new BN(tokenDecimals)))
      : BN_ZERO

  const { data: maxDelegation } = useMaxDelegation()

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

  const txFees = useTransactionFee(tx, [activeAccount?.address])

  const maxAmount = useMemo(() => {
    if (!maxDelegation || !txFees) return amount
    return parseFloat(
      parseBN(maxDelegation.sub(txFees), tokenDecimals).toFixed(2)
    )
  }, [maxDelegation, txFees])

  useEffect(() => {
    // Adjust the amount whenever the maxAmount changes and the user had set the max amount
    if (isMaxAmount && amount !== maxAmount) {
      setAmount(maxAmount)
    }
  }, [maxAmount, isMaxAmount]) // Watching for changes in maxAmount and isMaxAmount

  const delegateToTheKus = async (e: any) => {
    e.preventDefault()

    const target =
      activeChain === kusamaRelay ? KUSAMA_DELEGATOR : POLKADOT_DELEGATOR

    const tx = await sendDelegateTx(
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

  const effectiveVotes = isNaN(amount)
    ? 0
    : conviction !== 0
    ? (amount * conviction).toFixed(2)
    : (amount * 0.1).toFixed(2)

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
          accountBalance?.stakedBalance || BN_ZERO,
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

  return (
    <form className="flex w-full max-w-xl flex-col gap-5 relative">
      <div>
        <Label htmlFor="airplane-mode" className="font-bold">
          Governance Tracks
        </Label>
        <TrackSelect className="w-full" values={tracks} onChange={setTracks} />
      </div>
      <div className="flex w-full max-w-full flex-row gap-3">
        <AmountInput
          info="staked"
          label="Delegation Amount"
          value={amount.toString()}
          onChange={handleAmountChange}
          max={parseBN(maxDelegation || "0", tokenDecimals)}
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
            disabled={!isAccountBalanceSuccess}
          >
            Delegate Max
          </Button>
        </AmountInput>
      </div>
      <ConvictionSlider
        value={conviction}
        onChange={(value) => setConviction(value as number)}
      />
      <DelegationVoteInfo
        value={votingFor}
        className="-mb-3 mt-4"
        selectedTracks={tracks}
      />
      <div className="flex w-full items-end gap-2">
        <Button
          className="w-full"
          onClick={delegateToTheKus}
          disabled={
            !isAccountBalanceSuccess ||
            allTracksLoading ||
            isVotingForLoading ||
            !amount ||
            amount === 0 ||
            tracks.length === 0
          }
        >
          Delegate {effectiveVotes} {effectiveVotes !== "1" ? "Votes" : "Vote"}
        </Button>
      </div>
    </form>
  )
}
