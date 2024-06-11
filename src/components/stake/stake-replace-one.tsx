import { Dispatch, SetStateAction, useCallback, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
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
import { useAccountNominators } from "@/hooks/use-account-nominations"
import { useStakingMetrics } from "@/hooks/use-min-nominator-bond"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/app/app-provider"
import { bondAndNominateTx, joinPool, nominateTx } from "@/app/txs/txs"

import { Loader } from "../loader"
import { NotConnected } from "../not-connected"
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
    const tx = await nominateTx(api, signer, activeAccount?.address, targets)
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

      <RadioGroup
        // label="Replace the following nominee"
        color="danger"
        // size="sm"
        value={selected}
        onValueChange={setSelected}
        // classNames={{
        //   description: "text-white",
        //   label: "text-white font-bold",
        // }}
      >
        {nominators?.map((address) => {
          // const { address, identity } = iden;
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
