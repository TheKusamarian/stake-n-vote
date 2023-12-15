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
import { parseBN } from "@/app/util";
import { CHAIN_CONFIG } from "@/app/config";

type ModalPropType = Omit<ModalProps, "children">;

export default function ModalDelegate(props: ModalPropType) {
  const { isOpen, onOpenChange } = props;
  const { activeChain, chainConfig } = useChain();
  const { data: accountBalance, isLoading } = useAccountBalances();
  const { stakedBalance } = accountBalance || {};

  const {
    maxNominators,
    validator: kusValidator,
    tokenSymbol,
    tokenDecimals,
  } = CHAIN_CONFIG[activeChain];

  const { freeBalance } = accountBalance || { freeBalance: BN_ZERO };
  const humanFreeBalance = parseBN(freeBalance, tokenDecimals);

  const humanStakedBalance = formatBalance(stakedBalance, {
    withSi: false,
    withUnit: tokenSymbol,
    decimals: 2,
    forceUnit: "-",
    withAll: true,
    withZero: true,
  });

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
              Delegate Votes to The Kus Delegate {activeChain}
              <span className="text-xs text-gray-300">
                ({humanFreeBalance.toFixed(2)} {tokenSymbol} available)
              </span>
            </ModalHeader>
            <ModalBody className="text-sm">
              {!isLoading && accountBalance && stakedBalance?.eq(BN_ZERO) && (
                <p>
                  Put your {tokenSymbol} to work directing he network with The
                  Kus Delegate!
                </p>
              )}
              <FormDelegate />
              <p className="my-2 text-center text-xs">
                The Kus Delegate is directed by verified humans from The
                Kusamarian community <br />
                <a
                  className="underline"
                  href="https://discord.gg/eauz25UP"
                  target="_blank"
                >
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
