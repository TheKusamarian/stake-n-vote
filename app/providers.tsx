"use client";

import { NextUIProvider } from "@nextui-org/system";
import ChainProvider from "./providers/chain-provider";
import { PolkadotExtensionProvider } from "./providers/extension-provider";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "react-query";

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

  const queryClient = new QueryClient();

  return (
    <NextUIProvider>
      <ChainProvider>
        <DynamicPolkadotExtensionProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </DynamicPolkadotExtensionProvider>
      </ChainProvider>
    </NextUIProvider>
  );
}
