import { encodeAddress } from "@polkadot/keyring"
import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

// Custom hook
export function useStakingMetrics() {
  const { activeChain, api, activeAccount } = useInkathon()

  const userAddress =
    activeAccount?.address && activeChain?.ss58Prefix !== undefined
      ? encodeAddress(activeAccount.address, activeChain?.ss58Prefix)
      : ""

  return useQuery(
    ["stakingMetrics", userAddress, activeChain],
    async () => {
      // Fetch staking information
      const [minNominatorBond, minimumActiveStake] = await Promise.all([
        api?.query.staking?.minNominatorBond(),
        api?.query.staking?.minimumActiveStake(),
      ])
      return {
        minNominatorBond,
        minimumActiveStake,
      }
    },
    {
      enabled: !!api && !!userAddress,
    }
  )
}
