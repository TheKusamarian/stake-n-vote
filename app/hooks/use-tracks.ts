import { useQuery } from "react-query";
import { useChain } from "../providers/chain-provider";
import { usePolkadotExtension } from "../providers/extension-provider";
import { encodeAddress } from "@polkadot/keyring";

export interface Track {
  id: number;
  name: string;
}

// Custom hook
export function useTracks() {
  const { api, activeChain } = useChain();

  return useQuery<Track[] | undefined>(
    ["tracks", activeChain],
    async () => {
      // Fetch staking information
      const tracks = await api?.consts.referenda.tracks;
      return tracks?.map(([trackId, data]) => {
        return {
          id: trackId.toNumber(),
          name: data.name
            .toString()
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        };
      });
    },
    {
      enabled: !!api,
    }
  );
}
