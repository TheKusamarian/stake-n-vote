"use client";

import { NextUIProvider } from "@nextui-org/system";
import ChainProvider from "./providers/chain-provider";
import { PolkadotExtensionProvider } from "./providers/extension-provider";
import dynamic from "next/dynamic";

export function Providers({ children }: { children: React.ReactNode }) {
  const DynamicPolkadotExtensionProvider = dynamic(
    () =>
      import("@/app/providers/extension-provider").then(
        (mod) => mod.PolkadotExtensionProvider
      ),
    {
      ssr: false,
    }
  );

  return (
    <NextUIProvider>
      <ChainProvider>
        <DynamicPolkadotExtensionProvider>
          {children}
        </DynamicPolkadotExtensionProvider>
      </ChainProvider>
    </NextUIProvider>
  );
}
