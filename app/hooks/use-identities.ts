import { useQuery } from "react-query";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useChain } from "../providers/chain-provider";
import { usePolkadotExtension } from "../providers/extension-provider";
import { encodeAddress } from "@polkadot/keyring";
import { BN } from "@polkadot/util";

// Custom hook
export function useIdentities(addresses: string[]) {
  const { api, chainConfig, activeChain } = useChain();

  const fetchIdentities = async () => {
    // Fetch identities for the provided addresses
    const identities = await api?.query.identity.identityOf.multi(addresses);

    if (!identities) {
      return addresses.map((address) => {
        return {
          address,
          identity: null,
        };
      });
    }

    // Map the results to the desired format
    const result = addresses.map((address, index) => {
      return {
        address: address,
        identity: identities[index].unwrapOr(null)?.toHuman(),
      };
    });

    console.log(result);

    return result;
  };

  return useQuery(
    ["minNominatorBond", activeChain],
    async () => fetchIdentities(),
    {
      enabled: !!api,
    }
  );
}
