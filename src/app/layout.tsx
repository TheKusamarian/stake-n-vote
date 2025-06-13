import { Inter, Lexend } from "next/font/google"
import clsx from "clsx"

import "@/styles/globals.scss"
import { type Metadata } from "next"

import { Providers } from "./providers"
import "@polkadot/api-augment/kusama"
import "@polkadot/api-augment/polkadot"
import { GoogleTagManager } from "@next/third-parties/google"

import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: {
    template: "%s - The Kus",
    default: "The Kus - Independet News Resource for Polkadot",
  },
  description: "Latest news. Staking. Delegating",
}

const inter = Inter({
  subsets: ["latin"],
  // display: "swap",
  display: "optional",
  variable: "--font-inter",
})

const lexend = Lexend({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-lexend",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx(
        "h-full scroll-smooth bg-white antialiased",
        inter.variable,
        lexend.variable
      )}
    >
      <GoogleTagManager gtmId="GTM-T286VVN3" />
      <body className="flex h-full flex-col">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
