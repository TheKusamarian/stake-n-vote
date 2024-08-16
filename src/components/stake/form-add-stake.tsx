"use client"

import { useState } from "react"
import { parseBN } from "@/util"
import { BN, BN_ZERO, bnToBn } from "@polkadot/util"
import { useInkathon } from "@scio-labs/use-inkathon"

import { kusamaRelay } from "@/config/chains"
import { CHAIN_CONFIG } from "@/config/config"
import useAccountBalances from "@/hooks/use-account-balance"
import { useCall } from "@/hooks/use-call"
import { useExistentialDeposit } from "@/hooks/use-existential-deposit"
import { useTransactionFee } from "@/hooks/use-fees"
import useStakingInfo, {
  useActiveAccountStakingInfo,
} from "@/hooks/use-staking-info"
import { stakeMoreTx, unstakeTx } from "@/app/txs/txs"

import { AmountInput } from "../amount-input"
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

  const { data: stakingInfo } = useActiveAccountStakingInfo()
  const { data: existentialDeposit, isLoading: isEdLoading } =
    useExistentialDeposit()

  const stakeBalance =
    !isNaN(amount) && amount !== 0
      ? new BN(amount).mul(new BN(10).pow(new BN(tokenDecimals)))
      : BN_ZERO
  const { freeBalance } = accountBalance || { freeBalance: "0" }

  const disabled =
    !isAccountBalanceSuccess || isEdLoading || stakeBalance.isZero()

  const stakingWithValidator = !stakingInfo?.withValidator?.eq(BN_ZERO)

  const { data: stakeFee } = useTransactionFee(
    api?.tx.staking.bondExtra(stakeBalance),
    [activeAccount?.address]
  )

  const { data: bondMoreFee } = useTransactionFee(
    api?.tx.nominationPools.bondExtra({ FreeBalance: stakeBalance }),
    [activeAccount?.address]
  )

  const stakeFeeValue = stakeFee
    ? parseBN(stakeFee?.toString(), tokenDecimals)
    : "?"

  const stakeMore = async (e: any) => {
    e.preventDefault()

    if (
      !activeChain ||
      !activeChain?.network ||
      !api ||
      !activeSigner ||
      !activeAccount?.address
    ) {
      return
    }

    if (stakingWithValidator) {
      const tx = await stakeMoreTx(
        api,
        activeSigner,
        activeChain,
        activeAccount?.address,
        stakeBalance
      )
    } else {
      const tx = await stakeMoreTx(
        api,
        activeSigner,
        activeChain,
        activeAccount?.address,
        stakeBalance,
        true
      )
    }
  }

  const removeStake = async (e: any) => {
    e.preventDefault()

    if (
      !activeChain ||
      !activeChain?.network ||
      !api ||
      !activeSigner ||
      !activeAccount?.address
    ) {
      return
    }

    if (stakingWithValidator) {
      const tx = await unstakeTx(
        api,
        activeSigner,
        activeChain,
        activeAccount.address,
        stakeBalance
      )
    } else {
      const tx = await unstakeTx(
        api,
        activeSigner,
        activeChain,
        activeAccount.address,
        stakeBalance,
        true
      )
    }
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
    if (isEdLoading) {
      return
    }

    if (type === "increase") {
      const balance = bnToBn(freeBalance).gt(BN_ZERO) ? freeBalance : BN_ZERO
      const fees = stakingWithValidator ? stakeFee : bondMoreFee

      const notSpendable = bnToBn(fees).add(existentialDeposit!)

      const maxValue =
        fees && bnToBn(freeBalance).gt(bnToBn(fees))
          ? balance.sub(notSpendable)
          : BN_ZERO

      setAmount(parseBN(maxValue?.toString(), tokenDecimals))
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
