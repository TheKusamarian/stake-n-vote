import { Dispatch, SetStateAction, useCallback, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { parseBN, trimAddress } from "@/util"
import { Tooltip } from "@nextui-org/tooltip"
import { ApiPromise } from "@polkadot/api"
import { Signer } from "@polkadot/api/types"
import { InjectedAccount } from "@polkadot/extension-inject/types"
import { BN, BN_ZERO, bnToBn } from "@polkadot/util"
import { SubstrateChain, useInkathon } from "@scio-labs/use-inkathon"

import { kusamaRelay, polkadotRelay } from "@/config/chains"
import { CHAIN_CONFIG } from "@/config/config"
import useAccountBalances from "@/hooks/use-account-balance"
import { useAccountNominators } from "@/hooks/use-account-nominations"
import { useStakingMetrics } from "@/hooks/use-min-nominator-bond"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/app/app-provider"
import { bondAndNominateTx, joinPool, nominateTx } from "@/app/txs/txs"

import { Loader } from "../loader"
import { NotConnected } from "../not-connected"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

export function ModalStake() {
  const { isStakingModalOpen, setIsStakingModalOpen } = useApp()
  // const router = useRouter()
  const { activeChain, activeAccount, api, activeSigner } = useInkathon()

  const {
    data: nominators,
    isLoading: isNominatorsLoading,
    isFetching: isNominatorsFetching,
  } = useAccountNominators()
  const {
    data: accountBalance,
    isLoading: isAccountBalanceLoading,
    isFetching: isAccountBalanceFetching,
  } = useAccountBalances()

  const {
    data: stakingMetrics,
    isLoading: isStakingMetricsLoading,
    isFetching: isStakingMetricsFetching,
  } = useStakingMetrics()

  const { minNominatorBond, minimumActiveStake } = stakingMetrics || {
    minNominatorBond: "0",
    minimumActiveStake: "0",
  }

  const {
    maxNominators,
    validator: kusValidator,
    tokenSymbol,
    tokenDecimals,
  } = CHAIN_CONFIG[activeChain?.network || "Polkadot"] || {}

  const { freeBalance } = accountBalance || { freeBalance: BN_ZERO }
  const humanFreeBalance = parseBN(freeBalance, tokenDecimals)

  const [stakeAmount, setStakeAmount] = useState<number | undefined>(0)
  const stakeBalance =
    stakeAmount && !isNaN(stakeAmount) && stakeAmount !== 0
      ? bnToBn(stakeAmount * Math.pow(10, tokenDecimals))
      : BN_ZERO

  const polkadotMinNominatorBond = bnToBn(minimumActiveStake).addn(
    tokenDecimals * 100
  )

  const amountSmallerThanMinNominatorBond =
    activeChain === kusamaRelay
      ? stakeBalance.lt(bnToBn(minimumActiveStake))
      : stakeBalance.lt(polkadotMinNominatorBond)

  const showSupported = !freeBalance.eq(BN_ZERO)

  return (
    <Dialog open={isStakingModalOpen} onOpenChange={setIsStakingModalOpen}>
      <DialogContent className="sm:max-w-[600px] border-4 border-primary-500 bg-gradient-to-br from-primary-500/50 to-teal-500/50 text-sm">
        <DialogHeader>
          {/* @ts-ignore */}
          <DialogTitle>Stake {activeChain?.tokenSymbol} </DialogTitle>
          <DialogDescription>
            {/* @ts-ignore */}
            Here you can stake your {activeChain?.tokenSymbol} to earn rewards
            and secure the Polkadot network.
          </DialogDescription>
        </DialogHeader>
        <>
          <div className="flex flex-1 flex-col">
            {activeAccount === undefined ? (
              <NotConnected />
            ) : isAccountBalanceLoading ||
              isNominatorsLoading ||
              isStakingMetricsLoading ||
              isAccountBalanceFetching ||
              isNominatorsFetching ||
              isStakingMetricsFetching ? (
              <Loader />
            ) : nominators?.length === 0 ? (
              <>
                {freeBalance.toString() === "0" ||
                freeBalance.toString() === "00" ||
                (activeChain === kusamaRelay &&
                  freeBalance.lt(bnToBn(minNominatorBond))) ? (
                  <NoFunds
                    tokenSymbol={tokenSymbol}
                    accountBalance={accountBalance}
                  />
                ) : (
                  <MaybeAddToPool
                    tokenSymbol={tokenSymbol}
                    tokenDecimals={tokenDecimals}
                    api={api}
                    signer={activeSigner}
                    activeChain={activeChain}
                    accountBalance={accountBalance}
                    activeAccount={activeAccount}
                    minNominatorBond={minNominatorBond}
                    minimumActiveStake={minimumActiveStake}
                    stakeBalance={stakeBalance}
                    stakeAmount={stakeAmount}
                    setStakeAmount={setStakeAmount}
                    amountSmallerThanMinNominatorBond={
                      amountSmallerThanMinNominatorBond
                    }
                  />
                )}
              </>
            ) : nominators?.includes(kusValidator) ? (
              <Success />
            ) : nominators?.length && nominators.length < maxNominators ? (
              <AddKusToSet
                nominators={nominators}
                validator={kusValidator}
                api={api}
                signer={activeSigner}
                activeAccount={activeAccount}
                tokenSymbol={tokenSymbol}
              />
            ) : nominators?.length === maxNominators ? (
              <ReplaceOneWithKus
                nominators={nominators}
                validator={kusValidator}
                api={api}
                signer={activeSigner}
                activeAccount={activeAccount}
                activeChain={activeChain}
              />
            ) : (
              <>
                <p>
                  Something went wrong{" "}
                  <a
                    className="cursor-pointer text-danger"
                    // onClick={() => router.refresh()}
                  >
                    Try again
                  </a>
                  .
                </p>
              </>
            )}
          </div>
        </>
        <DialogFooter>
          <div className="flex items-center justify-end text-right text-xs">
            supported by{" "}
            {activeChain === polkadotRelay && (
              <a
                className="pl-1"
                href="https://twitter.com/dev1_sik"
                target="_blank"
                rel="noreferrer"
              >
                <Image src="sik.png" alt="sik staking" width={45} height={45} />
              </a>
            )}
            {amountSmallerThanMinNominatorBond &&
            nominators?.length === 0 &&
            activeChain === polkadotRelay &&
            stakeAmount ? (
              <>
                <span className="px-1">+</span>
                <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
                  <Image
                    src="talisman.svg"
                    alt="talisman nomination pool"
                    width={90}
                    height={35}
                    className="pl-2 invert"
                  />
                </a>
              </>
            ) : (
              <>
                {activeChain === kusamaRelay && (
                  <a
                    href="https://twitter.com/LuckyFridayLabs"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src="lucky.png"
                      alt="lucky friday staking"
                      width={50}
                      height={57}
                      className="pl-2 brightness-200 grayscale"
                    />
                  </a>
                )}
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Success() {
  return (
    <>
      <p>Looks like you&apos;re already staking with The Kus!</p>
      {/* <Button color="success" size="lg">
          Manage your stake
        </Button> */}

      <Link color="danger" href="?feature=delegate#features" scroll={false}>
        <Button className="mt-4">Delegate voting power</Button>
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
      <p className="mt-4">to start staking with the Kusamarian</p>
    </>
  )
}

function MaybeAddToPool({
  api,
  signer,
  tokenSymbol,
  tokenDecimals,
  activeChain,
  accountBalance,
  activeAccount,
  minNominatorBond,
  minimumActiveStake,
  stakeAmount,
  setStakeAmount,
  stakeBalance,
  amountSmallerThanMinNominatorBond,
}: {
  api: ApiPromise | undefined
  signer: Signer | undefined
  activeChain: SubstrateChain | undefined
  tokenSymbol: string
  tokenDecimals: number
  accountBalance: any
  activeAccount: InjectedAccount | null
  minNominatorBond: any
  minimumActiveStake: any
  stakeAmount: number | undefined
  setStakeAmount: Dispatch<SetStateAction<number | undefined>>
  stakeBalance: BN
  amountSmallerThanMinNominatorBond: boolean
}) {
  const joinNominationPool = useCallback(
    async (e: any) => {
      e.preventDefault()
      if (!activeChain || !activeChain?.network || !api || !signer) {
        return
      }
      const poolToJoin = CHAIN_CONFIG[activeChain.network].poolId

      console.log(
        "activeChain aaa",
        poolToJoin,
        activeChain,
        activeChain?.network,
        CHAIN_CONFIG
      )

      if (!poolToJoin) {
        return
      }

      const tx = await joinPool(
        api,
        signer,
        activeAccount?.address,
        stakeBalance,
        poolToJoin
      )
    },
    [activeChain]
  )

  const bondAndNominate = async () => {
    const targets =
      CHAIN_CONFIG[activeChain?.network || "Polkadot"].validator_set

    const amount = bnToBn(stakeAmount)

    const tx = await bondAndNominateTx(
      api,
      signer,
      activeAccount?.address,
      targets,
      amount
    )
  }

  const stakeMax = (e: any) => {
    e.preventDefault()
    const a =
      parseBN(accountBalance.freeBalance?.toString(), tokenDecimals) - 0.2

    //parse a to 2 decimals and round down
    const b = Math.floor(a * 100) / 100
    setStakeAmount(b)
  }

  const humanReadableMinNominatorBond = parseBN(minNominatorBond, tokenDecimals)

  const isDisabled =
    activeChain === polkadotRelay
      ? stakeBalance.lte(BN_ZERO) || stakeBalance.gt(accountBalance.freeBalance)
      : stakeBalance.lt(minNominatorBond) ||
        stakeBalance.gt(accountBalance.freeBalance)

  return (
    <form>
      <div className="flex w-full max-w-sm items-end space-x-2">
        <div>
          <Label htmlFor="amount" className="font-bold">
            Amount to Stake
          </Label>
          <Input
            id="amount"
            type="number"
            min={0}
            // max={}
            step={0.01}
            placeholder={
              activeChain === kusamaRelay
                ? `Enter staking amount > ${humanReadableMinNominatorBond} ${tokenSymbol}`
                : `Enter staking amount`
            }
            value={stakeAmount?.toString()}
            onChange={(e) => {
              const stakeAmount = parseFloat(e.target.value)
              setStakeAmount(stakeAmount)
            }}
            className="text-black"
          />
        </div>
        <span className="flex h-10 w-12 items-center pr-4 text-sm font-bold">
          {tokenSymbol}
        </span>
        <Button
          onClick={stakeMax}
          variant="outline"
          // isDisabled={!isAccountBalanceSuccess}
        >
          Stake Max
        </Button>
      </div>
      {/* <Input
            type="number"
            label="Amount"
            placeholder={
              activeChain === kusamaRelay
                ? `Enter staking amount > ${humanReadableMinNominatorBond} ${tokenSymbol}`
                : `Enter staking amount`
            }
            endContent={
              <>
                {tokenSymbol}
                {activeChain === kusamaRelay ? (
                  <KusamaIcon className="pl-1 pt-1" />
                ) : (
                  <PolkadotIcon className="pl-1 pt-1" />
                )}
              </>
            }
            //@ts-ignore
            onValueChange={setStakeAmount}
            size="sm"
            max={accountBalance.freeBalance}
            //@ts-ignore
            value={stakeAmount}
            step={0.01}
          />
          <Button
            onClick={stakeMax}
            variant="bordered"
            className="h-12 border-white"
          >
            Stake Max
          </Button> */}
      {amountSmallerThanMinNominatorBond && kusamaRelay ? (
        <>
          <Tooltip
            content={`Stakes under ${humanReadableMinNominatorBond} ${tokenSymbol}
              stake do not have voting power while in nomination pools`}
            size="sm"
            color="warning"
            radius="sm"
            placement="bottom"
          >
            <Button
              onClick={joinNominationPool}
              disabled={isDisabled}
              size="lg"
              className="mt-4 w-full"
            >
              Stake with Nomination Pool
            </Button>
          </Tooltip>
        </>
      ) : (
        <Button
          onClick={bondAndNominate}
          color="danger"
          disabled={isDisabled}
          className="mt-4 w-full"
        >
          Stake with Kus Validation and friends
        </Button>
      )}
    </form>
  )
}

function AddKusToSet({
  nominators,
  validator,
  api,
  signer,
  activeAccount,
  tokenSymbol,
}: {
  nominators: string[]
  validator: string
  api: ApiPromise | undefined
  signer: Signer | undefined
  activeAccount: InjectedAccount | null
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

function ReplaceOneWithKus({
  nominators,
  validator,
  api,
  signer,
  activeAccount,
  activeChain,
}: {
  nominators: string[]
  validator: string
  api: ApiPromise | undefined
  signer: Signer | undefined
  activeAccount: InjectedAccount | null
  activeChain: SubstrateChain | undefined
}) {
  const [selected, setSelected] = useState<string | undefined>()

  // const { data: identities } = useIdentities(nominators);
  // console.log("in modal: identities", identities);

  const nominate = async (targets: string[]) => {
    const tx = await nominateTx(api, signer, activeAccount?.address, targets)
  }

  const handleReplace = () => {
    if (selected) {
      const newTargets = nominators.map((item) =>
        item === selected ? validator : item
      )
      nominate(newTargets)
    }
  }

  return (
    <div className="flex flex-col gap-3 text-white">
      <p>
        Your nominator set is full! Select one nomination to replace with Kus
        Validation
      </p>

      <RadioGroup
        // label="Replace the following nominee"
        color="danger"
        // size="sm"
        value={selected}
        onValueChange={setSelected}
        // classNames={{
        //   description: "text-white",
        //   label: "text-white font-bold",
        // }}
      >
        {nominators?.map((address) => {
          // const { address, identity } = iden;
          return (
            <RadioGroupItem value={address} key={address}>
              <span className="text-white">{trimAddress(address, 12)} | </span>
              <Link
                href={`https://${activeChain?.network}.subscan.io/account/${address}`}
                target="_blank"
                rel="noreferrer"
                className="text-white underline"
              >
                subscan ↗
              </Link>
            </RadioGroupItem>
          )
        })}
      </RadioGroup>
      <Button
        className="w-full"
        color="danger"
        onClick={handleReplace}
        disabled={!selected}
        size="lg"
      >
        Replace above with Kus
      </Button>
    </div>
  )
}
