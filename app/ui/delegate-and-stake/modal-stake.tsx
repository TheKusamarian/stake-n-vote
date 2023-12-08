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

import styles from "./modal.module.scss";
import { useAccountNominators } from "@/app/hooks/use-account-nominations";
import { useChain } from "@/app/providers/chain-provider";
import { CHAIN_CONFIG } from "@/app/config";
import useAccountBalances from "@/app/hooks/use-account-balance";
import { useState } from "react";
import { usePolkadotExtension } from "@/app/providers/extension-provider";
import { nominateTx } from "@/app/txs/txs";
import { ApiPromise } from "@polkadot/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

type ModalPropType = Omit<ModalProps, "children"> & {
  onDelegatingOpenChange: () => void;
};

export default function ModalStake(props: ModalPropType) {
  const { isOpen, onOpenChange, onDelegatingOpenChange } = props;

  const { api, activeChain } = useChain(); // Using useChain hook
  const { selectedAccount, getSigner } = usePolkadotExtension(); // Using usePolkadotExtension hook

  const { data: nominators, isLoading: isNominatorsLoading } =
    useAccountNominators();
  const { data: accountBalance, isLoading: isAccountBalanceLoading } =
    useAccountBalances();
  const { freeBalance } = accountBalance || {};
  const {
    maxNominators,
    validator: kusValidator,
    tokenSymbol,
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
            <ModalBody className="text-sm">
              {isAccountBalanceLoading || isNominatorsLoading ? (
                <>Loading</>
              ) : nominators?.length === 0 ? (
                <>
                  {freeBalance === "0" ? (
                    <NoFunds
                      tokenSymbol={tokenSymbol}
                      accountBalance={accountBalance}
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
                <AddKusToSet />
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
              <div className="my-2 text-xs">
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
              </div>
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

function AddToPool({ tokenSymbol }: { tokenSymbol: string }) {
  return (
    <p>
      Stake with nomination Pool partners Talisman (Stakes under minimum stake
      do not have voting power while in nomination pools)
    </p>
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

function AddKusToSet() {
  return <p>Add Kus Validation to your existing nominator set</p>;
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
      <p>TODO: some message that user is already staking?</p>
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