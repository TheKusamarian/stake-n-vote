"use client";

import { ChainSwitch } from "./chain-switch";
import { DelegateStakeButtons } from "./buttons";

export function DelegateAndStake() {
  return (
    <>
      {" "}
      <div className="max-w-xl mt-[10vh] mb-[10vh]">
        <h2 className={`text-center mb-12 text-xl font-bold`}>
          Get your assets to work with The Kusamarian!
        </h2>
        <ChainSwitch />
        <DelegateStakeButtons />
      </div>
    </>
  );
}
