"use client";

import { ChainSwitch } from "./chain-switch";
import { DelegateStakeButtons } from "./buttons";
import { GoogleAnalytics } from "nextjs-google-analytics";

export function DelegateAndStake() {
  return (
    <>
      {" "}
      <GoogleAnalytics trackPageViews />
      <div className="max-w-xl">
        <h2 className={`text-center mb-12 text-xl font-bold`}>
          Get your assets to work with The Kusamarian!
        </h2>
        <ChainSwitch />
        <DelegateStakeButtons />
      </div>
    </>
  );
}
