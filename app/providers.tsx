"use client";

import ChainProvider from "./providers/chain-provider";
import { SubstrateChain, UseInkathonProvider } from "@scio-labs/use-inkathon";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  PersistQueryClientProvider,
  Persister,
} from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { polkadotRelay } from "./lib/chains";
import { AppProvider } from "./providers/app-provider";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1000 * 60 * 60 * 12, // 12 hours
      },
    },
  });

  const [persister, setPersister] = useState<Persister | null>(null);

  useEffect(() => {
    const persister = createSyncStoragePersister({
      storage: window.localStorage,
    });
    setPersister(persister);
  }, []);

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
