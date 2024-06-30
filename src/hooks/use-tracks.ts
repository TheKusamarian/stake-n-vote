"use client"

import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

import { Option } from "@/components/ui/multiple-selector"

export interface Track {
  value: string
  label: string
}

// Custom hook
export function useTracks() {
  const { api, activeChain } = useInkathon()

  return useQuery<Option[] | undefined>(
    ["tracks", activeChain?.name],
    async () => {
      // Fetch staking information
      const tracks = await api?.consts.referenda.tracks
      return tracks?.map(([trackId, data]) => {
        return {
          value: trackId.toString(),
          label: data.name
            .toString()
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        }
      })
    },
    {
      enabled: !!api,
    }
  )
}
