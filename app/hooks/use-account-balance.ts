import { useQuery } from "react-query";
import { ApiPromise } from "@polkadot/api";
import { ChainConfigType, useChain } from "../providers/chain-provider";
import { format } from "path";
import { formatBalance } from "@polkadot/util";
import { usePolkadotExtension } from "../providers/extension-provider";
import { encodeAddress } from "@polkadot/keyring";

interface Balances {
  freeBalance: string;
  stakedBalance: string;
}

async function fetchBalances(
  api: ApiPromise | undefined,
  chainConfig: ChainConfigType | undefined,
  address: string | undefined
): Promise<Balances> {
  if (!api || !chainConfig || !address) {
    return {
      freeBalance: "0",
      stakedBalance: "0",
    };
  }

  const account = await api?.query.system.account(address);
  const freeBalance = account ? account.data.free.toString() : "0";

  const staking = await api?.query.staking.ledger(address);
  const stakedBalance = staking?.isSome
    ? staking.unwrap().active.toString()
    : "0";

  return {
    freeBalance: formatBalance(freeBalance, {
      decimals: chainConfig?.tokenDecimals,
      withUnit: chainConfig?.tokenSymbol,
      // forceUnit: "-",
    }),
    stakedBalance: formatBalance(stakedBalance, {
      decimals: chainConfig?.tokenDecimals,
      withUnit: chainConfig?.tokenSymbol,
      // forceUnit: "-",
    }),
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
