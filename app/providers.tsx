"use client";

import ChainProvider from "./providers/chain-provider";
import { SubstrateChain, UseInkathonProvider } from "@scio-labs/use-inkathon";
import { QueryClient, QueryClientProvider } from "react-query";
import { polkadotRelay } from "./lib/chains";
import { AppProvider } from "./providers/app-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <UseInkathonProvider
      appName="The Kus"
      defaultChain={polkadotRelay}
      connectOnInit={true}
    >
      <AppProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AppProvider>
    </UseInkathonProvider>
  );
}
