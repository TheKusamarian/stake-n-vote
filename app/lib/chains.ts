import { SubstrateChain } from "@scio-labs/use-inkathon";

interface SubstrateChainExtended extends SubstrateChain {
  tokenSymbol: string;
}

export const polkadotRelay: SubstrateChainExtended = {
  network: "Polkadot",
  name: "Polkadot Relay Chain",
  rpcUrls: ["wss://rpc.polkadot.io"],
  ss58Prefix: 0,
  testnet: false,
  tokenSymbol: "DOT",
};

export const kusamaRelay: SubstrateChainExtended = {
  network: "Kusama",
  name: "Kusama Relay Chain",
  rpcUrls: ["wss://kusama-rpc.polkadot.io"],
  ss58Prefix: 2,
  testnet: false,
  tokenSymbol: "KSM",
};
