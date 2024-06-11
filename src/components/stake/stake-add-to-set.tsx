import { ApiPromise } from "@polkadot/api"
import { Signer } from "@polkadot/api/types"
import { InjectedAccount } from "@polkadot/extension-inject/types"
import { SubstrateChain } from "@scio-labs/use-inkathon"

import { Button } from "@/components/ui/button"
import { nominateTx } from "@/app/txs/txs"

export function AddKusToSet({
  nominators,
  validator,
  api,
  signer,
  activeAccount,
  activeChain,
  tokenSymbol,
}: {
  nominators: string[]
  validator: string
  api: ApiPromise | undefined
  signer: Signer | undefined
  activeAccount: InjectedAccount | null
  activeChain: SubstrateChain | undefined
  tokenSymbol: string
}) {
  return (
    <>
      <p>Great! You are already staking your {tokenSymbol}</p>
      <p>Would you like to add The Kus to your nominator set?</p>
      <Button
        onClick={async () => {
          const tx = await nominateTx(
            api,
            signer,
            activeChain,
            activeAccount?.address,
            nominators.concat(validator)
          )
        }}
        className="mt-4"
      >
        Add Kus to nominator set
      </Button>
    </>
  )
}
