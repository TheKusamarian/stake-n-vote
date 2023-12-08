import { ApiPromise, WsProvider } from "@polkadot/api";
import { Signer, SubmittableExtrinsic } from "@polkadot/api/types";

import { Header } from "@polkadot/types/interfaces";
import toast from "react-hot-toast";

export interface SendAndFinalizeResult {
  status: string;
  message: string;
  txHash?: string;
  events?: any[];
  blockHeader?: Header;
  toast?: ToastType;
}

export type ToastType = {
  title: string;
  messages: {
    signing: string;
    entering: string;
    finalizing: string;
    success: string;
    error: string;
  };
};

export const DEFAULT_TOAST = {
  title: "Processing Transaction",
  messages: {
    signing: "1/3 Awaiting your signature",
    entering: "2/3 Waiting for transaction to enter block",
    finalizing: "3/3 Waiting for block finalization",
    success: "Transaction successful",
    error: "Oh no!",
  },
};

export async function sendAndFinalize(
  api: ApiPromise | undefined,
  tx: SubmittableExtrinsic<"promise"> | undefined,
  signer: Signer | undefined,
  address: string | undefined,
  toastConfig: ToastType = DEFAULT_TOAST,
  cb?: (res: any) => void
): Promise<SendAndFinalizeResult> {
  if (!api || !signer || !address) {
    return {
      status: "error",
      message: "Missing api, signer or address",
    };
  }

  await api.isReady;

  let toastId: string | undefined = undefined;
  let success = false;
  let included = [];
  let blockHeader: Header | undefined = undefined;

  const { messages } = toastConfig;

  if (toast) {
    toastId = toast.loading(messages.signing, {
      // @ts-ignore
      title: toast.title,
      className: "toaster",
    });
  }

  let res: SendAndFinalizeResult = {
    status: "error",
    message: "Transaction failed",
  };

  try {
    if (api && tx && signer && address) {
      const unsub = await tx.signAndSend(
        address,
        { signer },
        async (result) => {
          const { status, dispatchError, events = [], txHash } = result;
          if (status.isReady) {
            if (toastId) {
              toast.loading(messages.entering, {
                id: toastId,
              });
            }
          } else if (status.isInBlock) {
            success = dispatchError ? false : true;
            const signedBlock = await api?.rpc.chain.getBlock(status.asInBlock);
            blockHeader = signedBlock?.block.header;
            included = [...events];
            if (toastId) {
              toast.loading(messages.finalizing, {
                id: toastId,
              });
            }
          } else if (status.isFinalized) {
            console.log(
              `Transaction included at blockHash ${status.asFinalized}`
            );
            // events.forEach(({ phase, event: { data, method, section } }) => {
            //   // console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
            // });

            if (dispatchError) {
              if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = api?.registry.findMetaError(
                  dispatchError.asModule
                );
                const { docs, name, section } = decoded || {};

                res = {
                  status: "error",
                  message: docs?.join(" ") || "Unknown error",
                };
              } else {
                // Other, CannotLookup, BadOrigin, no extra info

                res = {
                  status: "error",
                  message: dispatchError.toString(),
                };

                toast.error(dispatchError.toString(), {
                  // @ts-ignore
                  title: toast.title,
                  className: "toaster",
                  id: toastId,
                });
              }

              toast.error(`${res.message}`, {
                // @ts-ignore
                title: toast.title,
                className: "toaster",
              });

              console.error(`${messages.error}: ${res.message}`);

              return;
            } else {
              res = {
                status: "success",
                message: `Transaction successful`,
                events,
                txHash: txHash.toString(),
                blockHeader,
              };

              if (toastId) {
                toast.success(messages.success, {
                  id: toastId,
                  duration: 4000,
                });
              }
            }
          }

          cb?.(res);
          unsub();
        }
      );
    }
  } catch (error) {
    console.log(error);
    toast.error(`${error}`, {
      // @ts-ignore
      title: toast.title,
      className: "toaster",
      id: toastId,
    });

    console.error(`${messages.error}: ${res.message}`);

    res = {
      status: "error",
      message: "Transaction failed",
    };

    cb?.(res);
  }

  return res;
}
