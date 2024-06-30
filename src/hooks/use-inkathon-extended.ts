"use client"

import { SubstrateChain, useInkathon } from "@scio-labs/use-inkathon"

import { CHAIN_CONFIG } from "@/config/config"

interface SubstrateChainExtended extends SubstrateChain {
  tokenSymbol: string
  tokenDecimals?: number
}

interface SubstrateChainExtended extends SubstrateChain {
  tokenSymbol: string
  tokenDecimals?: number
}
export function useExtendedInkathon() {
  const inkathonData = useInkathon()
  const { activeChain, ...rest } = inkathonData

  const network = activeChain?.network || "Polkadot"
  const name = activeChain?.name || "Relay" // Ensure name is always a string
  const rpcUrls = activeChain?.rpcUrls || [""]

  const extendedActiveChain: SubstrateChainExtended = {
    ...activeChain,
    network,
    name,
    rpcUrls,
    tokenSymbol:
      CHAIN_CONFIG[activeChain?.network || "Polkadot"]?.tokenSymbol || "",
    tokenDecimals:
      CHAIN_CONFIG[activeChain?.network || "Polkadot"]?.tokenDecimals || 12,
  }

  return {
    ...rest,
    activeChain: extendedActiveChain,
  }
}
