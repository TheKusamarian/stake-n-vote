import * as _polkadot_types_interfaces from '@polkadot/types/interfaces';
import { AccountId } from '@polkadot/types/interfaces';
import { B as BalanceFormatterOptions, a as BalanceData, b as PSP22BalanceData } from '../getPSP22Balances-D1jXNigo.js';
import * as _polkadot_api_contract from '@polkadot/api-contract';
import { Abi, ContractPromise } from '@polkadot/api-contract';
import { T as TypechainContractConstructor } from '../TypechainContractConstructor-DtGSkcVo.js';
import '@polkadot/api';
import '@polkadot/util';
import '@polkadot/keyring/types';

/**
 * Hook that returns the native token balance of the given `address`.
 */
declare const useBalance: (address?: string | AccountId, watch?: boolean, formatterOptions?: BalanceFormatterOptions) => BalanceData;

/**
 * React Hook that returns a `ContractPromise` object configured with
 * the active api & chain as well as the given `abi` and `address`.
 */
declare const useContract: (abi?: string | Record<string, unknown> | Abi, address?: string | AccountId) => {
    contract: ContractPromise | undefined;
    address: string | AccountId | undefined;
};

/**
 * Hook that returns the PSP-22 token balances of the given `address`.
 */
declare const usePSP22Balances: (address?: string | AccountId, watch?: boolean, formatterOptions?: BalanceFormatterOptions) => PSP22BalanceData[];

/**
 * React Hook that returns a `ContractPromise` object configured with
 * the active api & chain with the given deployment contract id which
 * is looked up from the deployments registry.
 */
declare const useRegisteredContract: (contractId: string, networkId?: string) => {
    contract: _polkadot_api_contract.ContractPromise | undefined;
    address: string | _polkadot_types_interfaces.AccountId | undefined;
};

/**
 * React Hook that returns a type-safe contract object by `typechain-polkadot`,
 * configured with the active api & chain for the given deployment contract id
 * which is looked up from the deployments registry.
 */
declare const useRegisteredTypedContract: <T>(contractId: string, Contract: TypechainContractConstructor<T>, networkId?: string) => {
    typedContract: T | undefined;
    contract: _polkadot_api_contract.ContractPromise | undefined;
    address: string | _polkadot_types_interfaces.AccountId | undefined;
};

export { useBalance, useContract, usePSP22Balances, useRegisteredContract, useRegisteredTypedContract };
