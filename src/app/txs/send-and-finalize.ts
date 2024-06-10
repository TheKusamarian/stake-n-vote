import { ApiPromise, WsProvider } from "@polkadot/api"
import { Signer, SubmittableExtrinsic } from "@polkadot/api/types"
import { Header } from "@polkadot/types/interfaces"
import { Callback, ISubmittableResult } from "@polkadot/types/types"
import { SubstrateChain } from "@scio-labs/use-inkathon"
import { toast } from "sonner"

export interface SendAndFinalizeResult {
  status: string
  message: string
  txHash?: string
  events?: any[]
  blockHeader?: Header
  toast?: ToastType
}

export type ToastType = {
  title: string
  messages: {
    signing: string
    entering: string
    finalizing: string
    success: string
    error: string
  }
}

export const DEFAULT_TOAST = {
  title: "Processing Transaction",
  messages: {
    signing: "1/3 Awaiting your signature",
    entering: "2/3 Waiting for transaction to enter block",
    finalizing: "3/3 Waiting for block finalization",
    success: "Transaction successful",
    error: "Oh no!",
  },
}

export async function sendAndFinalize3(config: {
  api: ApiPromise | undefined
  tx: SubmittableExtrinsic<"promise"> | undefined
  signer: Signer | undefined
  address: string | undefined
  toastConfig?: ToastType
  activeChain: SubstrateChain | undefined
  statusCb?: Callback<ISubmittableResult>
  cb?: (res: any) => void
}): Promise<SendAndFinalizeResult> {
  const {
    api,
    tx,
    signer,
    address,
    toastConfig = DEFAULT_TOAST,
    cb,
    statusCb,
    activeChain,
  } = config

  if (!api || !signer || !address || !tx || !activeChain) {
    return {
      status: "error",
      message: "Missing api, signer, tx or address",
    }
  }

  await api.isReady

  let toastId: string | number = ""
  let success = false
  let blockHeader: Header | undefined = undefined

  const { messages } = toastConfig

  if (toastConfig) {
    // @ts-ignore
    toastId = toast.loading(toastConfig.title, {
      description: messages.signing,
      className: "toaster",
    })
  }

  let res: SendAndFinalizeResult = {
    status: "error",
    message: "Transaction failed",
  }

  return new Promise(async (resolve, reject) => {
    try {
      const unsub = await tx.signAndSend(
        address,
        { signer },
        (result: ISubmittableResult) => {
          statusCb?.(result)
          const { status, dispatchError, events = [], txHash } = result
          console.log("Transaction status:", status)

          if (status.isReady) {
            if (toastId) {
              toast.loading(toastConfig.title, {
                description: messages.entering,
                id: toastId,
                action: {
                  label: "View Tx",
                  onClick: () =>
                    window
                      .open(
                        `${activeChain?.explorerUrls?.subscan}/extrinsic/${txHash}`,
                        "_blank"
                      )
                      ?.focus(),
                },
              })
            }
          } else if (status.isInBlock) {
            success = dispatchError ? false : true
            // const signedBlock = await api?.rpc.chain.getBlock(status.asInBlock)
            // blockHeader = signedBlock?.block.header
            // included = [...events]
            if (toastId) {
              toast.loading(toastConfig.title, {
                id: toastId,
                description: messages.finalizing,
                duration: undefined,
                action: {
                  label: "View Tx",
                  onClick: () =>
                    window
                      .open(
                        `${activeChain?.explorerUrls?.subscan}/extrinsic/${txHash}`,
                        "_blank"
                      )
                      ?.focus(),
                },
              })
            }
          } else if (status.isFinalized) {
            console.log(
              `Transaction included at blockHash ${status.asFinalized}`
            )

            if (dispatchError) {
              if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = api?.registry.findMetaError(
                  dispatchError.asModule
                )
                const { docs, name, section } = decoded || {}

                res = {
                  status: "error",
                  message: docs?.join(" ") || "Unknown error",
                }

                console.trace("dispatch error", decoded)
              } else {
                // Other, CannotLookup, BadOrigin, no extra info

                res = {
                  status: "error",
                  message: dispatchError.toString(),
                }
              }

              toast.error(messages.error, {
                // @ts-ignore
                description: res.message,
                className: "toaster",
                id: toastId,
              })
              unsub()
              reject(res)
            } else {
              if (toastId) {
                toast.success(messages.success, {
                  // @ts-ignore
                  title: toast.title,
                  id: toastId,
                  duration: 4000,
                  action: {
                    label: "View Tx",
                    onClick: () =>
                      window
                        .open(
                          `${activeChain?.explorerUrls?.subscan}/extrinsic/${txHash}`,
                          "_blank"
                        )
                        ?.focus(),
                  },
                })
              }

              unsub()
              resolve({
                status: "success",
                message: `Transaction successful`,
                events,
                txHash: txHash.toString(),
                blockHeader,
              })
            }
          }
        }
      )
    } catch (e: any) {
      console.error("Error while transferring balance:", e)
      reject({
        message: e.message,
        status: "error",
      })
    }
  }).catch((e) => {
    console.error("aaa Error while transferring balance:", e)
    toast.error(messages.error, {
      // @ts-ignore
      description: e.message,
      className: "toaster",
      id: toastId,
    })
    return {
      message: e.message,
      status: "error",
    }
  })
}

export async function sendAndFinalize(config: {
  api: ApiPromise | undefined
  tx: SubmittableExtrinsic<"promise"> | undefined
  signer: Signer | undefined
  address: string | undefined
  toastConfig?: ToastType
  statusCb?: Callback<ISubmittableResult>
  cb?: (res: any) => void
}): Promise<SendAndFinalizeResult> {
  const {
    api,
    tx,
    signer,
    address,
    toastConfig = DEFAULT_TOAST,
    cb,
    statusCb,
  } = config

  if (!api || !signer || !address) {
    return {
      status: "error",
      message: "Missing api, signer or address",
    }
  }

  await api.isReady

  let unsub
  let toastId: string | number = ""
  let success = false
  let included = []
  let blockHeader: Header | undefined = undefined

  const { messages } = toastConfig

  if (toastConfig) {
    // @ts-ignore
    toastId = toast.loading(toastConfig.title, {
      description: messages.signing,
      className: "toaster",
    })
  }

  let res: SendAndFinalizeResult = {
    status: "error",
    message: "Transaction failed",
  }

  try {
    if (api && tx && signer && address) {
      unsub = await tx.signAndSend(
        address,
        { signer },

        async (result: ISubmittableResult) => {
          statusCb?.(result)
          const { status, dispatchError, events = [], txHash } = result
          console.log("Transaction status:", status)
          if (status.isReady) {
            if (toastId) {
              toast.loading(toastConfig.title, {
                description: messages.entering,
                id: toastId,
              })
            }
          } else if (status.isInBlock) {
            success = dispatchError ? false : true
            const signedBlock = await api?.rpc.chain.getBlock(status.asInBlock)
            blockHeader = signedBlock?.block.header
            included = [...events]
            if (toastId) {
              toast.loading(toastConfig.title, {
                id: toastId,
                description: messages.finalizing,
                duration: undefined,
              })
            }
          } else if (status.isFinalized) {
            console.log(
              `Transaction included at blockHash ${status.asFinalized}`
            )
            // events.forEach(({ phase, event: { data, method, section } }) => {
            //   // console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
            // });

            if (dispatchError) {
              if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = api?.registry.findMetaError(
                  dispatchError.asModule
                )
                const { docs, name, section } = decoded || {}

                res = {
                  status: "error",
                  message: docs?.join(" ") || "Unknown error",
                }

                console.trace("dispatch error", decoded)
              } else {
                // Other, CannotLookup, BadOrigin, no extra info

                res = {
                  status: "error",
                  message: dispatchError.toString(),
                }
              }

              toast.error(messages.error, {
                // @ts-ignore
                description: res.message,
                className: "toaster",
                id: toastId,
              })

              console.error(`${messages.error}: ${res.message}`)
            } else {
              // console.log(
              //   "finalized and no dispatch error, toasting with id",
              //   toastId
              // );
              if (toastId) {
                toast.success(messages.success, {
                  // @ts-ignore
                  title: toast.title,
                  id: toastId,
                  duration: 4000,
                })
              }

              res = {
                status: "success",
                message: `Transaction successful`,
                events,
                txHash: txHash.toString(),
                blockHeader,
              }
            }
          }
        }
      )

      unsub?.()
    }
  } catch (error) {
    console.log(error)
    // @ts-ignore
    toast.error(toast.title, {
      // @ts-ignore
      description: `${error}`,
      className: "toaster",
      id: toastId,
    })

    console.error(`${messages.error}: ${res.message}`)

    res = {
      status: "error",
      message: "Transaction failed",
    }

    cb?.(res)
  } finally {
    console.log("finally")
    return res
  }

  // console.log("returning from sendAdnFinalize", res);
}
