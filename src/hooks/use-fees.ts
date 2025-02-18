"use client"

import type { SubmittableExtrinsic } from "@polkadot/api/types"
import { useQuery } from "react-query"

type Params = any[]

export function useTransactionFee(
  extrinsic: SubmittableExtrinsic<"promise"> | undefined,
  params: Params = []
) {
  return useQuery({
    queryKey: ["transactionFee", extrinsic, params],
    queryFn: async () => {
      if (extrinsic) {
        try {
          const info = await extrinsic.paymentInfo(params[0])
          return info.partialFee
        } catch (error) {
          console.error(error)
        }
      }
    },
    enabled: !!extrinsic,
  })
}
