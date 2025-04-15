import { ApiPromise } from "@polkadot/api"
import { SubmittableExtrinsic } from "@polkadot/api/types"
import { ISubmittableResult, Signer } from "@polkadot/types/types/extrinsic"
import { BN } from "@polkadot/util"
import { SubstrateChain } from "@scio-labs/use-inkathon"
import { ToastType } from "react-hot-toast"
import { toast } from "sonner"

import { votingForType } from "@/hooks/use-voting-for"

import { DEFAULT_TOAST, sendAndFinalize } from "./send-and-finalize"

export function delegateTxs(
  api: ApiPromise | undefined,
  signer: Signer | undefined,
  activeChain: SubstrateChain | undefined,
  address: string | undefined,
  tracks: string[] = ["0"],
  target: string,
  conviction: number,
  value: BN,
  votingFor: votingForType | undefined
) {
  if (tracks.length === 0 || !api || !signer || !address || !votingFor) {
    return
  }

  const removeVoteTxs = Array.from(tracks).reduce((acc, track) => {
    const votes = votingFor[track]?.casting || []
    const removeVotes = votes.map((vote) =>
      api?.tx.convictionVoting.removeVote(track, vote)
    )
    return [...acc, ...removeVotes]
  }, [] as SubmittableExtrinsic<"promise", ISubmittableResult>[])

  const undelegateTxs = Array.from(tracks).reduce((acc, track) => {
    const delegations = votingFor[track]?.delegating

    if (!delegations) {
      return acc
    }

    const undelegate = api?.tx.convictionVoting.undelegate(track)
    return [...acc, undelegate]
  }, [] as SubmittableExtrinsic<"promise", ISubmittableResult>[])

  const delegateTxs = Array.from(tracks).map((track) =>
    api?.tx.convictionVoting.delegate(track, target, conviction, value)
  )

  const tx = api?.tx.utility.batchAll([
    ...removeVoteTxs,
    ...undelegateTxs,
    ...delegateTxs,
  ])

  return tx
}

export async function sendDelegateTx(
  api: ApiPromise | undefined,
  signer: any,
  activeChain: SubstrateChain | undefined,
  address: string | undefined,
  tracks: string[] = ["0"],
  target: string,
  conviction: number,
  value: BN,
  votingFor: votingForType | undefined
) {
  if (tracks.length === 0 || !api || !signer || !address || !votingFor) {
    return
  }

  const tx = delegateTxs(
    api,
    signer,
    activeChain,
    address,
    tracks,
    target,
    conviction,
    value,
    votingFor
  )

  const res = await sendAndFinalize({
    api,
    tx,
    signer,
    address,
    activeChain,
    toastConfig: {
      ...DEFAULT_TOAST,
      title: "Delegating Votes",
      messages: {
        ...DEFAULT_TOAST.messages,
        success: "Delegation successful",
      },
    },
  })

  return res
}

export function createCollectionTx(
  api: ApiPromise | undefined,
  signer: any,
  activeChain: SubstrateChain | undefined,
  address: string | undefined
) {
  const admin = {
    Id: address,
  }
  const config = {
    max_supply: null,
    mint_settings: {
      default_item_settings: 0,
      end_block: null,
      mint_type: "Issuer",
      price: null,
      start_block: null,
    },
    settings: 0,
  }

  const tx = api?.tx.nfts.create(admin, config)
  return tx
}

export async function nominateTx(
  api: ApiPromise | undefined,
  signer: any,
  activeChain: SubstrateChain | undefined,
  address: string | undefined,
  targets: string[]
) {
  const tx = api?.tx.staking.nominate(targets)
  const res = await sendAndFinalize({
    api,
    tx,
    signer,
    activeChain,
    address,
    toastConfig: {
      ...DEFAULT_TOAST,
      messages: {
        ...DEFAULT_TOAST.messages,
        success: "Nomination successful",
      },
    },
  })
  return res
}

export async function bondAndNominateTx(
  api: ApiPromise | undefined,
  signer: any,
  activeChain: SubstrateChain | undefined,
  address: string | undefined,
  targets: string[],
  amount: BN
) {
  const tx = api?.tx.utility.batch([
    api?.tx.staking.bond(amount, "Staked"),
    api?.tx.staking.nominate(targets),
  ])

  const res = await sendAndFinalize({
    api,
    tx,
    signer,
    address,
    activeChain,
    toastConfig: {
      ...DEFAULT_TOAST,
      // @ts-ignore
      title: `Staking ${activeChain?.tokenSymbol}`,
      messages: {
        ...DEFAULT_TOAST.messages,
        success: "Staking successful",
      },
    },
  })
  return res
}

export async function joinPool(
  api: ApiPromise | undefined,
  signer: any,
  activeChain: SubstrateChain | undefined,
  address: string | undefined,
  amount: BN,
  poolId: number
) {
  const tx = api?.tx.nominationPools.join(amount.toString(), poolId)
  const res = await sendAndFinalize({ api, tx, signer, address, activeChain })
  return res
}

export async function stakeMoreTx(
  api: ApiPromise | undefined,
  signer: any,
  activeChain: SubstrateChain | undefined,
  address: string | undefined,
  amount: BN,
  fromPool: boolean = false
) {
  const tx = fromPool
    ? api?.tx.nominationPools.bondExtra({ FreeBalance: amount })
    : api?.tx.staking.bondExtra(amount)

  const res = await sendAndFinalize({
    api,
    tx,
    signer,
    address,
    activeChain,
    toastConfig: {
      ...DEFAULT_TOAST,
      // @ts-ignore
      title: `Staking ${activeChain?.tokenSymbol}`,
      messages: {
        ...DEFAULT_TOAST.messages,
        success: "Staking successful",
      },
    },
  })
  return res
}

export async function unstakeTx(
  api: ApiPromise | undefined,
  signer: any,
  activeChain: SubstrateChain | undefined,
  address: string,
  amount: BN,
  fromPool: boolean = false
) {
  const tx = fromPool
    ? api?.tx.nominationPools.unbond(address, amount)
    : api?.tx.staking.unbond(amount)

  const res = await sendAndFinalize({
    api,
    tx,
    signer,
    address,
    activeChain,
    toastConfig: {
      ...DEFAULT_TOAST,
      // @ts-ignore
      title: `Unstaking ${activeChain?.tokenSymbol}`,
      messages: {
        ...DEFAULT_TOAST.messages,
        success: "Unstaking successful",
      },
    },
  })
  return res
}
