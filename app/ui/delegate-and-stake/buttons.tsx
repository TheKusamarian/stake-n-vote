import { clsx } from "clsx";
import { Button, ButtonGroup } from "@nextui-org/button";

import { useDisclosure } from "@nextui-org/modal";
import ModalDelegate from "./modal-delegate";
import { useChain } from "@/app/providers/chain-provider";
import ModalStake from "./modal-stake";
import { on } from "events";
import { event } from "nextjs-google-analytics";
import { usePolkadotExtension } from "@/app/providers/extension-provider";

export function DelegateStakeButtons() {
  const { openExtensionModal, selectedAccount, userWantsConnection } =
    usePolkadotExtension();

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
  const { chainConfig } = useChain();

  const handleStakingOpen = () => {
    event("staking_open", {
      category: "Modal",
      label: "staking modal opened",
    });
    selectedAccount && userWantsConnection
      ? onStakingOpenChange()
      : openExtensionModal();
  };

  const handleDelegatingOpen = () => {
    event("delegating_open", {
      category: "Modal",
      label: "delegating modal opened",
    });
    selectedAccount && userWantsConnection
      ? onDelegatingOpenChange()
      : openExtensionModal();
  };

  return (
    <div className="max-w-xl grid gap-4 md:grid-cols-2 items-center justify-center my-10">
      <Button
        variant="bordered"
        className={"border-3 border-white text-white w-full  shadow-xl"}
        size="lg"
        onClick={handleStakingOpen}
      >
        Stake {chainConfig.tokenSymbol}
      </Button>
      <Button
        variant="bordered"
        className="border-3 border-white text-white w-full shadow-xl"
        size="lg"
        onClick={handleDelegatingOpen}
      >
        Delegate {chainConfig.tokenSymbol} Votes
      </Button>

      {isDelegatingOpen && (
        <ModalDelegate
          isOpen={isDelegatingOpen}
          onOpenChange={onDelegatingOpenChange}
        />
      )}
      {isStakingOpen && (
        <ModalStake
          isOpen={isStakingOpen}
          onOpenChange={onStakingOpenChange}
          onDelegatingOpenChange={onDelegatingOpenChange}
        />
      )}
    </div>
  );
}
