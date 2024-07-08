"use client"

import { useEffect, useState } from "react"
import type { SubmittableExtrinsic } from "@polkadot/api/types"
import type { FeeDetails } from "@polkadot/types/interfaces"
import { useInkathon } from "@scio-labs/use-inkathon"

type Params = any[]

export function useTransactionFee(
  extrinsic: SubmittableExtrinsic<"promise"> | undefined,
  params: Params = []
): string | undefined {
  const { api } = useInkathon()
  const [fee, setFee] = useState<string | undefined>(undefined)

  useEffect(() => {
    let isMounted = true

    const estimateFee = async () => {
      if (extrinsic && api) {
        try {
          const info = await extrinsic.paymentInfo(params[0])
          if (isMounted) {
            setFee(info.partialFee.toString())
          }
        } catch (error) {
          console.error(error)
        }
      }
    }

    estimateFee()

    return () => {
      isMounted = false
    }
  }, [extrinsic, params, api])

  return fee
}
