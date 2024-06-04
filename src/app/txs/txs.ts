import { ApiPromise } from "@polkadot/api"
import { Signer } from "@polkadot/api/types"
import { BN } from "@polkadot/util"
import { ToastType } from "react-hot-toast"

import { DEFAULT_TOAST, sendAndFinalize } from "./send-and-finalize"

export async function sendDelegateTx(
  api: ApiPromise | undefined,
  signer: Signer | undefined,
  address: string | undefined,
  tracks: string[] = ["0"],
  target: string,
  conviction: number,
  value: BN
) {
  console.log("track in tx", tracks)

  if (tracks.length === 0 || !api || !signer || !address) {
    return
  }

  const txs = Array.from(tracks).map((track) =>
    api?.tx.convictionVoting.delegate(track, target, conviction, value)
  )

  const tx = api?.tx.utility.batchAll(txs)

  const res = await sendAndFinalize(api, tx, signer, address)
  return res
}

export async function nominateTx(
  api: ApiPromise | undefined,
  signer: Signer | undefined,
  address: string | undefined,
  targets: string[]
) {
  const tx = api?.tx.staking.nominate(targets)
  const res = await sendAndFinalize(api, tx, signer, address, {
    ...DEFAULT_TOAST,
    messages: {
      ...DEFAULT_TOAST.messages,
      success: "Nomination successful",
    },
  })
  return res
}

export async function bondAndNominateTx(
  api: ApiPromise | undefined,
  signer: Signer | undefined,
  address: string | undefined,
  targets: string[],
  amount: BN
) {
  const tx = api?.tx.utility.batch([
    api?.tx.staking.bond(amount, "Staked"),
    api?.tx.staking.nominate(targets),
  ])

  const res = await sendAndFinalize(api, tx, signer, address)
  return res
}

export async function joinPool(
  api: ApiPromise | undefined,
  signer: Signer | undefined,
  address: string | undefined,
  amount: BN,
  poolId: number
) {
  const tx = api?.tx.nominationPools.join(amount, poolId)
  const res = await sendAndFinalize(api, tx, signer, address)
  return res
}
