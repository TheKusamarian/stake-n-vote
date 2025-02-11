import { useMemo } from "react"
import { getClient } from "@kodadot1/uniquery"
import { encodeAddress } from "@polkadot/util-crypto"
import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

import { useNftApi } from "@/hooks/use-nft-api"
import { Network } from "@/app/nft/sendout/form-sendout"

export function useCollections(network: Network) {
  console.log("useCollections", network)
  const { activeAccount } = useInkathon()
  const nftApi = useNftApi(network)

  const client = useMemo(() => {
    if (network === "paseo") {
      return
    }
    return getClient(network)
  }, [network])

  const collections = useQuery<
    {
      id: string
      name?: string
      issuer?: string
      metadata?: string
      image?: string
    }[],
    Error
  >({
    queryKey: ["collections", network, activeAccount?.address],
    queryFn: async () => {
      if (!activeAccount?.address || !nftApi) return []
      const encodedAddress = encodeAddress(activeAccount.address, 0)

      if (client) {
        const collectionsQuery = client.collectionListByIssuer(encodedAddress)
        const result = await (
          await client.fetch(collectionsQuery)
        ).data?.collections
        return result || []
      } else {
        console.log("usecollection api", nftApi)
        const collections = await nftApi?.query.nfts.collectionAccount.entries(
          activeAccount.address
        )
        console.log(
          "paseo collections",
          collections.map(([entry]) => ({
            id: entry[0],
            issuer: entry[1],
          }))
        )

        return collections.map(([entry]) => ({
          id: entry[0],
          issuer: entry[1],
        }))
      }
    },
    enabled: !!activeAccount?.address && !!nftApi,
  })

  return collections
}
