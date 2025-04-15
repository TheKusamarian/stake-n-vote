import { useInkathon } from "@scio-labs/use-inkathon"
import { PlusCircle } from "lucide-react"

import { useCollections } from "@/hooks/use-collections"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { ButtonNewCollection } from "./button-new-collection"
import { Network } from "./form-sendout"
import { ModalNewCollection } from "./modal-new-collection"

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

  if (
    activeAccount &&
    !isLoading &&
    !error &&
    (!collections || collections.length === 0)
  ) {
    return (
      <div className="flex flex-col gap-2">
        <Label>Mint to collection</Label>
        <div className="text-xs p-3 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-lg">
          ⚠️ No collections found on {networkName}.{" "}
        </div>
        <ButtonNewCollection network={network} />
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
          {collections
            ?.sort((a, b) => parseInt(b.id) - parseInt(a.id))
            .map((collection) => (
              <SelectItem
                key={collection.id}
                value={collection.id}
                className="overflow-hidden"
              >
                <div className="flex flex-row gap-2 items-center overflow-hidden">
                  {collection.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={collection.image.replace(
                        "ipfs://",
                        "https://ipfs.io/ipfs/"
                      )}
                      alt=""
                      className="h-8 w-8 object-cover"
                      width={32}
                      height={32}
                    />
                  )}
                  <div>
                    <span className="font-medium">id:</span> {collection.id}
                  </div>
                  {collection.name && (
                    <div>
                      <span className="font-medium">name:</span>{" "}
                      {collection.name.slice(0, 20)}...
                    </div>
                  )}
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground -mt-1">
        Select the collection that will hold the NFTs you want to mint. The
        collection must be created on the network you are using.
      </p>
      <ButtonNewCollection network={network} variant="outline" />
    </div>
  )
}
