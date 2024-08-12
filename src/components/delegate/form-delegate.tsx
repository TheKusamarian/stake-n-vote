"use client"

import { ALL } from "dns"
import { useEffect, useState } from "react"
import { findChangedItem, parseBN, safeToBn } from "@/util"
import { Slider } from "@nextui-org/slider"
import { BN, BN_ZERO, bnToBn } from "@polkadot/util"
import { useInkathon } from "@scio-labs/use-inkathon"

import { kusamaRelay } from "@/config/chains"
import {
  CHAIN_CONFIG,
  KUSAMA_DELEGATOR,
  POLKADOT_DELEGATOR,
} from "@/config/config"
import useAccountBalances from "@/hooks/use-account-balance"
import { useMaxDelegation } from "@/hooks/use-max-delegation"
import { Track, useTracks } from "@/hooks/use-tracks"
import { useVotingFor } from "@/hooks/use-voting-for"
import { sendDelegateTx } from "@/app/txs/txs"

import { AmountInput } from "../AmountInput"
import { ConvictionSlider } from "../conviction-slider"
import { TrackSelect } from "../track-select"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { DelegationVoteInfo } from "./delegation-vote-info"

// const ALL_TRACKS_ID = 9999
// const ALL_TRACKS_OPTION = {
//   value: ALL_TRACKS_ID.toString(),
//   label: "All Tracks",
// }

const MAX_ALLOWED_DELEGATION = 999999999

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
  const ALL_TRACKS = trackOptions

  const [amount, setAmount] = useState(1)
  const [tracks, setTracks] = useState<string[]>(
    trackOptions?.map((t) => t.value) || []
  )
  const [isAllSelected, setIsAllSelected] = useState(true)

  useEffect(() => {
    setTracks(trackOptions?.map((t) => t.value) || [])
  }, [trackOptions])

  const { activeAccount, activeSigner, activeChain, api } = useInkathon()
  const activeChainConfig = CHAIN_CONFIG[activeChain?.network || "Polkadot"]

  const { tokenDecimals } = activeChainConfig

  const [conviction, setConviction] = useState<number>(
    activeChain === kusamaRelay ? 3 : 1
  )
  const delegateBalance =
    !isNaN(amount) && amount !== 0
      ? new BN(amount).mul(new BN(10).pow(new BN(tokenDecimals)))
      : BN_ZERO

  const { data: maxDelegation } = useMaxDelegation()

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
    setAmount(
      parseFloat(parseBN(maxDelegation || "0", tokenDecimals).toFixed(2))
    )
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
          onChange={(e) => {
            setAmount(parseFloat(e.target.value))
          }}
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
            amount === 0
          }
        >
          Delegate {effectiveVotes} {effectiveVotes !== "1" ? "Votes" : "Vote"}
        </Button>
      </div>
    </form>
  )
}
