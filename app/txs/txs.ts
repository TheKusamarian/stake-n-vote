import { ApiPromise } from "@polkadot/api";

import { Signer } from "@polkadot/api/types";
import { BN } from "@polkadot/util";
import { sendAndFinalize } from "./send-and-finalize";

export async function sendDelegateTx(
  api: ApiPromise | undefined,
  signer: Signer | undefined,
  address: string | undefined,
  track: number = 0,
  target: string,
  conviction: number,
  value: BN
) {
  const tx = api?.tx.convictionVoting.delegate(
    track,
    target,
    conviction,
    value
  );
  const res = await sendAndFinalize(api, tx, signer, address);
  return res;
}

export async function nominateTx(
  api: ApiPromise | undefined,
  signer: Signer | undefined,
  address: string | undefined,
  targets: string[]
) {
  const tx = api?.tx.staking.nominate(targets);
  const res = await sendAndFinalize(api, tx, signer, address);
  return res;
}
