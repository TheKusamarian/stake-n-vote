import { useQuery } from "react-query";
import { useInkathon } from "@scio-labs/use-inkathon";
import { fetchLatestVideo } from "../lib/latest-yt";

export function useLatestYt() {
  return useQuery<any>(["latest-yt"], fetchLatestVideo, {
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
