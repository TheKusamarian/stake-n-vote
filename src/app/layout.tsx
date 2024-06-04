import { Inter, Lexend } from "next/font/google"
import clsx from "clsx"

import "@/styles/globals.scss"
import { type Metadata } from "next"
import Script from "next/script"

import { Providers } from "./providers"
import "@polkadot/api-augment"

export const metadata: Metadata = {
  title: {
    template: "%s - The Kusamarian",
    default: "The Kusamarian - Independet News Resource for Polkadot",
  },
  description: "Latest news. Staking. Delegating",
}

const inter = Inter({
  subsets: ["latin"],
  // display: "swap",
  variable: "--font-inter",
})

const lexend = Lexend({
  subsets: ["latin"],
  // display: "swap",
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
      <body className="flex h-full flex-col">
        <Providers>{children}</Providers>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-7RG8GF0LMC" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-7RG8GF0LMC');
        `}
        </Script>
      </body>
    </html>
  )
}
