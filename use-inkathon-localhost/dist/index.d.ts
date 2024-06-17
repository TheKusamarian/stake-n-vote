import { ChainAsset, UseInkathonProviderContextType } from './types/index.js';
export { AssetType, UseInkathonError, UseInkathonErrorCode } from './types/index.js';
export { agungTestnet, alephzero, alephzeroTestnet, allSubstrateChains, amplitude, amplitudeTestnet, astar, bitCountryAlphaTestnet, contracts, development, getSubstrateChain, khala, pendulum, phala, phalaPOC6Testnet, popNetworkTestnet, rococo, shibuya, shiden, t0rnTestnet, ternoa, ternoaAlphanet } from './chains.js';
export { ContractTxResult, ExstrinsicThrowErrorMessage, TransferBalanceResult, accountArraysAreEqual, accountsAreEqual, checkIfBalanceSufficient, contractCallDryRun, contractQuery, contractTx, decodeOutput, deployContract, getAbiMessage, getDeployment, getDeploymentContract, getExtrinsicErrorMessage, getGasLimit, getMaxGasLimit, getNightlyConnectAdapter, getWebsiteIcon, initPolkadotJs, psp22Abi, transferBalance, transferFullBalance, unwrapResultOrDefault, unwrapResultOrError } from './helpers/index.js';
export { a as BalanceData, B as BalanceFormatterOptions, b as PSP22BalanceData, c as PSP22_TOKEN_BALANCE_SUBSCRIPTION_INTERVAL, P as PolkadotBalanceFormatterOptions, T as TokenData, f as formatBalance, g as getBalance, d as getPSP22Balances, p as parsePSP22Balance, w as watchBalance, e as watchPSP22Balances } from './getPSP22Balances-D1jXNigo.js';
export { useBalance, useContract, usePSP22Balances, useRegisteredContract, useRegisteredTypedContract } from './hooks/index.js';
import { S as SubstrateChain } from './SubstrateChain-Dj_ERPtp.js';
export { a as SubstrateExplorer } from './SubstrateChain-Dj_ERPtp.js';
import { S as SubstrateDeployment } from './SubstrateDeployment-BGyF30gO.js';
export { D as DeployedContract } from './SubstrateDeployment-BGyF30gO.js';
import { S as SubstrateWallet } from './SubstrateWallet-DeToQln2.js';
export { a as SubstrateWalletPlatform } from './SubstrateWallet-DeToQln2.js';
import { ApiOptions } from '@polkadot/api/types';
import { PropsWithChildren, FC, Dispatch, SetStateAction } from 'react';
export { T as TypechainContractConstructor } from './TypechainContractConstructor-DtGSkcVo.js';
export { alephzeroSigner, allSubstrateWallets, enableWallet, getSubstrateWallet, isWalletInstalled, nightly, nightlyConnect, nova, polkadotjs, subwallet, talisman } from './wallets.js';
import '@polkadot/api';
import '@polkadot/extension-inject/types';
import '@polkadot/types/types';
import '@polkadot/util';
import '@polkadot/api-contract';
import '@polkadot/api-contract/types';
import '@polkadot/types/interfaces';
import '@polkadot/keyring/types';

/**
 * Acknowledgement: PSP22_ASSETS.json is inspired by Subwallet's `ChainAsset.json`
 */
declare const allPSP22Assets: Record<string, ChainAsset>;

declare const LS_ACTIVE_ACCOUNT_ADDRESS = "activeAccountAddress";
declare const LS_ACTIVE_EXTENSION_ID = "activeExtensionId";
/**
 * Primary useInkathon hook that exposes `UseInkathonProviderContext`.
 */
declare const useInkathon: () => UseInkathonProviderContextType;
/**
 * Main provider that needs to be wrapped around the app (see README)
 * to use `useInkathon` and other hooks anywhere.
 */
interface UseInkathonProviderProps extends PropsWithChildren {
    appName: string;
    defaultChain: SubstrateChain | SubstrateChain['network'];
    connectOnInit?: boolean;
    deployments?: Promise<SubstrateDeployment[]>;
    apiOptions?: ApiOptions;
    supportedWallets?: SubstrateWallet[];
}
declare const UseInkathonProvider: FC<UseInkathonProviderProps>;

/**
 * Registering the given `deployment` with the given `setDeployments` dispatcher.
 * The registry is kept unique, so if there is already one deployment with
 * equal `contractId` and `networkId` it will be replaced.
 */
declare const registerDeployment: (setDeployments: Dispatch<SetStateAction<SubstrateDeployment[]>>, deployment: SubstrateDeployment) => void;
/**
 * Registers all given `deployments` via `registerDeployment` after awaiting the promise.
 */
declare const registerDeployments: (setDeployments: Dispatch<SetStateAction<SubstrateDeployment[]>>, deployments: Promise<SubstrateDeployment[]>) => Promise<void>;

export { ChainAsset, LS_ACTIVE_ACCOUNT_ADDRESS, LS_ACTIVE_EXTENSION_ID, SubstrateChain, SubstrateDeployment, SubstrateWallet, UseInkathonProvider, UseInkathonProviderContextType, type UseInkathonProviderProps, allPSP22Assets, registerDeployment, registerDeployments, useInkathon };
