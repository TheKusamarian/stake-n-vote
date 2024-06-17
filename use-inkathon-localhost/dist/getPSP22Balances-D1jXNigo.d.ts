import { ApiPromise } from '@polkadot/api';
import { AccountId } from '@polkadot/types/interfaces';
import { formatBalance as formatBalance$1, BN } from '@polkadot/util';

type PolkadotBalanceFormatterOptions = NonNullable<Parameters<typeof formatBalance$1>['1']>;
type BalanceFormatterOptions = Omit<PolkadotBalanceFormatterOptions, 'forceUnit' | 'withZero'> & {
    forceUnit?: string | undefined | false;
    fixedDecimals?: number;
    removeTrailingZeros?: boolean;
};
type TokenData = {
    tokenDecimals: number;
    tokenSymbol: string;
};
/**
 * Improved & extended version of `formatBalance` from `@polkadot/util`.
 */
declare const formatBalance: (api: ApiPromise | undefined, value?: BN, options?: BalanceFormatterOptions, tokenData?: TokenData) => string;

type BalanceData = {
    tokenDecimals: number;
    tokenSymbol: string;
    freeBalance?: BN;
    freeBalanceFormatted?: string;
    reservedBalance?: BN;
    reservedBalanceFormatted?: string;
    reducibleBalance?: BN;
    reducibleBalanceFormatted?: string;
    balance?: BN;
    balanceFormatted?: string;
};
/**
 * Returns the native token balance of the given `address`.
 */
declare const getBalance: (api: ApiPromise, address: string | AccountId | undefined, formatterOptions?: BalanceFormatterOptions) => Promise<BalanceData>;
/**
 * Watches the native token balance of the given `address` and returns it in a callback.
 * The returned void function can be used to unsubscribe.
 */
declare const watchBalance: (api: ApiPromise, address: string | AccountId | undefined, callback: (data: BalanceData) => void, formatterOptions?: BalanceFormatterOptions) => Promise<VoidFunction | null>;

type PSP22BalanceData = {
    tokenSlug: string;
    tokenDecimals: number;
    tokenSymbol: string;
    iconPath: string;
    balance?: BN;
    balanceFormatted?: string;
};
/**
 * Default refresh interval for the PSP-22 token balances.
 */
declare const PSP22_TOKEN_BALANCE_SUBSCRIPTION_INTERVAL = 60000;
/**
 * Returns the PSP-22 token balances of the given `address`.
 */
declare const getPSP22Balances: (api: ApiPromise, address: string | AccountId | undefined, chainId: string, formatterOptions?: BalanceFormatterOptions) => Promise<PSP22BalanceData[]>;
/**
 * Watches the PSP-22 token balances of the given `address` and returns it in a callback.
 * The returned void function can be used to unsubscribe.
 */
declare const watchPSP22Balances: (api: ApiPromise, address: string | AccountId | undefined, callback: (data: PSP22BalanceData[]) => void, chainId: string, formatterOptions?: BalanceFormatterOptions) => VoidFunction | null;
/**
 * Helper to parse the fetched PSP22 token balance data.
 */
declare const parsePSP22Balance: (data: Omit<PSP22BalanceData, 'tokenSlug' | 'iconPath'>, formatterOptions?: BalanceFormatterOptions) => string;

export { type BalanceFormatterOptions as B, type PolkadotBalanceFormatterOptions as P, type TokenData as T, type BalanceData as a, type PSP22BalanceData as b, PSP22_TOKEN_BALANCE_SUBSCRIPTION_INTERVAL as c, getPSP22Balances as d, watchPSP22Balances as e, formatBalance as f, getBalance as g, parsePSP22Balance as p, watchBalance as w };
