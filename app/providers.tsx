"use client";

import { SubstrateChain, UseInkathonProvider } from "@scio-labs/use-inkathon";
import { QueryClient, QueryClientProvider } from "react-query";
import { polkadotRelay } from "./lib/chains";
import { AppProvider } from "./providers/app-provider";
import { useEffect, useState } from "react";
import { supportedWallets } from "./lib/wallets";

export function Providers({ children }: { children: React.ReactNode }) {
  const [userWantsToConnect, setUserWantsToConnect] = useState(false);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1000 * 60 * 60 * 12, // 12 hours
      },
    },
  });

  return (
    <UseInkathonProvider
      appName="The Kus"
      defaultChain={polkadotRelay}
      supportedWallets={supportedWallets}
    >
      <AppProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AppProvider>
    </UseInkathonProvider>
  );
}
