"use client"

import { useEffect, useState } from "react"
import { AnyFunction } from "@polkadot/types/types"
import { useInkathon } from "@scio-labs/use-inkathon"

type Params = any[]

export function useCall<T>(
  method: AnyFunction | undefined,
  params: Params = []
): T | undefined {
  const { api } = useInkathon()
  const [result, setResult] = useState<T | undefined>(undefined)

  useEffect(() => {
    let isMounted = true

    if (method && api) {
      method(...params)
        .then((res: T) => {
          if (isMounted) {
            setResult(res)
          }
        })
        .catch(console.error)
    }

    return () => {
      isMounted = false
    }
  }, [method, params, api])

  return result
}
