import { ApiPromise } from "@polkadot/api"
import { useQuery } from "react-query"

import { Network } from "@/app/opengov-nft/form-sendout"

import { useNftApi } from "./use-nft-api"

export function useNftFees(network: Network) {
  const nftApi = useNftApi(network)

  return useQuery({
    queryKey: ["nft-fees", network],
    queryFn: () => getNftFees(nftApi!),
    enabled: !!nftApi,
    keepPreviousData: false,
    onSettled: () => {
      if (nftApi) nftApi.disconnect()
    },
  })
}

async function getNftFees(nftApi: ApiPromise) {
  const [depositMetadata, depositNft, decimals, tokens] = await Promise.all([
    nftApi.consts.nfts.metadataDepositBase,
    nftApi.consts.nfts.itemDeposit,
    nftApi.registry.chainDecimals,
    nftApi.registry.chainTokens,
  ])

  return {
    depositMetadata: depositMetadata.toString(),
    depositNft: depositNft.toString(),
    decimals: Number(decimals),
    token: tokens[0].toString(),
  }
}
