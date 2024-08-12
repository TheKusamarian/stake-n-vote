"use client"

import { useEffect } from "react"
import { PalletConvictionVotingVoteVoting } from "@polkadot/types/lookup"
import { useInkathon } from "@scio-labs/use-inkathon"
import { UseQueryResult, useQuery } from "react-query"

export type votingForType = {
  [key: string]: {
    casting: string[]
    delegating: { amount: string; to: string } | null
  }
}

export function useVotingFor(): UseQueryResult<votingForType> {
  const { api, activeAccount, activeChain } = useInkathon()

  return useQuery<votingForType>({
    queryKey: ["votingFor", activeChain?.name, activeAccount?.address],
    queryFn: async (): Promise<votingForType> => {
      // Fetch staking information
      const votingFor = await api?.query.convictionVoting.votingFor.entries(
        activeAccount?.address
      )

      // Construct the final result object
      const result = votingFor?.reduce((acc, [key, votes]) => {
        const trackId = key.args[1].toString() // Extract trackId from the storage key
        const voting = votes as PalletConvictionVotingVoteVoting // Explicitly cast to PalletConvictionVotingVoteVoting

        if (voting.isCasting) {
          // Extract the referendum indices where votes are cast
          const refIds = voting.asCasting.votes.map(([refId]: [any, any]) =>
            refId.toString()
          )
          if (!acc[trackId]) {
            acc[trackId] = { casting: [], delegating: null }
          }
          acc[trackId].casting.push(...refIds)
        } else if (voting.isDelegating) {
          // Extract delegation information
          const delegationInfo = {
            amount: voting.asDelegating.balance.toString(),
            to: voting.asDelegating.target.toString(),
          }
          acc[trackId] = { casting: [], delegating: delegationInfo }
        }

        return acc
      }, {} as votingForType)

      return result || {}
    },
    enabled: !!api,
  })
}
