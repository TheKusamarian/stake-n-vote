import { useQuery } from "react-query"

import { fetchLatestVideos } from "@/lib/fetch-latest-videos"

export function useLatestYt(
  playlistId: string = "PLtyd7v_I7PGlMekTepCvnf8WMKVR1nhLZ"
) {
  return useQuery<any>(["latest-yt"], () => fetchLatestVideos(playlistId), {
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}
