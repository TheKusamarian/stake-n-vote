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

type ModalPropType = Omit<ModalProps, "children">;

export default function ModalDelegate(props: ModalPropType) {
  const { isOpen, onOpenChange } = props;

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
              Delegate Votes to The Kus Delegate
            </ModalHeader>
            <ModalBody className="text-sm">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                pulvinar risus non risus hendrerit venenatis. Pellentesque sit
                amet hendrerit risus, sed porttitor quam.
              </p>
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
