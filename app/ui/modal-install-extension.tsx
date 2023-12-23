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
            <ModalBody className="text-sm">
              In order to stake or delegate your DOT or KSM, you need to install
              a compatible wallet and allow access to this site.
              <div></div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
