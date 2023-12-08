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
import { BN_MAX_INTEGER, bnToBn, formatBalance } from "@polkadot/util";
import { Input } from "@nextui-org/input";
import { KusamaIcon, PolkadotIcon } from "../icons";

type ModalPropType = Omit<ModalProps, "children"> & {
  onDelegatingOpenChange: () => void;
};

export default function ModalStake(props: ModalPropType) {
  const { isOpen, onOpenChange, onDelegatingOpenChange } = props;

  const { api, activeChain } = useChain(); // Using useChain hook
  const { selectedAccount, getSigner } = usePolkadotExtension(); // Using usePolkadotExtension hook

  const { data: nominators, isFetching: isNominatorsLoading } =
    useAccountNominators();
  const { data: accountBalance, isFetching: isAccountBalanceLoading } =
    useAccountBalances();

  const { data: minNominatorBond, isFetching: isMinNominatorBondLoading } =
    useMinNominatorBond() || { data: "0" };

  const { freeBalance } = accountBalance || { freeBalance: "0" };

  const {
    maxNominators,
    validator: kusValidator,
    tokenSymbol,
    tokenDecimals,
  } = CHAIN_CONFIG[activeChain];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={styles.modal}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent className={styles.modal}>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Stake {tokenSymbol} with Kus Validation
            </ModalHeader>
            <ModalBody className="text-sm mb-4">
              {isAccountBalanceLoading ||
              isNominatorsLoading ||
              isMinNominatorBondLoading ? (
                <>
                  <Skeleton className="rounded-lg w-full h-3" />
                  <Skeleton className="rounded-lg w-full h-3 mb-2" />
                  <Skeleton className="rounded-lg w-full h-3" />
                  <Skeleton className="rounded-lg w-full h-3 mb-2" />
                  <Skeleton className="rounded-lg">
                    <Button></Button>
                  </Skeleton>
                </>
              ) : nominators?.length === 0 ? (
                <>
                  {freeBalance === "0" ? (
                    <NoFunds
                      tokenSymbol={tokenSymbol}
                      accountBalance={accountBalance}
                    />
                  ) : minNominatorBond &&
                    bnToBn(freeBalance).lt(bnToBn(minNominatorBond)) ? (
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
                  ) : (
                    <StakeToRecommendedSet
                      api={api}
                      getSigner={getSigner}
                      selectedAccount={selectedAccount}
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
  const [amount, setAmount] = useState<string>("");

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
      bnToBn(amount).mul(bnToBn(10).pow(bnToBn(tokenDecimals))),
      poolToJoin
    );
  };

  const stakeMax = () => {
    console.log(" you have ", accountBalance.freeBalance?.toString());
    setAmount(
      bnToBn(accountBalance.freeBalance)
        .div(bnToBn(10).pow(bnToBn(tokenDecimals)))
        .toString()
    );
  };

  const humanReadableMinNominatorBond = formatBalance(
    bnToBn(minNominatorBond),
    {
      decimals: tokenDecimals,
      withUnit: tokenSymbol,
      withSi: false,
      // withAll: true,
      withZero: true,
      withAll: false,
    }
  );

  return (
    <>
      <p className="text-xs">
        Your balance is below the threshold of staking alone (
        {humanReadableMinNominatorBond} {tokenSymbol}), but you can join a
        Nomination Pool instead.
      </p>
      <p className="text-xs">
        Stake with nomination Pool partners Talisman (Stakes under minimum stake
        do not have voting power while in nomination pools)
      </p>
      <div className="flex gap-2">
        <Input
          type="number"
          endContent={
            <>
              {tokenSymbol}
              {activeChain === "Kusama" ? (
                <KusamaIcon className="pl-1" />
              ) : (
                <PolkadotIcon className="pl-1" />
              )}
            </>
          }
          onValueChange={setAmount}
          size="sm"
          defaultValue="0"
          max={accountBalance.freeBalance}
          value={amount}
        />
        <Button
          onClick={stakeMax}
          variant="bordered"
          className="border-white h-12"
        >
          Stake Max
        </Button>
      </div>
      <Button onClick={joinNominationPool} color="danger">
        Stake with Nomination Pool
      </Button>
    </>
  );
}

function StakeToRecommendedSet({
  api,
  getSigner,
  selectedAccount,
}: {
  api: ApiPromise | undefined;
  getSigner: any;
  selectedAccount: InjectedAccountWithMeta | null;
}) {
  const { activeChain } = useChain();

  const nominate = async () => {
    const targets = CHAIN_CONFIG[activeChain].validator_set;

    const signer = await getSigner();
    const tx = await nominateTx(api, signer, selectedAccount?.address, targets);
  };

  return (
    <>
      <Button onClick={nominate} color="danger">
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
}: {
  nominators: string[];
  validator: string;
  api: ApiPromise | undefined;
  getSigner: any;
  selectedAccount: InjectedAccountWithMeta | null;
}) {
  const [selected, setSelected] = useState<string | undefined>();

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
        {nominators.map((nominator) => {
          return (
            <Radio value={nominator} key={nominator}>
              {nominator}
            </Radio>
          );
        })}
      </RadioGroup>
      <Button className="w-full" color="danger" onClick={handleReplace}>
        Replace above with Kus
      </Button>
    </div>
  );
}
