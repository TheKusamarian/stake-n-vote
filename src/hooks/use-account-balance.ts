"use client"

import { ApiPromise } from "@polkadot/api"
import { encodeAddress } from "@polkadot/keyring"
import { BN, BN_ZERO, bnToBn, formatBalance } from "@polkadot/util"
import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

interface Balances {
  freeBalance: BN
  stakedBalance: BN
}

async function fetchBalances(
  api: ApiPromise | undefined,
  address: string | undefined
): Promise<Balances> {
  if (!api || !address) {
    return {
      freeBalance: BN_ZERO,
      stakedBalance: BN_ZERO,
    }
  }

  const account = await api?.query.system.account(address)
  const freeBalance = account ? account.data.free.toString() : "0"

  const staking = await api?.query.staking.ledger(address)
  const stakedBalance = staking?.isSome ? staking.unwrap().active : "0"

  return {
    freeBalance: bnToBn(freeBalance),
    stakedBalance: bnToBn(stakedBalance),
  }
}

function useAccountBalances() {
  const { activeChain, activeAccount, api } = useInkathon()
  const { ss58Prefix } = activeChain || {}

  const userAddress =
    activeAccount?.address && ss58Prefix !== undefined
      ? encodeAddress(activeAccount.address, ss58Prefix)
      : undefined

  return useQuery<Balances, Error>(
    ["accountBalances", activeChain],
    () => fetchBalances(api, userAddress),
    {
      enabled: !!api && !!userAddress, // Only run if an address is provided
    }
  )
}

export default useAccountBalances
