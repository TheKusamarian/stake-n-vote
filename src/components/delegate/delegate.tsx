import { parseBN } from "@/util"
import { BN_ZERO, formatBalance } from "@polkadot/util"
import { useInkathon } from "@scio-labs/use-inkathon"

import { CHAIN_CONFIG } from "@/config/config"
import useAccountBalances from "@/hooks/use-account-balance"

import { NotConnected } from "../not-connected"
import FormDelegate from "./form-delegate"
import styles from "./modal.module.scss"

export default function DelegateComponent() {
  const { data: accountBalance, isLoading } = useAccountBalances()
  const { activeAccount, activeChain } = useInkathon()

  const {
    maxNominators,
    validator: kusValidator,
    tokenSymbol,
    tokenDecimals,
  } = CHAIN_CONFIG[activeChain?.network || "Polkadot"] || {}

  const { freeBalance } = accountBalance || { freeBalance: BN_ZERO }
  const humanFreeBalance = parseBN(freeBalance, tokenDecimals)

  return (
    <>
      <div className="flex flex-1 flex-col">
        {!activeAccount ? <NotConnected /> : <FormDelegate />}
      </div>
    </>
  )
}
