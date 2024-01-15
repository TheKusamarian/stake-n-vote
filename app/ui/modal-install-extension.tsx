import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
} from "@nextui-org/modal";
type ModalPropType = Omit<ModalProps, "children">;

export function ModalInstallExtension(props: ModalPropType) {
  const { isOpen, onOpenChange } = props;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      scrollBehavior="inside"
      backdrop="blur"
      className="bg-gradient-to-r from-[#105b5d] to-[#9a1c54]"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Install a compatible wallet
            </ModalHeader>
            <ModalBody className="text-sm mb-4">
              <p>
                Please click Connect in the top right corner or download the
              </p>
              <p>
                <a
                  className="underline"
                  href="https://www.talisman.xyz/download"
                  target="_blank"
                >
                  Talisman Browser Extension
                </a>{" "}
                (Desktop) or <br />
                <a
                  className="underline"
                  href="https://novawallet.io/"
                  target="_blank"
                >
                  {" "}
                  Nova Wallet
                </a>{" "}
                (Mobile)
              </p>
              <p>allow this site access, and then connect!</p>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
