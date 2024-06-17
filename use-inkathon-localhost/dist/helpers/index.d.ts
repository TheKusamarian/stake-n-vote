import { InjectedAccount } from '@polkadot/extension-inject/types';
import { ApiPromise, WsProvider, HttpProvider } from '@polkadot/api';
import { IKeyringPair, ISubmittableResult, Callback } from '@polkadot/types/types';
import { BN } from '@polkadot/util';
import { ContractPromise } from '@polkadot/api-contract';
import * as _polkadot_api_contract_types from '@polkadot/api-contract/types';
import { ContractOptions, ContractCallOutcome } from '@polkadot/api-contract/types';
import { EventRecord, ContractExecResult, WeightV2, AccountId } from '@polkadot/types/interfaces';
import { D as DeployedContract, S as SubstrateDeployment } from '../SubstrateDeployment-BGyF30gO.js';
export { a as BalanceData, B as BalanceFormatterOptions, b as PSP22BalanceData, c as PSP22_TOKEN_BALANCE_SUBSCRIPTION_INTERVAL, P as PolkadotBalanceFormatterOptions, T as TokenData, f as formatBalance, g as getBalance, d as getPSP22Balances, p as parsePSP22Balance, w as watchBalance, e as watchPSP22Balances } from '../getPSP22Balances-D1jXNigo.js';
import { S as SubstrateChain } from '../SubstrateChain-Dj_ERPtp.js';
import { ApiOptions } from '@polkadot/api/types';

/**
 * Returns true if both given injected accounts have the same address.
 */
declare const accountsAreEqual: (a1?: InjectedAccount, a2?: InjectedAccount) => boolean;
/**
 * Returns true if both given arrays of injected accounts contain the
 * same objects with the same addresses in the same order.
 */
declare const accountArraysAreEqual: (a1: InjectedAccount[], a2: InjectedAccount[]) => boolean;

/**
 * Fetches the balance of the given address and returns a boolean
 * whether this is zero or below an optionally passed minimum value.
 */
declare const checkIfBalanceSufficient: (api: ApiPromise, account: IKeyringPair | string, minBalance?: bigint | BN | string | number) => Promise<boolean>;

/**
 * Decodes the error message from an extrinsic's error event.
 */
type ExstrinsicThrowErrorMessage = 'UserCancelled' | 'TokenBelowMinimum' | 'Error';
declare const getExtrinsicErrorMessage: (errorEvent: any) => ExstrinsicThrowErrorMessage;

/**
 * Performs a dry run for the given contract method and arguments.
 * Is used within `contractQuery` & `contractTx` for gas estimation.
 */
declare const contractCallDryRun: (api: ApiPromise, account: IKeyringPair | string, contract: ContractPromise, method: string, options?: ContractOptions, args?: unknown[]) => Promise<ContractCallOutcome>;
/**
 * Calls a given non-mutating contract method (query) with maximum possible gas limit.
 */
declare const contractQuery: (api: ApiPromise, address: string, contract: ContractPromise, method: string, options?: ContractOptions, args?: unknown[]) => Promise<ContractCallOutcome>;
/**
 * Calls a given mutating contract method (tx) and wraps it in a promise.
 * Before, a dry run is performed to determine the required gas & potential errors.
 */
type ContractTxResult = {
    dryResult: ContractCallOutcome;
    result?: ISubmittableResult;
    errorMessage?: ReturnType<typeof getExtrinsicErrorMessage> | 'ExtrinsicFailed';
    errorEvent?: EventRecord;
    successEvent?: EventRecord;
    extrinsicHash?: string;
    extrinsicIndex?: number;
    blockHash?: string;
};
declare const contractTx: (api: ApiPromise, account: IKeyringPair | string, contract: ContractPromise, method: string, options?: ContractOptions, args?: unknown[], statusCb?: Callback<ISubmittableResult>) => Promise<ContractTxResult>;

/**
 * Decodes & unwraps outputs and errors of a given result, contract, and method.
 * Parsed error message can be found in `decodedOutput` if `isError` is true.
 * SOURCE: https://github.com/paritytech/contracts-ui (GPL-3.0-only)
 */
declare function decodeOutput({ result }: Pick<ContractExecResult, 'result' | 'debugMessage'>, contract: ContractPromise, method: string): {
    output: any;
    decodedOutput: string;
    isError: boolean;
};

/**
 * Uploads & instantiates a contract on-chain.
 */
declare const deployContract: (api: ApiPromise, account: IKeyringPair | string, abi: any, wasm: Uint8Array | string | Buffer, constructorMethod?: string, args?: unknown[], options?: ContractOptions) => Promise<DeployedContract>;

declare const psp22Abi: Record<string, any>;

/**
 * Returns the ABI message for the given method name within the given contract.
 */
declare const getAbiMessage: (contract: ContractPromise, method: string) => _polkadot_api_contract_types.AbiMessage;

/**
 * Returns the first matching deployment from the given `deployments` array
 * with an equal `contractId` and `networkId`
 */
declare const getDeployment: (deployments: SubstrateDeployment[], contractId: string, networkId: string) => SubstrateDeployment | undefined;
/**
 * Takes the first matching deployment from the given `deployments` array
 * with an equal `contractId` and `networkId` and creates a `ContractPromise`.
 */
declare const getDeploymentContract: (api: ApiPromise, deployments: SubstrateDeployment[], contractId: string, networkId: string) => ContractPromise | undefined;

/**
 * Helper function that returns Weights V2 `gasLimit` object.
 */
declare const getGasLimit: (api: ApiPromise, _refTime: string | BN, _proofSize: string | BN) => WeightV2;
/**
 * Helper function that returns the maximum gas limit Weights V2 object
 * for an extrinsic based on the api chain constants.
 * NOTE: It's reduced by a given factor (defaults to 80%) to avoid storage exhaust.
 */
declare const getMaxGasLimit: (api: ApiPromise, reductionFactor?: number) => WeightV2;

declare const getNightlyConnectAdapter: (appName?: string, appIcon?: string, appOrigin?: string, persisted?: boolean) => Promise<any>;

declare const getWebsiteIcon: (origin: string) => Promise<string | undefined>;

/**
 * Helper to initialize polkadot.js API with given chain and options.
 */
declare const initPolkadotJs: (chain: SubstrateChain, options?: Omit<ApiOptions, 'provider'>) => Promise<{
    api: ApiPromise;
    provider: WsProvider | HttpProvider;
}>;

type TransferBalanceResult = {
    result?: ISubmittableResult;
    errorMessage?: ExstrinsicThrowErrorMessage | 'ExtrinsicFailed';
    errorEvent?: EventRecord;
};
/**
 * Transfers a given amount of tokens from one account to another.
 */
declare const transferBalance: (api: ApiPromise, fromAccount: IKeyringPair | string, toAddress: string | AccountId, amount: bigint | BN | string | number, allowDeath?: boolean, statusCb?: Callback<ISubmittableResult>) => Promise<TransferBalanceResult>;
/**
 * Transfers all available tokens from one account to another.
 */
declare const transferFullBalance: (api: ApiPromise, fromAccount: IKeyringPair | string, toAddress: string | AccountId, keepAlive?: boolean, statusCb?: Callback<ISubmittableResult>) => Promise<TransferBalanceResult>;

/**
 * Unwraps a Weights V2 result type or errors if there is no 'ok' value.
 */
declare const unwrapResultOrError: <T = any>(outcome: Pick<ContractCallOutcome, 'result' | 'output'>) => T;
/**
 * Unwraps a Weights V2 result type or returns the given default if there is no 'ok' value.
 */
declare const unwrapResultOrDefault: <T = any>(outcome: Pick<ContractCallOutcome, 'result' | 'output'>, defaultValue: T) => T;

export { type ContractTxResult, type ExstrinsicThrowErrorMessage, type TransferBalanceResult, accountArraysAreEqual, accountsAreEqual, checkIfBalanceSufficient, contractCallDryRun, contractQuery, contractTx, decodeOutput, deployContract, getAbiMessage, getDeployment, getDeploymentContract, getExtrinsicErrorMessage, getGasLimit, getMaxGasLimit, getNightlyConnectAdapter, getWebsiteIcon, initPolkadotJs, psp22Abi, transferBalance, transferFullBalance, unwrapResultOrDefault, unwrapResultOrError };
