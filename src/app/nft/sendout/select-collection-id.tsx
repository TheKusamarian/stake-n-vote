import { useInkathon } from "@scio-labs/use-inkathon"

import { useCollections } from "@/hooks/use-collections"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Network } from "./form-sendout"

export function SelectCollectionId({
  network,
  onChange,
}: {
  network: Network
  onChange: (collectionId: string) => void
}) {
  const { activeAccount } = useInkathon()
  const { data: collections, isLoading, error } = useCollections(network)

  const networkName =
    network === "ahk"
      ? "Kusama Assethub"
      : network === "ahp"
      ? "Polkadot Assethub"
      : "Paseo Assethub"

  if (!isLoading && !error && (!collections || collections.length === 0)) {
    return (
      <div className="flex flex-col gap-2">
        <Label>Mint to collection</Label>
        <div className="text-sm text-muted-foreground">
          No collections found on {networkName}.{" "}
          <a
            href={
              network === "paseo"
                ? "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fasset-hub-paseo-rpc.dwellir.com#/extrinsics"
                : "https://kodadot.xyz/create/collection"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {network === "paseo"
              ? "Create a collection on Paseo Substrate Explorer (nfts → create)"
              : `Create a new collection at KodaDot →`}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Mint to collection</Label>

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      <Select
        disabled={isLoading || Boolean(error) || !activeAccount}
        onValueChange={(value) => onChange(value)}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              isLoading
                ? "Loading..."
                : error
                ? "Error loading collections"
                : !activeAccount
                ? "Connect your wallet"
                : "Select a collection"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {collections?.map((collection) => (
            <SelectItem key={collection.id} value={collection.id}>
              <div className="flex flex-row gap-2 items-center">
                {collection.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={collection.image.replace(
                      "ipfs://",
                      "https://ipfs.io/ipfs/"
                    )}
                    alt={collection.name}
                    className="h-8 w-8 object-cover"
                  />
                )}
                <div>
                  <span className="font-medium">id:</span> {collection.id}
                </div>
                {collection.name && (
                  <div>
                    <span className="font-medium">name:</span> {collection.name}
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
