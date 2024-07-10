"use client"

import { AugmentedConst } from "@polkadot/api/types"
import { u128 } from "@polkadot/types"
import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

import { Option } from "@/components/ui/multiple-selector"

export interface Track {
  value: string
  label: string
}

// Custom hook
export function useExistentialDeposit() {
  const { api, activeChain } = useInkathon()

  return useQuery<(u128 & AugmentedConst<"promise">) | undefined>(
    ["ed", activeChain?.name],
    async () => {
      // Fetch staking information
      const ed = await api?.consts.balances.existentialDeposit
      return ed
    },
    {
      enabled: !!api,
    }
  )
}
