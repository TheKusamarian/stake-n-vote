import { ApiPromise } from "@polkadot/api"
import { BN, BN_ZERO } from "@polkadot/util"
import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

import useAccountBalances from "./use-account-balance"

export function useMaxDelegation() {
  const { activeAccount, activeChain, api, isConnected } = useInkathon()
  const { data: balances, isLoading: isAccountBalancesLoading } =
    useAccountBalances()

  return useQuery({
    queryKey: ["maxDelegation", activeChain?.name, activeAccount?.address],
    queryFn: async () => {
      const {
        data: { free, reserved, frozen },
      } = (await api!.query.system.account(
        activeAccount?.address
      )) as unknown as {
        data: { free: BN; reserved: BN; frozen: BN }
      }

      const available = free
        .sub(reserved)
        .sub(frozen)
        .add(balances?.stakedBalance || BN_ZERO)

      return available
    },
    enabled:
      !!api &&
      !!activeAccount &&
      !!activeChain &&
      isConnected &&
      !isAccountBalancesLoading,
  })
}
