import { useEffect, useState } from "react"
import { ApiPromise, WsProvider } from "@polkadot/api"

import { Network } from "@/app/nft/sendout/form-sendout"

export async function getNftApi(network: Network) {
  const provider =
    network === "ahp"
      ? "wss://rpc-asset-hub-polkadot.luckyfriday.io"
      : network === "ahk"
      ? "wss://rpc-asset-hub-kusama.luckyfriday.io"
      : "wss://sys.ibp.network/asset-hub-paseo"

  const api = new ApiPromise({
    provider: new WsProvider(provider),
  })
  await api.isReady
  return api
}

export function useNftApi(network: Network) {
  const [api, setApi] = useState<ApiPromise | undefined>(undefined)

  useEffect(() => {
    const initApi = async () => {
      setApi(undefined)
      const _api = await getNftApi(network)
      setApi(_api)
    }
    initApi()

    return () => {
      api?.disconnect()
    }
  }, [network])

  return api
}
