"use client"

import { AugmentedConst } from "@polkadot/api/types"
import { u128 } from "@polkadot/types"
import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

export interface Track {
  value: string
  label: string
}

export function useExistentialDeposit() {
  const { api, activeChain } = useInkathon()

  return useQuery<(u128 & AugmentedConst<"promise">) | undefined>(
    ["ed", activeChain?.name],
    async () => {
      const ed = await api?.consts.balances.existentialDeposit
      return ed
    },
    {
      enabled: !!api,
    }
  )
}
