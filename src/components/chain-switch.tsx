"use client"

import Image from "next/image"
import kusamaLogo from "@/images/kusama.png"
import polkadotLogo from "@/images/polkadot.svg"
import { SubstrateChain, useInkathon } from "@scio-labs/use-inkathon"
import { clsx } from "clsx"

import { kusamaRelay, polkadotRelay } from "@/config/chains"

export function ChainSwitch({
  className,
  buttonClasses,
}: {
  className?: string
  buttonClasses?: string
}) {
  const { activeChain, switchActiveChain } = useInkathon()

  function handleChainChange(chain: SubstrateChain) {
    switchActiveChain?.(chain || polkadotRelay)
  }

  return (
    <div className={clsx("flex justify-center gap-4", className)}>
      <button
        className={clsx(
          "h-20 w-20 rounded-full border-2 p-2 transition-all hover:rotate-6 hover:scale-105 hover:outline-2 sm:h-20 sm:w-20 md:h-24 md:w-24 md:p-2.5",
          {
            "border-white": activeChain?.network === "Polkadot",
            "opacity-50 border-transparent":
              activeChain?.network !== "Polkadot",
          },
          buttonClasses
        )}
        onClick={() => handleChainChange(polkadotRelay)}
      >
        <Image
          src={polkadotLogo}
          alt="Polkadot Logo"
          width={180}
          height={180}
          className="-mt-0.5"
        />
      </button>
      <button
        className={clsx(
          "h-20 w-20 rounded-full border-2 p-2 transition-all hover:rotate-6 hover:scale-105 hover:outline-2 sm:h-20 sm:w-20 md:h-24 md:w-24 md:p-2.5",
          {
            "border-white": activeChain?.network === "Kusama",
            "opacity-50 border-transparent": activeChain?.network !== "Kusama",
          },
          buttonClasses
        )}
        onClick={() => handleChainChange(kusamaRelay)}
      >
        <Image
          src={kusamaLogo}
          alt="Kusama Logo"
          width={180}
          height={180}
          className="rounded-full"
        />
      </button>
    </div>
  )
}
