import { SubstrateChain, SubstrateExplorer } from "@scio-labs/use-inkathon"

interface SubstrateChainExtended extends SubstrateChain {
  tokenSymbol: string
  tokenDecimals?: number
}

export const polkadotRelay: SubstrateChainExtended = {
  network: "Polkadot",
  name: "Polkadot Relay Chain",
  rpcUrls: ["wss://rpc.polkadot.io"],
  ss58Prefix: 0,
  testnet: false,
  tokenSymbol: "DOT",
  tokenDecimals: 10,
  explorerUrls: { [SubstrateExplorer.Subscan]: "https://polkadot.subscan.io" },
}

export const kusamaRelay: SubstrateChainExtended = {
  network: "Kusama",
  name: "Kusama Relay Chain",
  rpcUrls: ["wss://kusama-rpc.polkadot.io"],
  ss58Prefix: 2,
  testnet: false,
  tokenSymbol: "KSM",
  tokenDecimals: 12,
  explorerUrls: { [SubstrateExplorer.Subscan]: "https://kusama.subscan.io" },
}

export const rocoRelay: SubstrateChainExtended = {
  network: "Rococo",
  name: "Rococo Relay Chain",
  rpcUrls: ["wss://rococo-rpc.polkadot.io"],
  ss58Prefix: 2,
  testnet: false,
  tokenSymbol: "ROC",
  tokenDecimals: 12,
}
