import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

type TypechainContractConstructor<T> = new (address: string, signer: KeyringPair, nativeAPI: ApiPromise) => T;

export type { TypechainContractConstructor as T };
