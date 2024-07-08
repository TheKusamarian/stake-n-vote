"use client"

import { useInkathon } from "@scio-labs/use-inkathon"

import { CHAIN_CONFIG } from "@/config/config"
import useStakingInfo from "@/hooks/use-staking-info"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useApp } from "@/app/app-provider"

import FormAddStake from "./form-add-stake"
import { renderFooter } from "./modal-stake"
import { useStakeCalculations } from "./stake-calculations"
import StakingInfoBadge from "./stake-info-badge"
import { useStakeData } from "./use-stake-data"

export function ModalChangeStake({ type }: { type: "increase" | "decrease" }) {
  const { isChangeStakeModalOpen, setIsChangeStakeModalOpen } = useApp()

  const {
    activeChain,
    activeAccount,
    api,
    activeSigner,
    nominators,
    accountBalance,
    stakingMetrics,
    stakeAmount,
    setStakeAmount,
  } = useStakeData()

  const {
    minNominatorBond,
    minimumActiveStake,
    tokenSymbol,
    tokenDecimals,
    freeBalance,
    humanFreeBalance,
    amountSmallerThanMinNominatorBond,
    amountSmallerThanMinPoolJoinBond,
    showSupported,
    maxNominators,
    kusValidator,
    stakeBalance,
    minPoolJoinBond,
  } = useStakeCalculations({
    activeChain,
    accountBalance,
    stakingMetrics,
    stakeAmount,
  })

  const { data: stakingInfo, isLoading, error } = useStakingInfo()

  return (
    <Dialog
      open={isChangeStakeModalOpen}
      onOpenChange={(open) => setIsChangeStakeModalOpen(open, type)}
    >
      <DialogContent className="sm:max-w-[600px] border-4 border-primary-500 bg-gradient-to-br from-primary-500/50 to-teal-500/50">
        <DialogHeader>
          {/* @ts-ignore */}
          <DialogTitle>
            {type === "increase"
              ? `Stake more ${tokenSymbol}`
              : `Remove ${tokenSymbol} Stake`}
          </DialogTitle>
          <DialogDescription>
            You are currently staking{" "}
            {activeAccount && (
              <StakingInfoBadge
                valueOnly={true}
                className="text-sm text-black inline font-bold rounded-md py-1"
                withValidator={
                  stakingInfo?.[activeAccount?.address]?.withValidator
                }
                inPool={stakingInfo?.[activeAccount?.address]?.inPool}
                isLoading={isLoading}
                error={error}
              />
            )}
            . You can {type === "increase" ? "increase" : "decrease"} your stake
            below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-1 flex-col">
            <FormAddStake type={type} />
          </div>
        </div>
        <DialogFooter>
          <div className="flex items-center justify-end text-right text-xs">
            {renderFooter({
              activeChain,
              amountSmallerThanMinNominatorBond,
              nominators,
              stakeAmount,
            })}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
