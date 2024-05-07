import { useQuery } from "react-query";
import { useInkathon } from "@scio-labs/use-inkathon";

export interface Track {
  id: number;
  name: string;
}

// Custom hook
export function useTracks() {
  const { api, activeChain } = useInkathon();

  return useQuery<Track[] | undefined>(
    ["tracks", activeChain?.name],
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
