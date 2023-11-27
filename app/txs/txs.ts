import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  DEFAULT_TOAST,
  SendAndFinalizeResult,
  sendAndFinalize,
} from "./send-and-finalize";
import {
  KUSAMA_DELEGATOR,
  KUSAMA_VALIDATOR_SET,
  POLKADOT_DELEGATOR,
  POLKADOT_VALIDATOR_SET,
} from "../config";
import { useChain } from "../providers/chain-provider";
import { usePolkadotExtension } from "../providers/extension-provider";
import { ISubmittableResult } from "@polkadot/types/types";
import { Signer, SubmittableExtrinsic } from "@polkadot/api/types";
import { useCallback, useState } from "react";
import { BN } from "@polkadot/util";

export async function nominateTheKusSet(chain: string) {
  const nominators =
    chain === "polkadot" ? POLKADOT_VALIDATOR_SET : KUSAMA_VALIDATOR_SET;
  const { api } = useChain();
  return await sendNominateTx(api, nominators);
}

async function _sendAndFinalizeWithActiveAccount(
  tx: SubmittableExtrinsic<"promise", ISubmittableResult> | undefined
) {
  const { api } = useChain();
  const { selectedAccount, getSigner } = usePolkadotExtension();
  const signer = await getSigner();
  return await sendAndFinalize(
    api,
    tx,
    signer,
    selectedAccount?.address,
    DEFAULT_TOAST
  );
}

export async function sendNominateTx(
  api: ApiPromise | undefined,
  nominators: string[],
  cb?: (result: any) => void
) {
  if (!api) {
    return;
  }

  const tx = api.tx.staking.nominate(nominators);
  const res: SendAndFinalizeResult = await _sendAndFinalizeWithActiveAccount(
    tx
  );

  return res;
}

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
