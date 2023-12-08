// @ts-nocheck
"use client";

import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import { Slider } from "@nextui-org/slider";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { sendDelegateTx } from "@/app/txs/txs";
import { bnToBn } from "@polkadot/util";
import { useChain } from "@/app/providers/chain-provider";
import { usePolkadotExtension } from "@/app/providers/extension-provider";
import { KUSAMA_DELEGATOR, POLKADOT_DELEGATOR } from "@/app/config";
import { on } from "events";
import { findChangedItem } from "@/app/util";
import { useTracks } from "@/app/hooks/use-tracks";

const ALL_TRACKS_ID = 9999;

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export function submitDelegation(prevState: State, formData: FormData) {
  return {
    errors: {
      status: ["Delegation Failed!"],
    },
    message: null,
  };
}

export default function FormDelegate() {
  const initialState = {
    message: null,
    errors: {},
  };

  const [state, dispatch] = useFormState(submitDelegation, initialState);
  const { pending, data, method, action } = useFormStatus();
  const { chainConfig } = useChain();
  const { ss58Format, tokenDecimals } = chainConfig;

  const [conviction, setConviction] = useState<number>(1);
  const [amount, setAmount] = useState(1);

  const [tracks, setTracks] = useState(new Set<string>(["9999"]));

  const delegateBalance = bnToBn(amount.toString()).mul(
    bnToBn(10).pow(bnToBn(tokenDecimals))
  );

  const { api, activeChain } = useChain(); // Using useChain hook
  const { selectedAccount, getSigner } = usePolkadotExtension(); // Using usePolkadotExtension hook

  const delegateToTheKus = async () => {
    const signer = await getSigner();
    const target =
      activeChain === "Kusama" ? KUSAMA_DELEGATOR : POLKADOT_DELEGATOR;
    const tx = await sendDelegateTx(
      api,
      signer,
      selectedAccount?.address,
      0,
      target,
      conviction,
      delegateBalance
    );
    console.log(tx);
  };

  const effectiveVotes = conviction !== 0 ? amount * conviction : amount * 0.1;

  const { data: trackOptions } = useTracks() || [];

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
  ];

  const handleSelectionChange = (selectedTracks: Set<string>) => {
    console.log(selectedTracks, "eeee");

    const changedItem = findChangedItem(tracks, selectedTracks);

    if (changedItem.includes(ALL_TRACKS_ID.toString())) {
      if (selectedTracks.has(ALL_TRACKS_ID.toString())) {
        // If ALL_TRACKS_ID was selected, set tracks to only contain ALL_TRACKS_ID
        setTracks(new Set([ALL_TRACKS_ID.toString()]));
      } else {
        // If ALL_TRACKS_ID was deselected, remove it and keep the other tracks
        selectedTracks.delete(ALL_TRACKS_ID.toString());
        setTracks(new Set(selectedTracks));
      }
    } else {
      // For other tracks, if ALL_TRACKS_ID is in the set and more tracks are selected, remove ALL_TRACKS_ID
      if (
        selectedTracks.has(ALL_TRACKS_ID.toString()) &&
        selectedTracks.size > 1
      ) {
        selectedTracks.delete(ALL_TRACKS_ID.toString());
      }
      setTracks(new Set(selectedTracks));
    }
  };

  return (
    <form className="flex flex-col gap-5 text-white" action={dispatch}>
      <Select
        label="Tracks"
        placeholder="Select Tracks"
        selectionMode="multiple"
        className="w-full"
        size="sm"
        classNames={{ description: "text-foreground-600" }}
        description="Select the tracks you want to delegate"
        selectedKeys={tracks}
        onSelectionChange={handleSelectionChange}
      >
        <SelectItem key={ALL_TRACKS_ID} value={ALL_TRACKS_ID}>
          All Tracks
        </SelectItem>
        {trackOptions?.map((track) => {
          return (
            <SelectItem key={track.id} value={track.id}>
              {track.name}
            </SelectItem>
          );
        })}
      </Select>

      <div className="flex flex-row gap-3 w-full max-w-full">
        <Input
          size="sm"
          type="number"
          label="Amount"
          placeholder="Enter Delegation Amount"
          description="Enter the amount you want to delegate"
          classNames={{ description: "text-foreground-600" }}
          value={amount.toString()}
          onChange={(e) => setAmount(parseInt(e.target.value))}
        />
        <Button variant="bordered" className="border-white h-14" size="lg">
          Delegate Max
        </Button>
      </div>
      <div className="flex flex-col gap-6 w-full max-w-full">
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
          className="max-w-full"
          classNames={{ track: "bg-default-100" }}
        />
      </div>
      <div className="w-full flex gap-2 items-end">
        <Button color="danger" className="w-full" onClick={delegateToTheKus}>
          Delegate {effectiveVotes} {effectiveVotes !== 1 ? "Votes" : "Vote"}
        </Button>
      </div>
    </form>
  );
}
