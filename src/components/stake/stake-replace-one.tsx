"use client"

import { useState } from "react"
import Link from "next/link"
import { trimAddress } from "@/util"
import { ApiPromise } from "@polkadot/api"
import { Signer } from "@polkadot/api/types"
import { InjectedAccount } from "@polkadot/extension-inject/types"
import { BN, BN_ZERO, bnToBn } from "@polkadot/util"
import { SubstrateChain, useInkathon } from "@scio-labs/use-inkathon"

import { Button } from "@/components/ui/button"
import { nominateTx } from "@/app/txs/txs"

import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

export function ReplaceOneWithKus({
  nominators,
  validator,
  api,
  signer,
  activeAccount,
  activeChain,
}: {
  nominators: string[]
  validator: string
  api: ApiPromise | undefined
  signer: Signer | undefined
  activeAccount: InjectedAccount | null
  activeChain: SubstrateChain | undefined
}) {
  const [selected, setSelected] = useState<string | undefined>()

  // const { data: identities } = useIdentities(nominators);
  // console.log("in modal: identities", identities);

  const nominate = async (targets: string[]) => {
    const tx = await nominateTx(
      api,
      signer,
      activeChain,
      activeAccount?.address,
      targets
    )
  }

  const handleReplace = () => {
    if (selected) {
      const newTargets = nominators.map((item) =>
        item === selected ? validator : item
      )
      nominate(newTargets)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p>
        ⚠️ Your nominator set is full! Select one nomination to replace with Kus
        Validation
      </p>

      <RadioGroup color="danger" value={selected} onValueChange={setSelected}>
        {nominators?.map((address) => {
          return (
            <RadioGroupItem value={address} key={address}>
              <span className="text-white">{trimAddress(address, 12)} | </span>
              <Link
                href={`https://${activeChain?.network}.subscan.io/account/${address}`}
                target="_blank"
                rel="noreferrer"
                className="text-white underline"
              >
                subscan ↗
              </Link>
            </RadioGroupItem>
          )
        })}
      </RadioGroup>
      <Button
        className="w-full"
        color="danger"
        onClick={handleReplace}
        disabled={!selected}
        size="lg"
      >
        Replace above with Kus
      </Button>
    </div>
  )
}
