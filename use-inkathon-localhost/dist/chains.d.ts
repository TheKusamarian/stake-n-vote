import { S as SubstrateChain } from './SubstrateChain-Dj_ERPtp.js';

/**
 * Local Development Network
 */
declare const development: SubstrateChain;
/**
 * Live Testnets
 */
declare const alephzeroTestnet: SubstrateChain;
declare const popNetworkTestnet: SubstrateChain;
declare const contracts: SubstrateChain;
/**
 * @deprecated Use `contracts` instead, which is the smart contracts parachain of Rococo.
 */
declare const rococo: SubstrateChain;
declare const shibuya: SubstrateChain;
declare const t0rnTestnet: SubstrateChain;
declare const bitCountryAlphaTestnet: SubstrateChain;
declare const agungTestnet: SubstrateChain;
declare const amplitudeTestnet: SubstrateChain;
declare const phalaPOC6Testnet: SubstrateChain;
declare const ternoaAlphanet: SubstrateChain;
/**
 * Live Canary Networks
 */
declare const shiden: SubstrateChain;
declare const amplitude: SubstrateChain;
declare const khala: SubstrateChain;
/**
 * Live Mainnet Networks
 */
declare const alephzero: SubstrateChain;
declare const astar: SubstrateChain;
declare const pendulum: SubstrateChain;
declare const phala: SubstrateChain;
declare const ternoa: SubstrateChain;
/**
 * Exporting all chains separately
 */
declare const allSubstrateChains: SubstrateChain[];
/**
 * Returns chain (if existent) for given identifier (`network` field).
 */
declare const getSubstrateChain: (networkId?: string) => SubstrateChain | undefined;

export { agungTestnet, alephzero, alephzeroTestnet, allSubstrateChains, amplitude, amplitudeTestnet, astar, bitCountryAlphaTestnet, contracts, development, getSubstrateChain, khala, pendulum, phala, phalaPOC6Testnet, popNetworkTestnet, rococo, shibuya, shiden, t0rnTestnet, ternoa, ternoaAlphanet };
