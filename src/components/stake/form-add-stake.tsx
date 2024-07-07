"use client"

import { ALL } from "dns"
import { parse } from "path"
import { useEffect, useState } from "react"
import { findChangedItem, parseBN } from "@/util"
import { Slider } from "@nextui-org/slider"
import { BN_ZERO, bnToBn } from "@polkadot/util"
import { useInkathon } from "@scio-labs/use-inkathon"

import { kusamaRelay } from "@/config/chains"
import {
  CHAIN_CONFIG,
  KUSAMA_DELEGATOR,
  POLKADOT_DELEGATOR,
} from "@/config/config"
import useAccountBalances from "@/hooks/use-account-balance"
import { useTransactionFee } from "@/hooks/use-fees"
import { stakeMoreTx } from "@/app/txs/txs"

import { AmountInput } from "../AmountInput"
import { Button } from "../ui/button"

export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}

export function submitDelegation(prevState: State, formData: FormData) {
  return {
    errors: {
      status: ["Delegation Failed!"],
    },
    message: null,
  }
}

export default function FormAddStake() {
  const {
    data: accountBalance,
    isLoading: isAccountBalanceLoading,
    isFetching: isAccountBalanceFetching,
    isSuccess: isAccountBalanceSuccess,
  } = useAccountBalances()

  const [amount, setAmount] = useState(1)
  const [isAllSelected, setIsAllSelected] = useState(true)

  const { activeAccount, activeSigner, activeChain, api } = useInkathon()
  const activeChainConfig = CHAIN_CONFIG[activeChain?.network || "Polkadot"]

  const { tokenDecimals, tokenSymbol } = activeChainConfig

  const stakeBalance =
    !isNaN(amount) && amount !== 0
      ? bnToBn(amount * Math.pow(10, tokenDecimals))
      : BN_ZERO
  const { freeBalance } = accountBalance || { freeBalance: "0" }

  const disabled = !isAccountBalanceSuccess || stakeBalance.isZero()

  const stakeFee = useTransactionFee(api?.tx.staking.bondExtra(stakeBalance), [
    activeAccount?.address,
  ])

  const stakeFeeValue = stakeFee
    ? parseBN(stakeFee?.toString(), tokenDecimals)
    : "?"

  const stakeMore = async (e: any) => {
    e.preventDefault()

    if (!activeChain || !activeChain?.network || !api || !activeSigner) {
      return
    }

    const tx = await stakeMoreTx(
      api,
      activeSigner,
      activeChain,
      activeAccount?.address,
      stakeBalance
    )
  }

  const stakeMax = (e: any) => {
    e.preventDefault()

    const balance = bnToBn(freeBalance).gt(BN_ZERO) ? freeBalance : BN_ZERO

    setAmount(parseBN(balance?.toString(), tokenDecimals))
  }

  return (
    <form className="flex w-full max-w-xl flex-col gap-5">
      <div className="flex flex-col gap-2"></div>

      <div className="flex w-full max-w-full flex-row gap-3">
        <AmountInput
          label="Delegation Amount"
          value={amount.toString()}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        >
          <Button
            onClick={stakeMax}
            variant="outline"
            className="h-10 border-2 flex-0 bg-default-100 hover:bg-pink-200"
            disabled={disabled}
          >
            Add Max
          </Button>
        </AmountInput>
      </div>

      <div className="flex w-full items-start gap-1 flex flex-col">
        <Button className="w-full" onClick={stakeMore} disabled={disabled}>
          Add {amount} {tokenSymbol} to your stake
        </Button>
        <span className="text-xs">
          Estimated Fees: {stakeFeeValue} {tokenSymbol}
        </span>
      </div>
    </form>
  )
}
