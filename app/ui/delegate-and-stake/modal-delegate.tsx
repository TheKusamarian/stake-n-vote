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
import useAccountBalances from "@/app/hooks/use-account-balance";
import { useChain } from "@/app/providers/chain-provider";
import { BN_ZERO, formatBalance } from "@polkadot/util";
import { parseBN } from "@/app/util";
import { CHAIN_CONFIG } from "@/app/config";
import { NotConnected } from "./not-connected";
import { useInkathon } from "@scio-labs/use-inkathon";

type ModalPropType = Omit<ModalProps, "children">;

export default function ModalDelegate(props: ModalPropType) {
  const { isOpen, onOpenChange } = props;
  const { data: accountBalance, isLoading } = useAccountBalances();
  const { activeAccount, activeChain } = useInkathon();

  const {
    maxNominators,
    validator: kusValidator,
    tokenSymbol,
    tokenDecimals,
  } = CHAIN_CONFIG[activeChain?.network || "Polkadot"] || {};

  const { freeBalance } = accountBalance || { freeBalance: BN_ZERO };
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
              {activeAccount ? (
                <>
                  Delegate Votes to The Kus {tokenSymbol} Delegate
                  <span className="text-xs text-gray-300">
                    ({humanFreeBalance.toFixed(2)} {tokenSymbol} available)
                  </span>
                </>
              ) : (
                "No account found"
              )}
            </ModalHeader>
            <ModalBody className="text-sm mb-4">
              {!activeAccount ? (
                <NotConnected />
              ) : (
                <>
                  <FormDelegate />
                  <p className="my-2 text-center text-xs">
                    The Kus Delegate is directed by verified humans from The
                    Kusamarian community <br />
                    <a
                      className="underline"
                      href="https://discord.gg/QumzjDyeY4"
                      target="_blank"
                    >
                      Join our Discord
                    </a>{" "}
                    after you delegate!
                  </p>
                </>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
