import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
} from "@nextui-org/modal";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { Skeleton } from "@nextui-org/skeleton";

import styles from "./modal.module.scss";
import { useAccountNominators } from "@/app/hooks/use-account-nominations";
import { useChain } from "@/app/providers/chain-provider";
import { CHAIN_CONFIG } from "@/app/config";
import useAccountBalances from "@/app/hooks/use-account-balance";
import { Dispatch, SetStateAction, useState } from "react";
import { usePolkadotExtension } from "@/app/providers/extension-provider";
import { bondAndNominateTx, joinPool, nominateTx } from "@/app/txs/txs";
import { ApiPromise } from "@polkadot/api";
import { useStakingMetrics } from "@/app/hooks/use-min-nominator-bond";
import {
  BN,
  BN_MAX_INTEGER,
  BN_ONE,
  BN_ZERO,
  bnToBn,
  formatBalance,
} from "@polkadot/util";
import { Input } from "@nextui-org/input";
import { KusamaIcon, PolkadotIcon } from "../icons";
import { parseBN, trimAddress } from "@/app/util";
import { useIdentities } from "@/app/hooks/use-identities";
import Link from "next/link";
import { Tooltip } from "@nextui-org/tooltip";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NotConnected } from "./not-connected";
import { WalletAccount } from "@talismn/connect-wallets";

type ModalPropType = Omit<ModalProps, "children"> & {
  onDelegatingOpenChange: () => void;
};

export default function ModalStake(props: ModalPropType) {
  const router = useRouter();
  const { isOpen, onOpenChange, onDelegatingOpenChange } = props;

  const { api, activeChain } = useChain(); // Using useChain hook
  const { selectedAccount, getSigner } = usePolkadotExtension(); // Using usePolkadotExtension hook

  const {
    data: nominators,
    isLoading: isNominatorsLoading,
    isFetching: isNominatorsFetching,
  } = useAccountNominators();
  const {
    data: accountBalance,
    isLoading: isAccountBalanceLoading,
    isFetching: isAccountBalanceFetching,
  } = useAccountBalances();

  const {
    data: stakingMetrics,
    isLoading: isStakingMetricsLoading,
    isFetching: isStakingMetricsFetching,
  } = useStakingMetrics();

  const { minNominatorBond, minimumActiveStake } = stakingMetrics || {
    minNominatorBond: "0",
    minimumActiveStake: "0",
  };

  const {
    maxNominators,
    validator: kusValidator,
    tokenSymbol,
    tokenDecimals,
  } = CHAIN_CONFIG[activeChain];

  const { freeBalance } = accountBalance || { freeBalance: BN_ZERO };
  const humanFreeBalance = parseBN(freeBalance, tokenDecimals);

  const [stakeAmount, setStakeAmount] = useState<number | undefined>();
  const stakeBalance =
    stakeAmount && !isNaN(stakeAmount) && stakeAmount !== 0
      ? bnToBn(stakeAmount * Math.pow(10, tokenDecimals))
      : BN_ZERO;

  const polkadotMinNominatorBond = bnToBn(minimumActiveStake).addn(
    tokenDecimals * 25
  );

  const amountSmallerThanMinNominatorBond =
    activeChain === "Kusama"
      ? stakeBalance.lt(bnToBn(minimumActiveStake))
      : stakeBalance.lt(polkadotMinNominatorBond);

  const showSupported = !freeBalance.eq(BN_ZERO);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={styles.modal}
      size="2xl"
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent className={styles.modal}>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {selectedAccount ? (
                <>
                  Stake {tokenSymbol} with Kus Validation{" "}
                  <span className="text-xs text-gray-300">
                    ({humanFreeBalance.toFixed(2)} {tokenSymbol} available)
                  </span>
                </>
              ) : (
                "No account found"
              )}
            </ModalHeader>
            <ModalBody className="text-sm mb-4">
              {selectedAccount === undefined ? (
                <NotConnected />
              ) : isAccountBalanceLoading ||
                isNominatorsLoading ||
                isStakingMetricsLoading ||
                isAccountBalanceFetching ||
                isNominatorsFetching ||
                isStakingMetricsFetching ? (
                <>
                  <Skeleton className="rounded-lg">
                    <Button></Button>
                  </Skeleton>
                  <Skeleton className="rounded-lg">
                    <Button></Button>
                  </Skeleton>
                </>
              ) : nominators?.length === 0 ? (
                <>
                  {freeBalance.toString() === "0" ||
                  freeBalance.toString() === "00" ||
                  (activeChain === "Kusama" &&
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
                      getSigner={getSigner}
                      activeChain={activeChain}
                      accountBalance={accountBalance}
                      selectedAccount={selectedAccount}
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
                <Success
                  onClose={onClose}
                  onDelegationOpenChange={onDelegatingOpenChange}
                />
              ) : nominators?.length && nominators.length < maxNominators ? (
                <AddKusToSet
                  nominators={nominators}
                  validator={kusValidator}
                  api={api}
                  getSigner={getSigner}
                  selectedAccount={selectedAccount}
                  tokenSymbol={tokenSymbol}
                />
              ) : nominators?.length === maxNominators ? (
                <ReplaceOneWithKus
                  nominators={nominators}
                  validator={kusValidator}
                  api={api}
                  getSigner={getSigner}
                  selectedAccount={selectedAccount}
                  activeChain={activeChain}
                />
              ) : (
                <>
                  <p>
                    Something went wrong{" "}
                    <a
                      className="text-danger cursor-pointer"
                      onClick={() => router.refresh()}
                    >
                      Try again
                    </a>
                    .
                  </p>
                </>
              )}
              {showSupported && (
                <div className="flex items-center justify-end text-xs h-5 text-gray-200">
                  supported by{" "}
                  {activeChain === "Polkadot" && (
                    <a
                      className="pl-1"
                      href="https://twitter.com/dev1_sik"
                      target="_blank"
                    >
                      <Image
                        src="sik.png"
                        alt="sik staking"
                        width={35}
                        height={35}
                      />
                    </a>
                  )}
                  {amountSmallerThanMinNominatorBond &&
                  nominators?.length === 0 &&
                  activeChain === "Polkadot" &&
                  stakeAmount ? (
                    <>
                      <span className="px-1">+</span>
                      <a href="https://talisman.xyz" target="_blank">
                        <Image
                          src="talisman.svg"
                          alt="talisman nomination pool"
                          width={90}
                          height={35}
                          className="invert pl-2"
                        />
                      </a>
                    </>
                  ) : (
                    <>
                      {activeChain === "Kusama" && (
                        <a
                          href="https://twitter.com/LuckyFridayLabs"
                          target="_blank"
                        >
                          <Image
                            src="lucky.png"
                            alt="lucky friday staking"
                            width={40}
                            height={45}
                            className="pl-2"
                          />
                        </a>
                      )}
                    </>
                  )}
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function Success({
  onClose,
  onDelegationOpenChange,
}: {
  onClose: () => void;
  onDelegationOpenChange: () => void;
}) {
  function goDelegate() {
    onClose();
    onDelegationOpenChange();
  }

  return (
    <>
      <p>Looks like you&apos;re already staking with The Kus!</p>
      <Button color="danger" onClick={goDelegate}>
        Delegate voting power
      </Button>
    </>
  );
}

function NoFunds({
  tokenSymbol,
  accountBalance,
}: {
  tokenSymbol: string;
  accountBalance: any;
}) {
  return (
    <>
      <p>
        Deposit {tokenSymbol} to your account or buy {tokenSymbol}
      </p>
      <div className="flex gap-2 items-center">
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
    </>
  );
}

function MaybeAddToPool({
  api,
  getSigner,
  tokenSymbol,
  tokenDecimals,
  activeChain,
  accountBalance,
  selectedAccount,
  minNominatorBond,
  minimumActiveStake,
  stakeAmount,
  setStakeAmount,
  stakeBalance,
  amountSmallerThanMinNominatorBond,
}: {
  api: ApiPromise | undefined;
  getSigner: any;
  activeChain: string;
  tokenSymbol: string;
  tokenDecimals: number;
  accountBalance: any;
  selectedAccount: WalletAccount | null;
  minNominatorBond: any;
  minimumActiveStake: any;
  stakeAmount: number | undefined;
  setStakeAmount: Dispatch<SetStateAction<number | undefined>>;
  stakeBalance: BN;
  amountSmallerThanMinNominatorBond: boolean;
}) {
  const joinNominationPool = async () => {
    const poolToJoin = CHAIN_CONFIG[activeChain].poolId;

    if (!poolToJoin) {
      throw new Error("No pool to join");
    }

    const signer = await getSigner();
    const tx = await joinPool(
      api,
      signer,
      selectedAccount?.address,
      stakeBalance,
      poolToJoin
    );
  };

  const bondAndNominate = async () => {
    const targets = CHAIN_CONFIG[activeChain].validator_set;
    const signer = await getSigner();

    const amount = bnToBn(stakeAmount);

    const tx = await bondAndNominateTx(
      api,
      signer,
      selectedAccount?.address,
      targets,
      amount
    );
  };

  const stakeMax = () => {
    const a =
      parseBN(accountBalance.freeBalance?.toString(), tokenDecimals) - 0.2;
    setStakeAmount(a);
  };

  const humanReadableMinNominatorBond = parseBN(
    minNominatorBond,
    tokenDecimals
  );

  const isDisabled =
    activeChain === "Polkadot"
      ? stakeBalance.lte(BN_ZERO) || stakeBalance.gt(accountBalance.freeBalance)
      : stakeBalance.lt(minNominatorBond) ||
        stakeBalance.gt(accountBalance.freeBalance);

  return (
    <>
      <div className="flex gap-2">
        <Input
          type="number"
          label="Amount"
          placeholder={
            activeChain === "Kusama"
              ? `Enter staking amount > ${humanReadableMinNominatorBond} ${tokenSymbol}`
              : `Enter staking amount`
          }
          endContent={
            <>
              {tokenSymbol}
              {activeChain === "Kusama" ? (
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
          className="border-white h-12"
        >
          Stake Max
        </Button>
      </div>
      {amountSmallerThanMinNominatorBond && activeChain !== "Kusama" ? (
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
              color="danger"
              isDisabled={isDisabled}
              size="lg"
            >
              Stake with Nomination Pool
            </Button>
          </Tooltip>
        </>
      ) : (
        <Button
          onClick={bondAndNominate}
          color="danger"
          isDisabled={isDisabled}
          size="lg"
        >
          Stake with Kus Validation and friends
        </Button>
      )}
    </>
  );
}

function AddKusToSet({
  nominators,
  validator,
  api,
  getSigner,
  selectedAccount,
  tokenSymbol,
}: {
  nominators: string[];
  validator: string;
  api: ApiPromise | undefined;
  getSigner: any;
  selectedAccount: WalletAccount | null;
  tokenSymbol: string;
}) {
  return (
    <>
      <p>Great! You are already staking your {tokenSymbol}</p>
      <p>Would you like to add The Kus to your nominator set?</p>
      <Button
        onClick={async () => {
          const signer = await getSigner();
          const tx = await nominateTx(
            api,
            signer,
            selectedAccount?.address,
            nominators.concat(validator)
          );
        }}
        color="danger"
        size="lg"
      >
        Add Kus to nominator set
      </Button>
    </>
  );
}

function ReplaceOneWithKus({
  nominators,
  validator,
  api,
  getSigner,
  selectedAccount,
  activeChain,
}: {
  nominators: string[];
  validator: string;
  api: ApiPromise | undefined;
  getSigner: any;
  selectedAccount: WalletAccount | null;
  activeChain: string;
}) {
  const [selected, setSelected] = useState<string | undefined>();

  // const { data: identities } = useIdentities(nominators);
  // console.log("in modal: identities", identities);

  const nominate = async (targets: string[]) => {
    const signer = await getSigner();
    const tx = await nominateTx(api, signer, selectedAccount?.address, targets);
  };

  const handleReplace = () => {
    if (selected) {
      const newTargets = nominators.map((item) =>
        item === selected ? validator : item
      );
      nominate(newTargets);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p>
        Your nominator set is full! Select one nomination to replace with Kus
        Validation
      </p>

      <RadioGroup
        label="Replace the following nominee"
        color="danger"
        size="sm"
        value={selected}
        onValueChange={setSelected}
      >
        {nominators?.map((address) => {
          // const { address, identity } = iden;
          return (
            <Radio value={address} key={address}>
              <span className="">{trimAddress(address, 8)} </span>
              <Link
                href={`//${activeChain}.subscan.io/account/${address}`}
                target="_blank"
                className="underline text-xs text-default-500"
              >
                👀 subscan ↗️
              </Link>
            </Radio>
          );
        })}
      </RadioGroup>
      <Button
        className="w-full"
        color="danger"
        onClick={handleReplace}
        isDisabled={!selected}
        size="lg"
      >
        Replace above with Kus
      </Button>
    </div>
  );
}
