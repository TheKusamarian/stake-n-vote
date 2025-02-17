"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { pinToPinata } from "@/actions/pin-to-pinata"
import { KusamaIcon, PolkadotIcon } from "@/icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { Prefix } from "@kodadot1/uniquery"
import { useInkathon } from "@scio-labs/use-inkathon"
import { ArrowLeft, Clipboard, ImageUp, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { useNftApi } from "@/hooks/use-nft-api"
import { useReferenda } from "@/hooks/use-referenda"
import { useReferendumDetail } from "@/hooks/use-referendum-detail"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DEFAULT_TOAST, sendAndFinalize } from "@/app/txs/send-and-finalize"

import { InputNftMeta } from "./input-nft-meta"
import { SelectAwardType } from "./select-award-type"
import { SelectCollectionId } from "./select-collection-id"
import { UploadIpfsImage } from "./select-ipfs-image"
import { SelectNetwork } from "./select-network"
import { SelectReferendum } from "./select-referendum"
import { SelectSendoutNetwork } from "./select-sendout-network"
import { resolvePlaceholders } from "./util"

export type Network = Prefix | "paseo"

const formSchema = z.object({
  network: z.enum(["polkadot", "kusama"]),
  referendumId: z.string().min(1, "Please select a referendum"),
  awardType: z.enum(["all", "aye", "nay"]),
  sendoutNetwork: z.custom<Network>(),
  collectionId: z.string().min(1, "Collection ID is required"),
  nftMeta: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    image: z.string().min(1, "Image is required"),
  }),
})

type FormValues = z.infer<typeof formSchema>

export function FormSendout() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { activeAccount, activeSigner, activeChain } = useInkathon()

  // Get all initial values from URL params
  const initialValues = {
    network:
      (searchParams.get("network") as "polkadot" | "kusama") || "polkadot",
    referendumId: searchParams.get("refId") || "",
    awardType: "all" as "all" | "aye" | "nay",
    sendoutNetwork: (searchParams.get("mintNetwork") as Network) || "ahp",
    collectionId: searchParams.get("collectionId") || "",
    nftMeta: {
      name: searchParams.get("name") || "",
      description: searchParams.get("description") || "",
      image: "",
    },
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })

  // Set initial values when URL params change
  useEffect(() => {
    const newValues = {
      network:
        (searchParams.get("network") as "polkadot" | "kusama") || "polkadot",
      referendumId: searchParams.get("refId") || "",
      sendoutNetwork: (searchParams.get("mintNetwork") as Network) || "ahp",
      nftMeta: {
        name: searchParams.get("name") || "",
        description: searchParams.get("description") || "",
        image: form.getValues("nftMeta.image"), // Preserve existing image
      },
    }

    // Update form values if they've changed
    Object.entries(newValues).forEach(([key, value]) => {
      if (key === "nftMeta") {
        Object.entries(value).forEach(([metaKey, metaValue]) => {
          if (["image", "name", "description"].includes(metaKey)) {
            form.setValue(
              `nftMeta.${metaKey as keyof typeof formValues.nftMeta}`,
              metaValue
            )
          }
        })
      } else {
        form.setValue(key as keyof FormValues, value)
      }
    })
  }, [searchParams, form])

  const { watch } = form
  const formValues = watch()

  useEffect(() => {
    const params = new URLSearchParams()
    if (formValues.network) params.set("network", formValues.network)
    if (formValues.sendoutNetwork)
      params.set("mintNetwork", formValues.sendoutNetwork)
    if (formValues.referendumId) params.set("refId", formValues.referendumId)
    if (formValues.nftMeta.name) params.set("name", formValues.nftMeta.name)
    if (formValues.nftMeta.description)
      params.set("description", formValues.nftMeta.description)

    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.push(newUrl, { scroll: false })
  }, [
    formValues.network,
    formValues.sendoutNetwork,
    formValues.referendumId,
    formValues.nftMeta.name,
    formValues.nftMeta.description,
    router,
  ])

  const { data: referenda, isLoading } = useReferenda(formValues.network)

  const [txs, setTxs] = useState<any[]>([])
  const [progress, setProgress] = useState<
    | "step1_initial"
    | "step1_pinning"
    | "step2_review"
    | "step2_minting"
    | "success"
  >("step1_initial")

  const nftApi = useNftApi(formValues.sendoutNetwork)

  const {
    data: referendumDetail,
    isLoading: isReferendumDetailLoading,
    isError: isReferendumDetailError,
  } = useReferendumDetail(formValues.referendumId)

  const filterVoteInfo =
    formValues.awardType === "all"
      ? `${referendumDetail?.length}`
      : formValues.awardType === "aye"
      ? `${referendumDetail?.filter((vote) => vote.aye).length}`
      : `${referendumDetail?.filter((vote) => !vote.aye).length}`

  const isSendoutDisabled = useMemo(() => {
    if (isReferendumDetailLoading) return true

    return (
      !referendumDetail?.length ||
      !formValues.collectionId ||
      !nftApi ||
      !activeAccount ||
      !formValues.nftMeta.name ||
      !formValues.nftMeta.description ||
      !formValues.referendumId ||
      progress === "step1_pinning" ||
      progress === "step2_minting"
    )
  }, [
    formValues.collectionId,
    formValues.nftMeta.name,
    formValues.nftMeta.description,
    formValues.referendumId,
    referendumDetail?.length,
    nftApi,
    activeAccount,
    isReferendumDetailLoading,
    progress,
  ])

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [ipfsHashes, setIpfsHashes] = useState<{
    metadata: string
    image: string
  }>({ metadata: "", image: "" })

  const [pinnedMetadata, setPinnedMetadata] = useState<{
    ipfsHash: string
    metadata: any
  } | null>(null)

  const createTxs = async (metadataIpfsUrl: string) => {
    try {
      if (!referendumDetail || !formValues.collectionId || !nftApi) {
        console.error("No referendum detail or collection id")
        return []
      }

      const _txs = []
      // Get current timestamp and use last 5 digits
      const timeComponent = Number(Date.now().toString().slice(-5))

      const filteredReferendumDetail = referendumDetail.filter((vote) => {
        if (formValues.awardType === "all") return true
        return formValues.awardType === "aye" ? vote.aye : !vote.aye
      })

      for (let i = 0; i < filteredReferendumDetail?.length; i++) {
        // Combine collection ID with time component and index
        // Format: <timestamp last 5 digits><index padded to 4>
        const assetId = `${timeComponent}${i.toString().padStart(4, "0")}`

        _txs.push(
          nftApi.tx.nfts.mint(
            formValues.collectionId,
            assetId,
            filteredReferendumDetail[i].account,
            null
          )
        )

        _txs.push(
          nftApi.tx.nfts.setMetadata(
            formValues.collectionId,
            assetId,
            metadataIpfsUrl
          )
        )
      }
      return _txs
    } catch (error) {
      console.error("Failed to create transactions:", error)
      return []
    }
  }

  const handlePinMetadata = async () => {
    try {
      setProgress("step1_pinning")

      // Create metadata object
      const metadata = {
        name: resolvePlaceholders(formValues.nftMeta.name, {
          refId: formValues.referendumId,
        }),
        description: resolvePlaceholders(formValues.nftMeta.description, {
          refId: formValues.referendumId,
        }),
        image: ipfsHashes.image,
      }

      // Pin metadata to IPFS
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      })
      const metadataFormData = new FormData()
      metadataFormData.append(
        "file",
        metadataBlob,
        `metadata-${formValues.referendumId}-${activeAccount?.address}.json`
      )

      const metadataRes = await pinToPinata(metadataFormData)
      if (!metadataRes?.data?.ipfsHash)
        throw new Error("Failed to pin metadata")

      // Store pinned metadata
      setPinnedMetadata({
        ipfsHash: metadataRes.data.ipfsHash,
        metadata,
      })

      // Create transactions with pinned metadata
      const newTxs = await createTxs(`ipfs://ipfs/${metadataRes.data.ipfsHash}`)
      setTxs(newTxs)

      setProgress("step2_review")
    } catch (error) {
      console.error("Failed to pin metadata:", error)
      toast.error("Failed to pin metadata to IPFS. Please try again.")
      setProgress("step1_initial")
    }
  }

  const handleMintNfts = async () => {
    if (!pinnedMetadata || !nftApi) return

    try {
      setProgress("step2_minting")

      const batchAll = nftApi.tx.utility.batchAll(txs)

      const res = await sendAndFinalize({
        api: nftApi,
        tx: batchAll,
        signer: activeSigner,
        address: activeAccount?.address,
        activeChain: activeChain,
        explorerUrl:
          formValues.sendoutNetwork === "paseo"
            ? "https://assethub-paseo.subscan.io/"
            : formValues.network === "kusama"
            ? "https://assethub-kusama.subscan.io/"
            : "https://assethub-polkadot.subscan.io/",
        toastConfig: {
          ...DEFAULT_TOAST,
          title: "Minting NFTs",
          messages: {
            ...DEFAULT_TOAST.messages,
            success: "NFTs minted successfully",
          },
        },
      })

      if (res.status === "success") {
        setProgress("success")
      }
    } catch (error) {
      console.error("Error minting NFTs:", error)
      setProgress("step2_review")
      toast.error("Failed to mint NFTs. Please try again.")
    }
  }

  const copyCallData = () => {
    if (!referendumDetail || !nftApi || !txs.length) return
    const batchAll = nftApi.tx.utility.batchAll(txs)
    navigator.clipboard.writeText(batchAll?.toHex() ?? "")
    toast.success("Call data copied to clipboard")
  }

  const submitForm = async () => {
    if (progress === "step1_initial") {
      await handlePinMetadata()
    } else if (progress === "step2_review") {
      await handleMintNfts()
    }
  }

  return (
    <Form {...form} key={formValues.network}>
      <form onSubmit={form.handleSubmit(submitForm)}>
        <Card className="w-full max-w-4xl mx-auto border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-5xl font-bold text-center text-clip bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Send NFTs <br /> to Referendum Participants
            </CardTitle>
            <CardDescription className="text-center mb-4">
              {progress === "step1_initial"
                ? "Fill in the details below to prepare your NFT sendout"
                : "Review the transaction details before proceeding"}
            </CardDescription>
          </CardHeader>

          {(progress === "step1_initial" || progress === "step1_pinning") && (
            <CardContent className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="network"
                  render={({ field }) => (
                    <FormItem>
                      <SelectNetwork
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value)
                          // Set appropriate mint network based on selected network
                          const defaultMintNetwork =
                            value === "polkadot" ? "ahp" : "ahk"
                          form.setValue("sendoutNetwork", defaultMintNetwork, {
                            shouldDirty: true,
                            shouldTouch: true,
                          })
                          setProgress("step1_initial")
                          form.setValue("collectionId", "")
                        }}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referendumId"
                  render={({ field }) => (
                    <FormItem>
                      <SelectReferendum
                        chain={formValues.network}
                        referenda={referenda}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value)
                          setProgress("step1_initial")
                        }}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="awardType"
                  render={({ field }) => (
                    <FormItem>
                      <SelectAwardType
                        value={field.value}
                        onChange={field.onChange}
                        referendumDetail={referendumDetail}
                        isLoading={isReferendumDetailLoading}
                        filterVoteInfo={filterVoteInfo}
                      />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sendoutNetwork"
                  render={({ field }) => (
                    <FormItem>
                      <SelectSendoutNetwork
                        value={field.value}
                        onChange={(network) => {
                          field.onChange(network)
                          setProgress("step1_initial")
                        }}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collectionId"
                  render={({ field }) => (
                    <FormItem>
                      <SelectCollectionId
                        network={formValues.sendoutNetwork}
                        onChange={(value) => {
                          field.onChange(value)
                          setProgress("step1_initial")
                        }}
                      />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nftMeta.image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NFT Image</FormLabel>
                      <FormControl>
                        <UploadIpfsImage
                          onImageSelected={(ipfsHash) => {
                            setIpfsHashes({
                              ...ipfsHashes,
                              image: ipfsHash,
                            })
                            console.log("ipfsHashes ofter upload  ", ipfsHashes)
                            form.setValue("nftMeta.image", ipfsHash, {
                              shouldDirty: true,
                              shouldTouch: true,
                            })
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nftMeta"
                    render={({ field }) => (
                      <InputNftMeta
                        name={field.value.name}
                        description={field.value.description}
                        image={field.value.image}
                        onChange={(values) => {
                          form.setValue("nftMeta", values, {
                            shouldDirty: true,
                            shouldTouch: true,
                          })
                        }}
                        previewData={{
                          refId: formValues.referendumId ?? "1337",
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </CardContent>
          )}

          {["step2_review", "step2_minting"].includes(progress) && (
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Review Your Selections:
                </h3>
                <dl className="grid grid-cols-2 gap-2">
                  <dt>Network:</dt>
                  <dd>
                    {formValues.network === "polkadot" ? (
                      <div className="flex items-center gap-2">
                        <PolkadotIcon className="w-4 h-4" /> Polkadot
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <KusamaIcon className="w-4 h-4" /> Kusama
                      </div>
                    )}
                  </dd>
                  <dt>Referendum:</dt>
                  <dd>#{formValues.referendumId}</dd>
                  <dt>Award Type:</dt>
                  <dd>
                    Send out to{" "}
                    <b>
                      {formValues.awardType === "all"
                        ? "all"
                        : formValues.awardType === "aye"
                        ? "aye"
                        : "nay"}
                    </b>{" "}
                    Voters ({filterVoteInfo} addresses)
                  </dd>
                  <dt>Mint Network:</dt>
                  <dd>{formValues.sendoutNetwork}</dd>
                  <dt>Collection ID:</dt>
                  <dd>{formValues.collectionId}</dd>
                </dl>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">
                    Please verify the batch transaction in your wallet before
                    signing {txs.length} transactions
                  </h4>
                </div>
              </div>
            </CardContent>
          )}

          <CardFooter className="flex flex-col md:flex-row gap-4">
            {["step2_review", "step2_minting"].includes(progress) && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setProgress("step1_initial")}
                  className="w-full md:w-1/4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyCallData}
                  className="w-full md:w-1/4"
                  disabled={!txs.length}
                >
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copy Call Data
                </Button>
                <Button
                  className="w-full md:w-2/4"
                  onClick={handleMintNfts}
                  disabled={!txs.length}
                  type="submit"
                >
                  <ImageUp className="mr-2 h-4 w-4" />
                  Mint {filterVoteInfo} NFTs
                </Button>
              </>
            )}

            {["step1_initial", "step1_pinning"].includes(progress) && (
              <Button
                className="w-full"
                disabled={isSendoutDisabled}
                type="submit"
                isLoading={progress === "step1_pinning"}
              >
                Pin Metadata and Continue
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
