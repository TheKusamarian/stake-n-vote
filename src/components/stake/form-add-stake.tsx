"use client"

import { ALL } from "dns"
import { parse } from "path"
import { useEffect, useState } from "react"
import { findChangedItem, parseBN } from "@/util"
import { Slider } from "@nextui-org/slider"
import { BN_ZERO, bnToBn, formatBalance } from "@polkadot/util"
import { useInkathon } from "@scio-labs/use-inkathon"

import { kusamaRelay } from "@/config/chains"
import {
  CHAIN_CONFIG,
  KUSAMA_DELEGATOR,
  POLKADOT_DELEGATOR,
} from "@/config/config"
import useAccountBalances from "@/hooks/use-account-balance"
import { useTransactionFee } from "@/hooks/use-fees"
import useStakingInfo, {
  useActiveAccountStakingInfo,
} from "@/hooks/use-staking-info"
import { stakeMoreTx, unstakeTx } from "@/app/txs/txs"

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

export default function FormAddStake({
  type,
}: {
  type: "increase" | "decrease"
}) {
  const { data: accountBalance, isSuccess: isAccountBalanceSuccess } =
    useAccountBalances()

  const [amount, setAmount] = useState(1)

  const { activeAccount, activeSigner, activeChain, api } = useInkathon()
  const activeChainConfig = CHAIN_CONFIG[activeChain?.network || "Polkadot"]

  const { tokenDecimals, tokenSymbol } = activeChainConfig

  const { data: stakingInfo, isLoading, error } = useActiveAccountStakingInfo()

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

  const removeStake = async (e: any) => {
    e.preventDefault()

    if (!activeChain || !activeChain?.network || !api || !activeSigner) {
      return
    }

    const tx = await unstakeTx(
      api,
      activeSigner,
      activeChain,
      activeAccount?.address,
      stakeBalance
    )
  }

  const changeStake = (e: any) => {
    if (type === "increase") {
      stakeMore(e)
    } else {
      removeStake(e)
    }
  }

  const stakeOrUnstakeMax = (e: any) => {
    e.preventDefault()
    if (type === "increase") {
      const balance = bnToBn(freeBalance).gt(BN_ZERO) ? freeBalance : BN_ZERO
      setAmount(parseBN(balance?.toString(), tokenDecimals))
    } else {
      const balance = bnToBn(stakingInfo?.amount)
      setAmount(parseBN(balance?.toString(), tokenDecimals))
    }
  }

  return (
    <form className="flex w-full max-w-xl flex-col gap-5">
      <div className="flex w-full max-w-full flex-row gap-3">
        <AmountInput
          label={`Amount to ${type === "increase" ? "stake" : "unstake"}`}
          value={amount.toString()}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          info={type === "increase" ? "available" : "staked"}
        >
          <Button
            onClick={stakeOrUnstakeMax}
            variant="outline"
            className="h-10 border-2 flex-0 bg-default-100 hover:bg-pink-200"
            disabled={disabled}
          >
            {`${type === "increase" ? "Add max" : "Remove max"}`}
          </Button>
        </AmountInput>
      </div>

      <div className="flex w-full items-start gap-1 flex flex-col">
        <span className="text-sm mb-2">
          {type === "decrease" &&
            "⚠️ Once unbonding, your funds will become available after 28 days."}
        </span>
        <Button className="w-full" onClick={changeStake} disabled={disabled}>
          {type === "increase" ? (
            <>
              Add {amount} {tokenSymbol} to your stake
            </>
          ) : (
            <>
              Remove {amount} {tokenSymbol} from your stake
            </>
          )}
        </Button>
        <span className="text-xs">
          Estimated Fees: {stakeFeeValue} {tokenSymbol}
        </span>
      </div>
    </form>
  )
}
