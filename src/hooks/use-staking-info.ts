"use client"

import "@polkadot/api-augment"
import { ApiPromise } from "@polkadot/api"
import { encodeAddress } from "@polkadot/keyring"
import { BN, BN_ZERO, bnToBn, formatBalance } from "@polkadot/util"
import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

interface Balance {
  withValidator: BN
  inPool: BN
  amount: BN
}

interface Balances {
  [key: string]: Balance
}

async function fetchStakingInfo(
  api: ApiPromise | undefined,
  addresses: string[] | string | undefined
): Promise<Balances | Balance> {
  if (!api || !addresses) {
    return {}
  }

  const fetchInfoForAddress = async (address: string) => {
    const [stakingInfo, poolMemberInfo] = await Promise.all([
      api.query.staking.ledger(address),
      api.query.nominationPools.poolMembers(address),
    ])

    const withValidator = stakingInfo.isSome ? stakingInfo.unwrap().active : "0"
    const inPool = poolMemberInfo.isSome ? poolMemberInfo.unwrap().points : "0"

    return {
      address,
      withValidator: bnToBn(withValidator),
      inPool: bnToBn(inPool),
      amount: bnToBn(withValidator).eq(BN_ZERO)
        ? bnToBn(inPool)
        : bnToBn(withValidator),
    }
  }

  if (typeof addresses === "string") {
    return fetchInfoForAddress(addresses)
  }

  const results = await Promise.all(addresses.map(fetchInfoForAddress))

  return results.reduce((acc, { address, withValidator, inPool, amount }) => {
    acc[address] = { withValidator, inPool, amount }
    return acc
  }, {} as Balances)
}

function useStakingInfo() {
  const { activeChain, activeAccount, api, accounts } = useInkathon()
  const { ss58Prefix } = activeChain || {}

  const userAddresses =
    accounts && ss58Prefix !== undefined
      ? accounts.map((acc) => acc.address)
      : undefined

  return useQuery<Balances, Error>(
    ["stakingInfo", activeChain, userAddresses],
    () => fetchStakingInfo(api, userAddresses) as Promise<Balances>,
    {
      enabled: !!api && !!userAddresses, // Only run if an address is provided
    }
  )
}

export function useActiveAccountStakingInfo() {
  const { api, activeAccount } = useInkathon()
  return useQuery<Balance, Error>(
    ["stakingInfo", activeAccount?.address],
    () => fetchStakingInfo(api, activeAccount?.address) as Promise<Balance>,
    {
      enabled: !!api && !!activeAccount?.address, // Only run if an address is provided
    }
  )
}

export default useStakingInfo
