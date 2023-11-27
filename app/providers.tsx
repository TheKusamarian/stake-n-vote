"use client";

import { NextUIProvider } from "@nextui-org/system";
import ChainProvider from "./providers/chain-provider";
import { PolkadotExtensionProvider } from "./providers/extension-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ChainProvider>
        <PolkadotExtensionProvider>{children}</PolkadotExtensionProvider>
      </ChainProvider>
    </NextUIProvider>
  );
}
