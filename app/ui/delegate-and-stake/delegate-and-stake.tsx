"use client";

import { useState } from "react";
import { ChainSwitch } from "./chain-switch";
import { DelegateStakeButtons } from "./buttons";
import { pt_mono } from "@/app/fonts";

export function DelegateAndStake() {
  return (
    <div className="max-w-xl">
      <h2 className={`text-center mb-12 text-xl font-bold`}>
        Get your assets to work with The Kusamarian!
      </h2>
      <ChainSwitch />
      <DelegateStakeButtons />
    </div>
  );
}
