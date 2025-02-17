import { getReferenda } from "@/actions/get-referenda"
import { useQuery } from "react-query"

export function useReferenda(chain: "polkadot" | "kusama") {
  return useQuery({
    queryKey: ["referenda", chain],
    queryFn: async () => {
      "server only"
      const { data: referenda } = await getReferenda(chain)
      return referenda
    },
  })
}
