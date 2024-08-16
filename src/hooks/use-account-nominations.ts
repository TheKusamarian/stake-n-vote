"use client"

import { encodeAddress } from "@polkadot/keyring"
import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

export function useAccountNominators() {
  const { api, activeChain, activeAccount } = useInkathon()

  const userAddress =
    activeAccount?.address && activeChain?.ss58Prefix !== undefined
      ? encodeAddress(activeAccount.address, activeChain?.ss58Prefix)
      : ""

  return useQuery(
    ["nominatedAddresses", userAddress, activeChain],
    async () => {
      // Fetch staking information
      const stakingInfo = await api?.query.staking.nominators(userAddress)

      if (!stakingInfo || stakingInfo.isNone) {
        return []
      }

      // Extracting the addresses from staking info
      const { targets } = stakingInfo.unwrap()
      return targets.map((target) => target.toString())
    },
    {
      enabled: !!api && !!userAddress,
    }
  )
}
