import { useMemo } from "react"
import { useInkathon } from "@scio-labs/use-inkathon"
import { useQueryClient } from "react-query"
import { toast } from "sonner"

import { useTransactionFee } from "@/hooks/use-fees"
import { useNftApi } from "@/hooks/use-nft-api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DEFAULT_TOAST, sendAndFinalize } from "@/app/txs/send-and-finalize"
import { createCollectionTx } from "@/app/txs/txs"

import { Network } from "./form-sendout"

export function ModalNewCollection({
  network,
  variant = "default",
}: {
  network: Network
  variant?: "default" | "outline"
}) {
  const { activeAccount, activeChain, activeSigner } = useInkathon()
  const nftApi = useNftApi(network)
  const queryClient = useQueryClient()

  const sendOutExplorerUrl = useMemo(() => {
    return network === "ahk"
      ? "https://assethub-kusama.subscan.io/"
      : network === "ahp"
      ? "https://assethub-polkadot.subscan.io/"
      : "https://assethub-paseo.subscan.io/"
  }, [network])

  const tx = useMemo(() => {
    return createCollectionTx(
      nftApi,
      activeSigner,
      activeChain,
      activeAccount?.address
    )
  }, [nftApi, activeSigner, activeChain, activeAccount?.address])

  const { data: txFees } = useTransactionFee(tx, [activeAccount?.address])

  const networkName =
    network === "ahk"
      ? "Kusama Assethub"
      : network === "ahp"
      ? "Polkadot Assethub"
      : "Paseo Assethub"

  const createCollection = async () => {
    const tx = await createCollectionTx(
      nftApi,
      activeSigner,
      activeChain,
      activeAccount?.address
    )

    const res = await sendAndFinalize({
      api: nftApi,
      tx,
      signer: activeSigner,
      activeChain,
      address: activeAccount?.address,
      explorerUrl: sendOutExplorerUrl,
      toastConfig: {
        ...DEFAULT_TOAST,
        messages: {
          ...DEFAULT_TOAST.messages,
          success: "Collection created",
        },
      },
    })

    if (res.status === "success") {
      res?.events?.forEach(({ phase, event: { data, method, section } }) => {
        console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
      })
      const collectionCreatedEvent = res?.events?.find(
        (event) =>
          event.event.section === "nfts" && event.event.method === "Created"
      )

      if (collectionCreatedEvent) {
        const collectionId = collectionCreatedEvent.event.data[0].toHuman()
        toast.success(
          `Collection with id ${collectionId} successfully created on ${networkName}`
        )
      }
      // Invalidate the collections query to refetch the updated list
      await queryClient.invalidateQueries([
        "collections",
        network,
        activeAccount?.address,
      ])
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant}>Create a new collection</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new empty collection</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Create a new collection on {networkName}
          <Button variant="default" onClick={createCollection}>
            Create
          </Button>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
