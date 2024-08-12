"use client"

import { UseInkathonProvider } from "@scio-labs/use-inkathon"
import { QueryClient, QueryClientProvider } from "react-query"
import { ParallaxProvider } from "react-scroll-parallax"

import { polkadotRelay } from "@/config/chains"
import { supportedWallets } from "@/config/wallets"

import ErrorBoundary from "../components/error-boundary"
import { AppProvider } from "./app-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1000 * 60 * 60 * 12, // 12 hours
      },
    },
  })

  return (
    <ErrorBoundary>
      <UseInkathonProvider
        appName="The Kus"
        defaultChain={polkadotRelay}
        supportedWallets={supportedWallets}
      >
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <ParallaxProvider>{children}</ParallaxProvider>
          </AppProvider>
        </QueryClientProvider>
      </UseInkathonProvider>
    </ErrorBoundary>
  )
}
