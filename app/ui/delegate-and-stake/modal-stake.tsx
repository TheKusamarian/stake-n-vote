import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
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
import { useState } from "react";
import { usePolkadotExtension } from "@/app/providers/extension-provider";
import { joinPool, nominateTx } from "@/app/txs/txs";
import { ApiPromise } from "@polkadot/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { useMinNominatorBond } from "@/app/hooks/use-min-nominator-bond";
import { BN_MAX_INTEGER, BN_ZERO, bnToBn, formatBalance } from "@polkadot/util";
import { Input } from "@nextui-org/input";
import { KusamaIcon, PolkadotIcon } from "../icons";
import { parseBN, trimAddress } from "@/app/util";
import { useIdentities } from "@/app/hooks/use-identities";
import Link from "next/link";
import { Tooltip } from "@nextui-org/tooltip";

type ModalPropType = Omit<ModalProps, "children"> & {
  onDelegatingOpenChange: () => void;
};

export default function ModalStake(props: ModalPropType) {
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
    data: minNominatorBond,
    isLoading: isMinNominatorBondLoading,
    isFetching: isMinNominatorBondFetching,
  } = useMinNominatorBond() || { data: "0" };

  const {
    maxNominators,
    validator: kusValidator,
    tokenSymbol,
    tokenDecimals,
  } = CHAIN_CONFIG[activeChain];

  const { freeBalance } = accountBalance || { freeBalance: BN_ZERO };
  console.log("freeBalance", freeBalance);
  const humanFreeBalance = parseBN(freeBalance, tokenDecimals);

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
              Stake {tokenSymbol} with Kus Validation{" "}
              <span className="text-xs text-gray-300">
                ({humanFreeBalance.toFixed(2)} {tokenSymbol} available)
              </span>
            </ModalHeader>
            <ModalBody className="text-sm mb-4">
              {isAccountBalanceLoading ||
              isNominatorsLoading ||
              isMinNominatorBondLoading ||
              isAccountBalanceFetching ||
              isNominatorsFetching ||
              isMinNominatorBondFetching ? (
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
                  <p>Something went wrong, try refreshing the page.</p>
                  <pre className="text-xs">
                    {nominators?.length} / {maxNominators}
                    {JSON.stringify(nominators, null, 2)}
                  </pre>
                </>
              )}
              {/* <p>{JSON.stringify(nominators, null, 2)}</p> */}
              {/* <FormStake /> */}
              {/* <div className="my-2 text-xs">
                <p>
                  The Kus Delegate is directed by verified humans from The
                  Kusamarian community{" "}
                </p>
                <p>
                  <a className="underline" href="https://discord.gg/eauz25UP">
                    Join our Discord
                  </a>{" "}
                  after you delegate!
                </p>
              </div> */}
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
        Balance 0 - Deposit {tokenSymbol} or buy {tokenSymbol} here.
      </p>
      <pre className="text-xs">{JSON.stringify(accountBalance, null, 2)}</pre>
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
}: {
  api: ApiPromise | undefined;
  getSigner: any;
  activeChain: string;
  tokenSymbol: string;
  tokenDecimals: number;
  accountBalance: any;
  selectedAccount: InjectedAccountWithMeta | null;
  minNominatorBond: any;
}) {
  const [amount, setAmount] = useState<number>(0);
  const stakeBalance =
    !isNaN(amount) && amount !== 0
      ? bnToBn(amount * Math.pow(10, tokenDecimals))
      : BN_ZERO;

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

  const stakeMax = () => {
    console.log(" you have ", accountBalance.freeBalance?.toString());
    const a = parseBN(accountBalance.freeBalance?.toString(), tokenDecimals);
    setAmount(a);
  };

  const humanReadableMinNominatorBond = parseBN(
    minNominatorBond,
    tokenDecimals
  );

  const amountSmallerThanMinNominatorBond = stakeBalance.lt(
    bnToBn(minNominatorBond)
  );

  const isDisabled =
    stakeBalance.lte(BN_ZERO) || stakeBalance.gt(accountBalance.freeBalance);

  return (
    <>
      <div className="flex gap-2">
        <Input
          type="number"
          label="Amount"
          placeholder="Enter Stake Amount"
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
          onValueChange={setAmount}
          size="sm"
          defaultValue="0"
          max={accountBalance.freeBalance}
          //@ts-ignore
          value={amount}
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
      {amountSmallerThanMinNominatorBond ? (
        <>
          <Tooltip
            content={`Stakes under ${humanReadableMinNominatorBond} ${tokenSymbol}
            stake do not have voting power while in nomination pools`}
            size="sm"
            color="warning"
            radius="sm"
          >
            <Button
              onClick={joinNominationPool}
              color="danger"
              isDisabled={isDisabled}
            >
              Stake with Nomination Pool
            </Button>
          </Tooltip>
        </>
      ) : (
        <StakeToRecommendedSet
          api={api}
          getSigner={getSigner}
          selectedAccount={selectedAccount}
          isDisabled={isDisabled}
        />
      )}
    </>
  );
}

function StakeToRecommendedSet({
  api,
  getSigner,
  selectedAccount,
  isDisabled,
}: {
  api: ApiPromise | undefined;
  getSigner: any;
  selectedAccount: InjectedAccountWithMeta | null;
  isDisabled: boolean;
}) {
  const { activeChain } = useChain();

  const nominate = async () => {
    const targets = CHAIN_CONFIG[activeChain].validator_set;

    const signer = await getSigner();
    const tx = await nominateTx(api, signer, selectedAccount?.address, targets);
  };

  return (
    <>
      <Button onClick={nominate} color="danger" isDisabled={isDisabled}>
        Stake with Kus Validation and friends
      </Button>
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
  selectedAccount: InjectedAccountWithMeta | null;
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
  selectedAccount: InjectedAccountWithMeta | null;
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
      >
        Replace above with Kus
      </Button>
    </div>
  );
}
