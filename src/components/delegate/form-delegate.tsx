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
import { Track, useTracks } from "@/hooks/use-tracks"
import { useVotingFor } from "@/hooks/use-voting-for"
import { sendDelegateTx } from "@/app/txs/txs"

import { AmountInput } from "../AmountInput"
import { AvailableBalance } from "../AvailableBalance"
import { TrackSelect } from "../TrackSelect"
import TrackSelector from "../TrackSelector"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Option } from "../ui/multiple-selector"
import { Switch } from "../ui/switch"
import { DelegationInfo } from "./delegation-info"

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
  console.log("votingForForm", votingFor)

  const { data: trackOptions, isLoading: allTracksLoading } = useTracks()
  const ALL_TRACKS = trackOptions

  const [amount, setAmount] = useState(1)
  const [tracks, setTracks] = useState(ALL_TRACKS)
  const [isAllSelected, setIsAllSelected] = useState(true)

  useEffect(() => {
    setTracks(trackOptions || [])
  }, [trackOptions])

  const { activeAccount, activeSigner, activeChain, api } = useInkathon()
  const activeChainConfig = CHAIN_CONFIG[activeChain?.network || "Polkadot"]

  const { tokenSymbol, tokenDecimals } = activeChainConfig

  const [conviction, setConviction] = useState<number>(
    activeChain === kusamaRelay ? 1 : 3
  )
  const delegateBalance =
    !isNaN(amount) && amount !== 0
      ? new BN(amount).mul(new BN(10).pow(new BN(tokenDecimals)))
      : BN_ZERO

  const { freeBalance } = accountBalance || { freeBalance: "0" }

  const delegateToTheKus = async (e: any) => {
    e.preventDefault()

    const target =
      activeChain === kusamaRelay ? KUSAMA_DELEGATOR : POLKADOT_DELEGATOR

    const tx = await sendDelegateTx(
      api,
      activeSigner,
      activeChain,
      activeAccount?.address,
      tracks?.map((track) => track.value),
      target,
      conviction,
      delegateBalance
    )
  }

  const effectiveVotes = isNaN(amount)
    ? 0
    : conviction !== 0
    ? (amount * conviction).toFixed(2)
    : (amount * 0.1).toFixed(2)

  const marks = [
    {
      value: 0,
      label: "0.1x",
      description: "No lockup",
    },
    {
      value: 1,
      label: "1x",
      description: "Locked for 7 days",
    },
    {
      value: 2,
      label: "2x",
      description: "Locked for 14 days",
    },
    {
      value: 3,
      label: "3x",
      description: "Locked for 28 days",
    },
    {
      value: 4,
      label: "4x",
      description: "Locked for 56 days",
    },
    {
      value: 5,
      label: "5x",
      description: "Locked for 112 days",
    },
    {
      value: 6,
      label: "6x",
      description: "Locked for 224 days",
    },
  ]

  const delegateMax = (e: any) => {
    e.preventDefault()
    setAmount(parseBN(freeBalance?.toString(), tokenDecimals))
  }

  return (
    <form className="flex w-full max-w-xl flex-col gap-5 relative">
      {/* <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <Switch
            checked={isAllSelected}
            onCheckedChange={(val) => {
              if (val) {
                setTracks(ALL_TRACKS)
              }
              setIsAllSelected(val)
            }}
          />
          <Label htmlFor="airplane-mode" className="font-bold">
            Delegate Votes for all Governance Tracks
          </Label>
        </div>

        {!isAllSelected && (
          <TrackSelector
            options={trackOptions || []}
            value={tracks || []}
            onChange={setTracks}
          />
        )}
      </div> */}

      <TrackSelect className="w-full" />

      <div className="flex w-full max-w-full flex-row gap-3">
        <AmountInput
          info="staked"
          label="Delegation Amount"
          value={amount.toString()}
          onChange={(e) => {
            setAmount(parseFloat(e.target.value))
          }}
        >
          <Button
            onClick={delegateMax}
            variant="outline"
            className="h-10 border-2 flex-0 bg-default-100 hover:bg-pink-200"
            disabled={!isAccountBalanceSuccess}
          >
            Delegate Max
          </Button>
        </AmountInput>
      </div>
      <div className="flex w-full max-w-full flex-col gap-6">
        <Slider
          label="Conviction"
          color="danger"
          step={1}
          maxValue={6}
          showOutline={true}
          showSteps={true}
          marks={marks}
          //   defaultValue={1}
          value={conviction}
          onChange={(value) => setConviction(value as number)}
          getValue={(conviction) =>
            `${marks[conviction as number].description}`
          }
          className="max-w-full font-bold"
          classNames={{
            track: "bg-default-100 font-normal",
            value: "font-normal",
          }}
        />
      </div>
      <DelegationInfo value={votingFor} className="-mb-3" />
      <div className="flex w-full items-end gap-2">
        <Button
          className="w-full"
          onClick={delegateToTheKus}
          disabled={
            !isAccountBalanceSuccess ||
            allTracksLoading ||
            isVotingForLoading ||
            amount === 0
          }
        >
          Delegate {effectiveVotes} {effectiveVotes !== "1" ? "Votes" : "Vote"}
        </Button>
      </div>
    </form>
  )
}
