import { clsx } from "clsx";
import { Button, ButtonGroup } from "@nextui-org/button";

import { useDisclosure } from "@nextui-org/modal";
import ModalDelegate from "./modal-delegate";
import { useChain } from "@/app/providers/chain-provider";
import ModalStake from "./modal-stake";
import { on } from "events";
import { event } from "nextjs-google-analytics";
import { useInkathon } from "@scio-labs/use-inkathon";

export function DelegateStakeButtons() {
  const openExtensionModal = () => {};

  const { isOpen: isStakingOpen, onOpenChange: onStakingOpenChange } =
    useDisclosure();
  const { isOpen: isDelegatingOpen, onOpenChange: onDelegatingOpenChange } =
    useDisclosure();
  const { activeChain, isConnecting, activeAccount } = useInkathon();

  const handleStakingOpen = () => {
    event("staking_open", {
      category: "Modal",
      label: "staking modal opened",
    });
    activeAccount ? onStakingOpenChange() : openExtensionModal();
  };

  const handleDelegatingOpen = () => {
    event("delegating_open", {
      category: "Modal",
      label: "delegating modal opened",
    });
    activeAccount ? onDelegatingOpenChange() : openExtensionModal();
  };

  return (
    <div className="max-w-xl grid gap-4 md:grid-cols-2 items-center justify-center my-10">
      <Button
        variant="bordered"
        className={
          "border-2 border-white text-white w-full  shadow-xl text-base py-6 rounded-xl"
        }
        size="sm"
        onClick={handleStakingOpen}
        isLoading={isConnecting}
      >
        {/* @ts-ignore */}
        Stake {activeChain?.tokenSymbol}
      </Button>
      <Button
        variant="bordered"
        className="border-2 border-white text-white w-full shadow-xl text-base py-6 rounded-xl"
        size="sm"
        onClick={handleDelegatingOpen}
        isLoading={isConnecting}
      >
        {/* @ts-ignore */}
        Delegate {activeChain?.tokenSymbol} Votes
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
