import { redirect } from "next/navigation"
import { ApiPromise } from "@polkadot/api"
import { PalletConvictionVotingVoteVoting } from "@polkadot/types/lookup"
import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

interface VoterInfo {
  who: string
  vote?: {
    aye: boolean
    conviction: number
  }
  delegating?: {
    target: string
    conviction: number
  }
}

interface SubsquareVote {
  referendumIndex: number
  account: string
  isDelegating: boolean
  isStandard: boolean
  isSplit: boolean
  isSplitAbstain: boolean
  balance: string
  aye: boolean
  conviction: number
  votes: string
  abstainBalance?: string
  abstainVotes?: string
  ayeBalance?: string
  ayeVotes?: string
  nayBalance?: string
  nayVotes?: string
  delegations: {
    votes: string
    capital: string
  }
  queryAt: 23824700
}

interface ReferendumVotes {
  directVotes: VoterInfo[]
  delegatedVotes: VoterInfo[]
}

export async function getReferendumVotes(referendumId: string) {
  const endpoint = `https://polkadot.subsquare.io/api/gov2/referenda/${referendumId}/votes`
  const response = await fetch(endpoint)
  const data = (await response.json()) as SubsquareVote[]
  return data
}

export function useReferendumDetail(referendumId: string | undefined) {
  return useQuery<SubsquareVote[], Error>({
    queryKey: ["referendumDetail", referendumId],
    queryFn: () => getReferendumVotes(referendumId!),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    enabled: !!referendumId,
  })
}
