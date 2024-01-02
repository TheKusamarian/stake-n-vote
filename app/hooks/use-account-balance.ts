import { useQuery } from "react-query";
import { ApiPromise } from "@polkadot/api";
import { ChainConfigType, useChain } from "../providers/chain-provider";
import { format } from "path";
import { BN, BN_ZERO, formatBalance, bnToBn } from "@polkadot/util";
import { usePolkadotExtension } from "../providers/extension-provider";
import { encodeAddress } from "@polkadot/keyring";

interface Balances {
  freeBalance: BN;
  stakedBalance: BN;
}

async function fetchBalances(
  api: ApiPromise | undefined,
  chainConfig: ChainConfigType | undefined,
  address: string | undefined
): Promise<Balances> {
  if (!api || !chainConfig || !address) {
    return {
      freeBalance: BN_ZERO,
      stakedBalance: BN_ZERO,
    };
  }

  const account = await api?.query.system.account(address);
  const freeBalance = account ? account.data.free.toString() : "0";

  const staking = await api?.query.staking.ledger(address);
  const stakedBalance = staking?.isSome ? staking.unwrap().active : "0";

  return {
    freeBalance: bnToBn(freeBalance),
    stakedBalance: bnToBn(stakedBalance),
  };
}

function useAccountBalances() {
  const { api, chainConfig, activeChain } = useChain();
  const { selectedAccount } = usePolkadotExtension();
  const { ss58Format } = chainConfig || {};

  const userAddress =
    selectedAccount?.address && ss58Format !== undefined
      ? encodeAddress(selectedAccount.address, ss58Format)
      : undefined;

  return useQuery<Balances, Error>(
    ["accountBalances", activeChain],
    () => fetchBalances(api, chainConfig, userAddress),
    {
      enabled: !!api && !!userAddress, // Only run if an address is provided
    }
  );
}

export default useAccountBalances;
