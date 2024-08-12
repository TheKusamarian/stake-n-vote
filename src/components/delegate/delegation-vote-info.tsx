import { useInkathon } from "@scio-labs/use-inkathon"
import { UseQueryResult } from "react-query"

import { CHAIN_CONFIG } from "@/config/config"
import { useTracks } from "@/hooks/use-tracks"
import { votingForType } from "@/hooks/use-voting-for"

import { Information } from "../Information"

export function DelegationVoteInfo({
  value,
  selectedTracks,
  className,
}: {
  value?: votingForType
  selectedTracks: string[]
  className?: string
}) {
  const delegating = Object.keys(value || {}).filter(
    (trackId) => value?.[trackId]?.delegating
  )

  const voting = Object.keys(value || {}).filter(
    (trackId) => value?.[trackId]?.casting.length
  )

  const delegationIntersection = selectedTracks.filter((trackId) =>
    delegating.includes(trackId)
  )

  const votingIntersection = selectedTracks.filter((trackId) =>
    voting.includes(trackId)
  )

  let message = ""

  if (votingIntersection.length > 0 && delegationIntersection.length > 0) {
    message = `You are already delegating your votes for ${delegationIntersection.length} selected tracks and have active votes on ${votingIntersection.length} selected tracks. These delegations and votes will be replaced if you delegate to the selected tracks.`
  } else if (votingIntersection.length > 0) {
    message = `You have active votes on ${votingIntersection.length} selected tracks. The votes will be removed if you delegate to the selected tracks.`
  } else if (delegationIntersection.length > 0) {
    message = `You are already delegating your votes for ${delegationIntersection.length} tracks. These delegations will be replaced if you delegate your votes on the selected tracks.`
  }

  if (delegationIntersection.length || votingIntersection.length) {
    return (
      <Information type="warning" className={className}>
        {message}
      </Information>
    )
  }

  return null
}
