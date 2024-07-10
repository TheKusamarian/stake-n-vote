import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

// Custom hook
export function useIdentities(addresses: string[]) {
  const { api, activeChain } = useInkathon()

  const fetchIdentities = async () => {
    const promises = addresses.map((address) => {
      return api?.derive.accounts.info(address)
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

  return useQuery(
    ["minNominatorBond", activeChain],
    async () => fetchIdentities(),
    {
      enabled: !!api,
    }
  )
}
