import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Image from "next/image";

import { NextUIProvider } from "@nextui-org/system";
import "@polkadot/api-augment";
import { Providers } from "./providers";
import { WalletConnect } from "./ui/wallet-connect/wallet-connect";
import { inter, pt_mono } from "./fonts";
import { Modal } from "@nextui-org/modal";
import { ModalInstallExtension } from "./ui/modal-install-extension";

export const metadata: Metadata = {
  title: "The Kusamarian Staking and Delegating App",
  description: "Stake your DOT and KSM with The Kusamarian",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${pt_mono.className} `}>
        <Providers>
          <div className="relative flex flex-col h-screen">
            <header className="h-24">
              <nav className="flex max-w-7xl mx-auto h-24 p-4 justify-between">
                <Image
                  src="kusamarian.png"
                  alt="Kusamarian Logo"
                  width={75}
                  height={80}
                />
                <WalletConnect />
              </nav>
            </header>
            <main className="flex max-w-7xl mx-auto h-24 p-4 flex-grow w-full">
              {children}
            </main>
          </div>
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Define default options
              className: "",
              style: {
                background: "#363636",
                color: "#fff",
              },

              // Default options for specific types
              success: {
                duration: 4000,
                iconTheme: {
                  primary: "green",
                  secondary: "white",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
