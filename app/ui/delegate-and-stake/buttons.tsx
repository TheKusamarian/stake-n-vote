import { clsx } from "clsx";
import { Button, ButtonGroup } from "@nextui-org/button";

import { useDisclosure } from "@nextui-org/modal";
import ModalDelegate from "./modal-delegate";
import { useChain } from "@/app/providers/chain-provider";

export function DelegateStakeButtons() {
  const {
    isOpen: isStakingOpen,
    onOpen: onStakingOpen,
    onOpenChange: onStakingOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDelegatingOpen,
    onOpen: onDelegatingOpen,
    onOpenChange: onDelegatingOpenChange,
  } = useDisclosure();

  const { activeChain } = useChain();
  return (
    <div className="max-w-xl flex gap-4 items-center justify-center my-10">
      <Button
        variant="bordered"
        className={"text-foreground-50 border-3 border-white text-white"}
        size="lg"
      >
        Stake on {activeChain}
      </Button>
      <Button
        variant="bordered"
        className="text-foreground-50 border-3 border-white text-white"
        size="lg"
        onClick={onDelegatingOpenChange}
      >
        Delegate Votes on {activeChain}
      </Button>

      <ModalDelegate
        isOpen={isDelegatingOpen}
        onOpenChange={onDelegatingOpenChange}
      />
    </div>
  );
}
