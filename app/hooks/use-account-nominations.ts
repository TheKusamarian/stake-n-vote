import { useQuery } from "react-query";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useChain } from "../providers/chain-provider";
import { usePolkadotExtension } from "../providers/extension-provider";
import { encodeAddress } from "@polkadot/keyring";

// Custom hook
export function useAccountNominators() {
  const { api, chainConfig, activeChain } = useChain();
  const { selectedAccount } = usePolkadotExtension();
  const { ss58Format } = chainConfig || {};

  const userAddress =
    selectedAccount?.address && ss58Format !== undefined
      ? encodeAddress(selectedAccount.address, ss58Format)
      : "";

  return useQuery(
    ["nominatedAddresses", userAddress, activeChain],
    async () => {
      // Fetch staking information
      const stakingInfo = await api?.query.staking.nominators(userAddress);

      if (!stakingInfo || stakingInfo.isNone) {
        return [];
      }

      // Extracting the addresses from staking info
      const { targets } = stakingInfo.unwrap();

      console.log(
        "useAccountNominators",
        targets.map((target) => target.toString())
      );
      return targets.map((target) => target.toString());
    },
    {
      enabled: !!api && !!userAddress,
    }
  );
}
