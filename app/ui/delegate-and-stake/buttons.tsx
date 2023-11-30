import { clsx } from "clsx";
import { Button, ButtonGroup } from "@nextui-org/button";

import { useDisclosure } from "@nextui-org/modal";
import ModalDelegate from "./modal-delegate";
import { useChain } from "@/app/providers/chain-provider";
import ModalStake from "./modal-stake";
import { on } from "events";

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

  const { activeChain, chainConfig } = useChain();
  return (
    <div className="max-w-xl grid gap-4 md:grid-cols-2 items-center justify-center my-10">
      <Button
        variant="bordered"
        className={
          "text-foreground-50 border-3 border-white text-white w-full  "
        }
        size="lg"
        onClick={onStakingOpenChange}
      >
        Stake {chainConfig.tokenSymbol}
      </Button>
      <Button
        variant="bordered"
        className="text-foreground-50 border-3 border-white text-white w-full "
        size="lg"
        onClick={onDelegatingOpenChange}
      >
        Delegate {chainConfig.tokenSymbol} Votes
      </Button>

      <ModalDelegate
        isOpen={isDelegatingOpen}
        onOpenChange={onDelegatingOpenChange}
      />
      <ModalStake isOpen={isStakingOpen} onOpenChange={onStakingOpenChange} />
    </div>
  );
}
