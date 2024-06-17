import { S as SubstrateWallet } from './SubstrateWallet-DeToQln2.js';
import { InjectedExtension } from '@polkadot/extension-inject/types';

/**
 * Defined Substrate Wallet Constants
 */
declare const polkadotjs: SubstrateWallet;
declare const subwallet: SubstrateWallet;
declare const talisman: SubstrateWallet;
declare const nova: SubstrateWallet;
declare const alephzeroSigner: SubstrateWallet;
declare const nightly: SubstrateWallet;
declare const nightlyConnect: SubstrateWallet;
/**
 * Exporting all wallets separately
 */
declare const allSubstrateWallets: SubstrateWallet[];
/**
 * Returns wallet (if existent) for given identifier (`id` field).
 */
declare const getSubstrateWallet: (id: string) => SubstrateWallet | undefined;
declare const isWalletInstalled: (wallet: SubstrateWallet) => boolean | undefined;
/**
 * Enables the given wallet (if existent) and returns the injected extension.
 */
declare const enableWallet: (wallet: SubstrateWallet, appName: string) => Promise<InjectedExtension | undefined>;

export { alephzeroSigner, allSubstrateWallets, enableWallet, getSubstrateWallet, isWalletInstalled, nightly, nightlyConnect, nova, polkadotjs, subwallet, talisman };
