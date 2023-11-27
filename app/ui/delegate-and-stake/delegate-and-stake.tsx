"use client";

import { useState } from "react";
import { ChainSwitch } from "./chain-switch";
import { DelegateStakeButtons } from "./buttons";

export function DelegateAndStake({ chain }: { chain: string }) {
  const [activeChain, setActiveChain] = useState(chain);

  return (
    <div className="max-w-xl">
      <ChainSwitch />
      <DelegateStakeButtons active={activeChain} />
    </div>
  );
}
