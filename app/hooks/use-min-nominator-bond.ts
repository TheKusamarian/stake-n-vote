import { useQuery } from "react-query";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useChain } from "../providers/chain-provider";
import { usePolkadotExtension } from "../providers/extension-provider";
import { encodeAddress } from "@polkadot/keyring";
import { BN } from "@polkadot/util";

// Custom hook
export function useMinNominatorBond() {
  const { api, chainConfig, activeChain } = useChain();
  const { selectedAccount } = usePolkadotExtension();
  const { ss58Format } = chainConfig || {};

  const userAddress =
    selectedAccount?.address && ss58Format !== undefined
      ? encodeAddress(selectedAccount.address, ss58Format)
      : "";

  return useQuery(
    ["minNominatorBond", userAddress, activeChain],
    async () => {
      // Fetch staking information
      const minNominatorBond = await api?.query.staking?.minNominatorBond();
      return minNominatorBond;
    },
    {
      enabled: !!api && !!userAddress,
    }
  );
}
