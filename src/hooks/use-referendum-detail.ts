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
  voter: string
  decision: "aye" | "nay" | "abstain"
  balance: {
    aye: string
    nay: string
    abstain: string
  }
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

export async function getReferendumDetailPolkassembly(
  api: ApiPromise,
  referendumId: string
): Promise<{
  directVotes: {
    who: string
    vote: {
      aye: boolean
      conviction: number
      decision: "aye" | "nay" | "abstain"
    }
  }[]
  delegatedVotes: {
    who: string
    delegating: {
      target: string
      conviction: number
    }
  }[]
}> {
  const myHeaders = new Headers()
  myHeaders.append("x-network", "polkadot")

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  }

  const response = await fetch(
    `https://api.polkassembly.io/api/v1/votes?postId=${referendumId}&page=1&listingLimit=100000&voteType=ReferendumV2`,
    requestOptions
  )

  const data: {
    abstain: {
      count: number
      votes: PolkassemblyVote[]
    }
    yes: {
      count: number
      votes: PolkassemblyVote[]
    }
    no: {
      count: number
      votes: PolkassemblyVote[]
    }
  } = await response.json()

  const chaosDaoDelegatedVotes = data.yes.votes.find(
    (vote) => vote.voter === "13EyMuuDHwtq5RD6w3psCJ9WvJFZzDDion6Fd2FVAqxz1g7K"
  )?.delegatedVotes

  console.log("chaosDaoDelegatedVotes", chaosDaoDelegatedVotes)

  let directVoteCount = 0
  let delegatedVoteCount = 0

  const yesVotes = data.yes.votes.reduce(
    (acc: { direct: string[]; delegated: string[]; total: number }, vote) => {
      acc.direct.push(vote.voter)
      acc.total += 1
      directVoteCount += 1

      if (vote.delegatedVotes.length > 0) {
        for (const delegatedVote of vote.delegatedVotes) {
          acc.delegated.push(delegatedVote.voter)
          acc.total += 1
          delegatedVoteCount += 1
        }
      }
      return acc
    },
    { direct: [], delegated: [], total: 0 }
  )

  const noVotes = data.no.votes.reduce(
    (acc: { direct: string[]; delegated: string[]; total: number }, vote) => {
      acc.direct.push(vote.voter)
      acc.total += 1
      directVoteCount += 1
      if (vote.delegatedVotes.length > 0) {
        for (const delegatedVote of vote.delegatedVotes) {
          acc.delegated.push(delegatedVote.voter)
          acc.total += 1
          delegatedVoteCount += 1
        }
      }
      return acc
    },
    { direct: [], delegated: [], total: 0 }
  )

  const abstainVotes = data.abstain.votes.reduce(
    (acc: { direct: string[]; delegated: string[]; total: number }, vote) => {
      acc.direct.push(vote.voter)
      acc.total += 1
      directVoteCount += 1

      if (vote.delegatedVotes.length > 0) {
        for (const delegatedVote of vote.delegatedVotes) {
          acc.delegated.push(delegatedVote.voter)
          acc.total += 1
          delegatedVoteCount += 1
        }
      }
      return acc
    },
    { direct: [], delegated: [], total: 0 }
  )

  return {
    total: yesVotes.total + noVotes.total + abstainVotes.total,
    directVoteCount,
    delegatedVoteCount,
    yes: {
      count: yesVotes.total,
      //   hasDuplicates: new Set(yesVotes.direct).size !== yesVotes.total,
      votes: yesVotes,
    },
    no: {
      count: noVotes.total,
      //   hasDuplicates: new Set(noVotes.direct).size !== noVotes.total,
      votes: noVotes,
    },
    abstain: {
      count: abstainVotes.total,
      //   hasDuplicates:
      //     new Set(abstainVotes.direct).size !== abstainVotes.total,
      votes: abstainVotes,
    },
  }
}

export async function getReferendumVoters(api: ApiPromise) {
  // Get all voting records for the referendum
  const voting = await api.query.convictionVoting.votingFor.entries()

  const votes: ReferendumVotes = {
    directVotes: [],
    delegatedVotes: [],
  }

  //   Process each voting record
  for (const [key, value] of voting) {
    const [accountId, _] = key.args
    const voteInfo: PalletConvictionVotingVoteVoting =
      value as PalletConvictionVotingVoteVoting

    if (voteInfo.isCasting) {
      const directVote = voteInfo.asCasting.votes.find(
        ([refId]) => refId.toString() === referendumId
      )
      if (directVote) {
        const [_, vote] = directVote
        votes.directVotes.push({
          who: accountId.toString(),
          vote: {
            aye: vote,
            conviction: vote.conviction.toNumber(),
          },
        })
      }
    } else if (voteInfo.isDelegating) {
      const delegation = voteInfo.asDelegating
      votes.delegatedVotes.push({
        who: accountId.toString(),
        delegating: {
          target: delegation.target.toString(),
          conviction: delegation.conviction.toNumber(),
        },
        vote: {
          aye: false,
          conviction: 0,
        },
      })
    }

    await api.disconnect()
    return votes
  }
}

export function useReferendumDetail(referendumId: string | null) {
  return useQuery<SubsquareVote[], Error>({
    queryKey: ["referendumDetail", referendumId],
    queryFn: () => getReferendumVotes(referendumId!),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    enabled: !!referendumId,
  })
}
