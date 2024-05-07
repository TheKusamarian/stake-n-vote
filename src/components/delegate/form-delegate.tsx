'use client'

import { Select, SelectItem } from '@nextui-org/select'
import { Slider } from '@nextui-org/slider'
import { useState } from 'react'
import { sendDelegateTx } from '@/app/txs/txs'
import { BN_ZERO, bnToBn } from '@polkadot/util'
import {
  CHAIN_CONFIG,
  KUSAMA_DELEGATOR,
  POLKADOT_DELEGATOR,
} from '@/config/config'

import { KusamaIcon, PolkadotIcon } from '../../icons'
import { useInkathon } from '@scio-labs/use-inkathon'
import { useTracks } from '@/hooks/use-tracks'
import useAccountBalances from '@/hooks/use-account-balance'
import { kusamaRelay } from '@/config/chains'
import { findChangedItem, parseBN } from '@/util'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

const ALL_TRACKS_ID = 9999

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
      status: ['Delegation Failed!'],
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

  const { data: trackOptions } = useTracks() || []
  const ALL_TRACKS = trackOptions?.map((track) => track.id.toString()) || [
    ALL_TRACKS_ID.toString(),
  ]

  const [amount, setAmount] = useState(1)
  const [tracks, setTracks] = useState(new Set<string>(ALL_TRACKS))
  const [isAllSelected, setIsAllSelected] = useState(true)

  const { activeAccount, activeSigner, activeChain, api } = useInkathon()
  const activeChainConfig = CHAIN_CONFIG[activeChain?.network || 'Polkadot']

  const { tokenSymbol, tokenDecimals } = activeChainConfig

  const [conviction, setConviction] = useState<number>(
    activeChain === kusamaRelay ? 1 : 3,
  )

  const delegateBalance =
    !isNaN(amount) && amount !== 0
      ? bnToBn(amount * Math.pow(10, tokenDecimals))
      : BN_ZERO
  const { freeBalance } = accountBalance || { freeBalance: '0' }

  const delegateToTheKus = async (e) => {
    e.preventDefault()

    const target =
      activeChain === kusamaRelay ? KUSAMA_DELEGATOR : POLKADOT_DELEGATOR

    let tracksArray = Array.from(tracks)

    if (tracksArray.includes(ALL_TRACKS_ID.toString())) {
      tracksArray = ALL_TRACKS
    }

    // setTracks(new Set([ALL_TRACKS_ID.toString()]));

    const tx = await sendDelegateTx(
      api,
      activeSigner,
      activeAccount?.address,
      tracksArray,
      target,
      conviction,
      delegateBalance,
    )
  }

  const effectiveVotes = conviction !== 0 ? amount * conviction : amount * 0.1

  const marks = [
    {
      value: 0,
      label: '0.1x',
      description: 'No lockup',
    },
    {
      value: 1,
      label: '1x',
      description: 'Locked for 7 days',
    },
    {
      value: 2,
      label: '2x',
      description: 'Locked for 14 days',
    },
    {
      value: 3,
      label: '3x',
      description: 'Locked for 28 days',
    },
    {
      value: 4,
      label: '4x',
      description: 'Locked for 56 days',
    },
    {
      value: 5,
      label: '5x',
      description: 'Locked for 112 days',
    },
    {
      value: 6,
      label: '6x',
      description: 'Locked for 224 days',
    },
  ]

  const handleSelectionChange = (selectedTracks: Set<string>) => {
    const changedItem = findChangedItem(tracks, selectedTracks)

    if (changedItem.includes(ALL_TRACKS_ID.toString())) {
      if (selectedTracks.has(ALL_TRACKS_ID.toString())) {
        // If ALL_TRACKS_ID was selected, set tracks to only contain ALL_TRACKS_ID
        setTracks(new Set([ALL_TRACKS_ID.toString()]))
      } else {
        // If ALL_TRACKS_ID was deselected, remove it and keep the other tracks
        selectedTracks.delete(ALL_TRACKS_ID.toString())
        setTracks(new Set(selectedTracks))
      }
    } else {
      // For other tracks, if ALL_TRACKS_ID is in the set and more tracks are selected, remove ALL_TRACKS_ID
      if (
        selectedTracks.has(ALL_TRACKS_ID.toString()) &&
        selectedTracks.size > 1
      ) {
        selectedTracks.delete(ALL_TRACKS_ID.toString())
      }
      setTracks(new Set(selectedTracks))
    }
  }

  const delegateMax = (e) => {
    e.preventDefault()
    setAmount(parseBN(freeBalance?.toString(), tokenDecimals))
  }

  const trackOptionsWithAll = [
    { id: ALL_TRACKS_ID, name: 'All Tracks' },
    ...(trackOptions || []),
  ]

  return (
    <form className="flex w-full max-w-xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <Switch checked={isAllSelected} onCheckedChange={setIsAllSelected} />
          <Label htmlFor="airplane-mode" className="font-bold">
            Delegate Votes for all Governance Tracks
          </Label>
        </div>

        {!isAllSelected && (
          <Select
            label="Tracks"
            placeholder="Select Tracks"
            selectionMode="multiple"
            size="sm"
            classNames={{
              mainWrapper: 'lg:max-w-2xl',
              trigger: 'bg-white',
              listbox: 'bg-white',
              description: 'text-gray-100',
            }}
            description="Select the governance tracks you want to delegate"
            selectedKeys={tracks}
            // @ts-ignore
            onSelectionChange={handleSelectionChange}
          >
            {trackOptionsWithAll.map((track) => {
              return (
                <SelectItem key={track.id} value={track.id}>
                  {track.name}
                </SelectItem>
              )
            })}
          </Select>
        )}
      </div>

      <div className="flex w-full max-w-full flex-row gap-3">
        <div className="flex w-full gap-2">
          {/* <Input
            size="sm"
            type="number"
            label="Amount"
            placeholder="Enter Delegation Amount"
            classNames={{ description: 'text-foreground-600' }}
            value={amount.toString()}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            endContent={
              <>
                {tokenSymbol}
                {activeChain === kusamaRelay ? (
                  <KusamaIcon className="pl-1 pt-1" />
                ) : (
                  <PolkadotIcon className="pl-1 pt-1" />
                )}
              </>
            }
          /> */}
          <div className="flex w-full max-w-sm items-end space-x-2">
            <div>
              <Label htmlFor="amount" className="font-bold">
                Delegation Amount
              </Label>
              <Input
                id="amount"
                type="number"
                min={0}
                // max={}
                placeholder="Enter Delegation Amount"
                value={amount.toString()}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="text-black"
              />
            </div>
            <span className="flex h-10 w-12 items-center pr-4 text-sm font-bold">
              {tokenSymbol}
            </span>
            <Button
              onClick={delegateMax}
              variant="outline"
              // isDisabled={!isAccountBalanceSuccess}
            >
              Delegate Max
            </Button>
          </div>
          {/* <Button
            onClick={delegateMax}
            className="bg-transparent! h-12 border border-2 border-white px-4 hover:bg-white/10"
            size="sm"
            variant={'outlined'}
            isDisabled={!isAccountBalanceSuccess}
          >
            Delegate Max
          </Button> */}
        </div>
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
            track: 'bg-default-100 font-normal',
            value: 'font-normal',
          }}
        />
      </div>
      <div className="flex w-full items-end gap-2">
        <Button
          className="w-full"
          onClick={delegateToTheKus}
          // isDisabled={!isAccountBalanceSuccess}
        >
          Delegate {effectiveVotes} {effectiveVotes !== 1 ? 'Votes' : 'Vote'}
        </Button>
      </div>
    </form>
  )
}
