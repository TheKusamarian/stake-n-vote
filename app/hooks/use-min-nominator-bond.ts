import { useQuery } from "react-query";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useChain } from "../providers/chain-provider";
import { encodeAddress } from "@polkadot/keyring";
import { BN } from "@polkadot/util";
import { useInkathon } from "@scio-labs/use-inkathon";

// Custom hook
export function useStakingMetrics() {
  const { activeChain, api, activeAccount } = useInkathon();

  const userAddress =
    activeAccount?.address && activeChain?.ss58Prefix !== undefined
      ? encodeAddress(activeAccount.address, activeChain?.ss58Prefix)
      : "";

  return useQuery(
    ["stakingMetrics", userAddress, activeChain],
    async () => {
      // Fetch staking information
      const [minNominatorBond, minimumActiveStake] = await Promise.all([
        api?.query.staking?.minNominatorBond(),
        api?.query.staking?.minimumActiveStake(),
      ]);
      return {
        minNominatorBond,
        minimumActiveStake,
      };
    },
    {
      enabled: !!api && !!userAddress,
    }
  );
}
