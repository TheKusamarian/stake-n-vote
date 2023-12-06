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
import {
  CHAIN_CONFIG,
  KUSAMA_VALIDATOR,
  POLKADOT_VALIDATOR,
} from "@/app/config";
import useAccountBalances from "@/app/hooks/use-account-balance";
import { useState } from "react";
import { usePolkadotExtension } from "@/app/providers/extension-provider";
import { Signer } from "@polkadot/api/types";
import { nominateTx } from "@/app/txs/txs";

type ModalPropType = Omit<ModalProps, "children"> & {
  onDelegatingOpenChange: () => void;
};

export default function ModalStake(props: ModalPropType) {
  const { isOpen, onOpenChange, onDelegatingOpenChange } = props;
  const { activeChain } = useChain();
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
              ) : freeBalance === "0" ? (
                <NoFunds tokenSymbol={tokenSymbol} />
              ) : nominators?.length === 0 ? (
                <StakeToRecommendedSet />
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
                />
              ) : (
                <>
                  <p>Something went wrong, try refreshing the page.</p>
                  <pre className="text-xs">
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
      <p>Looks like you're already staking with The Kus!</p>
      <Button color="danger" onClick={goDelegate}>
        Delegate voting power
      </Button>
    </>
  );
}

function NoFunds({ tokenSymbol }: { tokenSymbol: string }) {
  return (
    <p>
      Without funds, you cannot stake, buy {tokenSymbol} <a href="#">here</a>
    </p>
  );
}

function AddToPool({ tokenSymbol }: { tokenSymbol: string }) {
  return (
    <p>
      You must add {tokenSymbol} to the pool <a href="#">here</a>
    </p>
  );
}

function StakeToRecommendedSet() {
  return (
    <p>
      Stake to the recommended set of validators <a href="#">here</a>
    </p>
  );
}

function AddKusToSet() {
  return (
    <p>
      Add Kus to the recommended set of validators <a href="#">here</a>
    </p>
  );
}

function ReplaceOneWithKus({
  nominators,
  validator,
}: {
  nominators: string[];
  validator: string;
}) {
  const [selected, setSelected] = useState<string | undefined>();
  const [modifiedArray, setModifiedArray] = useState<string[]>([]);

  const { api, activeChain } = useChain(); // Using useChain hook
  const { selectedAccount, getSigner } = usePolkadotExtension(); // Using usePolkadotExtension hook

  const nominate = async (targets: string[]) => {
    const signer = await getSigner();

    const tx = await nominateTx(api, signer, selectedAccount?.address, targets);

    console.log(tx);
  };

  const handleReplace = () => {
    if (selected) {
      const newTargets = nominators.map((item) =>
        item === selected ? validator : item
      );
      setModifiedArray(newTargets);
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
