import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/modal";

import styles from "./modal.module.scss";
import FormDelegate from "./form-delegate";
import { sendDelegateTx } from "@/app/txs/txs";
import { usePolkadotExtension } from "@/app/providers/extension-provider";
import useAccountBalances from "@/app/hooks/use-account-balance";
import { useChain } from "@/app/providers/chain-provider";
import { format } from "path";
import { BN_ZERO, formatBalance } from "@polkadot/util";

type ModalPropType = Omit<ModalProps, "children">;

export default function ModalDelegate(props: ModalPropType) {
  const { isOpen, onOpenChange } = props;
  const { activeChain, chainConfig } = useChain();
  const { tokenSymbol } = chainConfig;
  const { data: accountBalance, isLoading } = useAccountBalances();
  const { stakedBalance } = accountBalance || {};

  const humanStakedBalance = formatBalance(stakedBalance, {
    withSi: true,
    withUnit: tokenSymbol,
    decimals: 2,
    forceUnit: "-",
  });

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
              Delegate Votes to The Kus Delegate {activeChain}
            </ModalHeader>
            <ModalBody className="text-sm">
              {!isLoading && accountBalance && stakedBalance?.eq(BN_ZERO) && (
                <p>
                  Your staked {humanStakedBalance} is already locked for 28 days
                  - put it to work directing the network!
                </p>
              )}
              <FormDelegate />
              <p className="my-2 text-center">
                The Kus Delegate is directed by verified humans from The
                Kusamarian community -{" "}
                <a className="underline" href="https://discord.gg/eauz25UP">
                  Join our Discord
                </a>{" "}
                after you delegate!
              </p>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
