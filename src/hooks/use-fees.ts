"use client"

import { useEffect, useState } from "react"
import type { SubmittableExtrinsic } from "@polkadot/api/types"
import { BN } from "@polkadot/util"
import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

type Params = any[]

export function useTransactionFee(
  extrinsic: SubmittableExtrinsic<"promise"> | undefined,
  params: Params = []
) {
  const { api } = useInkathon()

  return useQuery({
    queryKey: ["transactionFee", extrinsic, params],
    queryFn: async () => {
      if (extrinsic && api) {
        try {
          const info = await extrinsic.paymentInfo(params[0])
          return info.partialFee
        } catch (error) {
          console.error(error)
        }
      }
    },
    enabled: !!extrinsic && !!api,
  })
}
