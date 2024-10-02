import { ApiPromise, WsProvider } from "@polkadot/api"
import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

export const fetchIdentities = async (addresses: string[]) => {
  const provider = new WsProvider("wss://rpc-people-polkadot.luckyfriday.io")
  const identityApi = await ApiPromise.create({ provider })

  const promises = addresses.map((address) => {
    return identityApi?.derive.accounts.info(address)
  })

  const results = await Promise.all(promises)

  if (!results) {
    return addresses.map((address) => {
      return {
        address,
        identity: null,
      }
    })
  }

  return results.map((result, index) => {
    return {
      address: addresses[index],
      identity: result?.identity,
    }
  })
}

// Custom hook
export function useIdentities(addresses: string[]) {
  const { api, activeChain } = useInkathon()

  return useQuery(
    ["minNominatorBond", activeChain],
    async () => fetchIdentities(addresses),
    {
      enabled: !!api,
    }
  )
}
