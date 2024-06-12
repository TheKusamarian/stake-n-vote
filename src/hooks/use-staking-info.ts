import { ApiPromise } from "@polkadot/api"
import { encodeAddress } from "@polkadot/keyring"
import { BN, BN_ZERO, bnToBn, formatBalance } from "@polkadot/util"
import { useInkathon } from "@scio-labs/use-inkathon"
import { useQuery } from "react-query"

interface Balances {
  [key: string]: {
    withValidator: BN
    inPool: BN
  }
}

async function fetchStakingInfo(
  api: ApiPromise | undefined,
  addresses: string[] | undefined
): Promise<Balances> {
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
    }
  }

  const results = await Promise.all(addresses.map(fetchInfoForAddress))

  return results.reduce((acc, { address, withValidator, inPool }) => {
    acc[address] = { withValidator, inPool }
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
    () => fetchStakingInfo(api, userAddresses),
    {
      enabled: !!api && !!userAddresses, // Only run if an address is provided
    }
  )
}

export default useStakingInfo
