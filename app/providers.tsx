"use client";

import ChainProvider from "./providers/chain-provider";
import { SubstrateChain, UseInkathonProvider } from "@scio-labs/use-inkathon";
import { QueryClient, QueryClientProvider } from "react-query";
import { polkadotRelay } from "./lib/chains";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <ChainProvider>
      <UseInkathonProvider
        appName="The Kus"
        defaultChain={polkadotRelay}
        // connectOnInit={false}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </UseInkathonProvider>
    </ChainProvider>
  );
}
