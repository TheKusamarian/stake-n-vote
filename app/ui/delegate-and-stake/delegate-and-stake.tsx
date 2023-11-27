"use client";

import { useState } from "react";
import { ChainSwitch } from "./chain-switch";
import { DelegateStakeButtons } from "./buttons";

export function DelegateAndStake() {
  return (
    <div className="max-w-xl">
      <ChainSwitch />
      <DelegateStakeButtons />
    </div>
  );
}
