import Image from "next/image"
import Link from "next/link"
import { useInkathon } from "@scio-labs/use-inkathon"
import Stake from "@w3f/polkadot-icons/keyline/Stake"
import Unstake from "@w3f/polkadot-icons/keyline/Unstake"
import Delegate from "@w3f/polkadot-icons/keyline/Vote"

import { kusamaRelay, polkadotRelay } from "@/config/chains"
import useStakingInfo from "@/hooks/use-staking-info"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useApp } from "@/app/app-provider"

import { Loader } from "../loader"
import { NotConnected } from "../not-connected"
import { MaybeAddToPool } from "./stake-add-to-pool"
import { AddKusToSet } from "./stake-add-to-set"
import { useStakeCalculations } from "./stake-calculations"
import StakingInfoBadge from "./stake-info-badge"
import { ReplaceOneWithKus } from "./stake-replace-one"
import { useStakeData } from "./use-stake-data"

export function ModalStake() {
  const {
    isStakingModalOpen,
    setIsStakingModalOpen,
    isChangeStakeModalOpen,
    setIsChangeStakeModalOpen,
  } = useApp()

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
    isLoading,
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

  return (
    <Dialog open={isStakingModalOpen} onOpenChange={setIsStakingModalOpen}>
      <DialogContent
        className="sm:max-w-[600px] border-4 border-primary-500 bg-gradient-to-br from-primary-500/50 to-teal-500/50 text-sm"
        isLoading={false}
      >
        {isLoading && (
          <div className="inset-0 bg-white/80 absolute flex justify-center items-center z-10">
            <Loader />
          </div>
        )}
        <DialogHeader>
          {/* @ts-ignore */}
          <DialogTitle>Stake {activeChain?.tokenSymbol}</DialogTitle>
          <DialogDescription>
            {/* @ts-ignore */}
            Here you can stake your {activeChain?.tokenSymbol} to earn rewards
            and secure the Polkadot network.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col">
          {renderStakeContent({
            activeAccount,
            nominators,
            freeBalance,
            minNominatorBond,
            tokenSymbol,
            tokenDecimals,
            api,
            activeSigner,
            activeChain,
            accountBalance,
            minimumActiveStake,
            stakeAmount,
            stakeBalance,
            setStakeAmount,
            kusValidator,
            maxNominators,
            amountSmallerThanMinNominatorBond,
            amountSmallerThanMinPoolJoinBond,
            minPoolJoinBond,
          })}
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

function renderStakeContent(props: {
  activeAccount: any
  nominators: any
  freeBalance: any
  minNominatorBond: any
  minPoolJoinBond: any
  tokenSymbol: any
  tokenDecimals: any
  api: any
  activeSigner: any
  activeChain: any
  accountBalance: any
  minimumActiveStake: any
  stakeAmount: any
  setStakeAmount: any
  stakeBalance: any
  kusValidator: any
  maxNominators: any
  amountSmallerThanMinNominatorBond: any
  amountSmallerThanMinPoolJoinBond: any
}) {
  const {
    activeAccount,
    nominators,
    freeBalance,
    minNominatorBond,
    minPoolJoinBond,
    tokenSymbol,
    tokenDecimals,
    api,
    activeSigner,
    activeChain,
    accountBalance,
    minimumActiveStake,
    stakeAmount,
    setStakeAmount,
    stakeBalance,
    kusValidator,
    maxNominators,
    amountSmallerThanMinNominatorBond,
    amountSmallerThanMinPoolJoinBond,
  } = props

  if (!activeAccount) {
    return <NotConnected />
  }

  if (nominators?.length === 0) {
    if (
      freeBalance.isZero() ||
      (activeChain === kusamaRelay && freeBalance.lt(minNominatorBond))
    ) {
      return (
        <NoFunds tokenSymbol={tokenSymbol} accountBalance={accountBalance} />
      )
    } else {
      return (
        <MaybeAddToPool
          signer={activeSigner}
          minNominatorBond={minNominatorBond}
          minPoolJoinBond={minPoolJoinBond}
          minimumActiveStake={minimumActiveStake}
          stakeAmount={stakeAmount}
          stakeBalance={stakeBalance}
          setStakeAmount={setStakeAmount}
          amountSmallerThanMinNominatorBond={amountSmallerThanMinNominatorBond}
          amountSmallerThanMinPoolJoinBond={amountSmallerThanMinPoolJoinBond}
        />
      )
    }
  }

  if (nominators?.includes(kusValidator)) {
    return <Success />
  }

  if (nominators?.length < maxNominators) {
    return (
      <AddKusToSet
        nominators={nominators}
        validator={kusValidator}
        api={api}
        signer={activeSigner}
        activeChain={activeChain}
        activeAccount={activeAccount}
        tokenSymbol={tokenSymbol}
      />
    )
  }

  if (nominators?.length === maxNominators) {
    return (
      <ReplaceOneWithKus
        nominators={nominators}
        validator={kusValidator}
        api={api}
        signer={activeSigner}
        activeAccount={activeAccount}
        activeChain={activeChain}
      />
    )
  }

  return (
    <p>
      Something went wrong{" "}
      <a
        className="cursor-pointer text-danger"
        onClick={() => window.location.reload()}
      >
        Try again
      </a>
      .
    </p>
  )
}

export function renderFooter({
  activeChain,
  amountSmallerThanMinNominatorBond,
  nominators,
  stakeAmount,
}: any) {
  return (
    <>
      {activeChain === polkadotRelay && (
        <a
          className="pl-1 flex flex-row items-center"
          href="https://twitter.com/dev1_sik"
          target="_blank"
          rel="noreferrer"
        >
          supported by{" "}
          <Image
            src="/sik.png"
            alt="sik staking"
            width={45}
            height={45}
            className="invert"
          />
        </a>
      )}
      {amountSmallerThanMinNominatorBond &&
        nominators?.length === 0 &&
        activeChain === polkadotRelay &&
        stakeAmount > 0 && (
          <>
            <span className="px-1">+</span>
            <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
              <Image
                src="talisman.svg"
                alt="talisman nomination pool"
                width={120}
                height={35}
                className="pl-2"
              />
            </a>
          </>
        )}
      {activeChain === kusamaRelay && (
        <a
          href="https://twitter.com/LuckyFridayLabs"
          target="_blank"
          rel="noreferrer"
          className="pl-1 flex flex-row items-center"
        >
          supported by{" "}
          <Image
            src="/lucky.png"
            alt="lucky friday staking"
            width={50}
            height={57}
            className="pl-2"
          />
        </a>
      )}
    </>
  )
}

function Success() {
  const { setIsDelegateModalOpen, setIsChangeStakeModalOpen } = useApp()
  const { data: stakingInfo, isLoading, error } = useStakingInfo()
  const { activeAccount } = useInkathon()

  return (
    <>
      {activeAccount && (
        <div className="bg-gradient-to-br from-teal-600 to-teal-300 rounded-md p-6 mb-4 flex flex-row items-center border-2">
          <span className="text-3xl mr-4">🔥</span>
          <div className="text-center w-full">
            Great! You are already staking
            <br />
            <StakingInfoBadge
              valueOnly={true}
              className="text-sm text-black inline font-bold rounded-md px-2 py-1 ml-2"
              withValidator={
                stakingInfo?.[activeAccount?.address]?.withValidator
              }
              inPool={stakingInfo?.[activeAccount?.address]?.inPool}
              isLoading={isLoading}
              error={error}
            />{" "}
            <br />
            with the Kus and earning rewards!
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => setIsChangeStakeModalOpen(true, "increase")}>
          <Stake stroke="#fff" className="mr-2 inline-block" width={25} />
          Stake More
        </Button>
        <Button onClick={() => setIsChangeStakeModalOpen(true, "decrease")}>
          <Unstake stroke="#fff" className="mr-2 inline-block" width={25} />{" "}
          Remove Stake
        </Button>
      </div>
      <Link color="danger" href="?feature=delegate#features" scroll={false}>
        <Button
          className="mt-2 w-full"
          onClick={() => setIsDelegateModalOpen(true)}
        >
          <Delegate stroke="#fff" className="mr-2 inline-block" width={25} />{" "}
          Delegate your voting power to the Kus
        </Button>
      </Link>
    </>
  )
}

function NoFunds({
  tokenSymbol,
  accountBalance,
}: {
  tokenSymbol: string
  accountBalance: any
}) {
  return (
    <>
      <p>
        Deposit {tokenSymbol} to your account or buy {tokenSymbol} via
      </p>
      <div className="mt-4 flex items-center gap-2">
        <a href="https://global.transak.com/">
          <Image
            src="transak.svg"
            alt="transak fiat onramp"
            width={120}
            height={50}
          />
        </a>{" "}
        or
        <a href="https://banxa.com/">
          <Image
            src="banxa.svg"
            alt="banxa fiat onramp"
            width={120}
            height={50}
          />
        </a>
      </div>
      <p className="mt-4">to start staking with the Kus</p>
    </>
  )
}
