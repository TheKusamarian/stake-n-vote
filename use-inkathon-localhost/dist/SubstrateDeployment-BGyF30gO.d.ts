import { SignedBlock, AccountId } from '@polkadot/types/interfaces';
import { Abi } from '@polkadot/api-contract';

interface DeployedContract {
    address: string;
    hash: string;
    block: SignedBlock;
    blockNumber: number;
}

interface SubstrateDeployment {
    contractId: string;
    networkId: string;
    abi: string | Record<string, unknown> | Abi;
    address: string | AccountId;
}

export type { DeployedContract as D, SubstrateDeployment as S };
