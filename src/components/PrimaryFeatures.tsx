"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Tab } from "@headlessui/react"
import { useInkathon } from "@scio-labs/use-inkathon"
import Customize from "@w3f/polkadot-icons/keyline/Settings"
import Stake from "@w3f/polkadot-icons/keyline/Stake"
import Delegate from "@w3f/polkadot-icons/keyline/Vote"
import clsx from "clsx"

import { Container } from "@/components/Container"
import { useApp } from "@/app/app-provider"

import { ChainSwitch } from "./ChainSwitch"
import DelegateComponent from "./delegate/delegate"
import StakeComponent from "./stake/stake"
import { Button } from "./ui/button"

const features = [
  {
    title: "Stake",
    description:
      "Stake your assets, earn rewards and secure the Polkadot network. It's that simple.",
    image: <Stake stroke="#fff" className="mr-2 inline-block" width={20} />,
  },
  {
    title: "Delegate",
    description:
      "Your Votes matter. Delegate your voting power to us and shape the future of Polkadot.",
    image: <Delegate stroke="#fff" className="mr-2 inline-block" width={20} />,
  },
  {
    title: "Manage",
    description:
      "Control your stake with our easy-to-use interface. Rewards destination, voting preferences, and more.",
    image: <Customize stroke="#fff" className="mr-2 inline-block" width={20} />,
  },
]

export function PrimaryFeatures() {
  const { activeChain } = useInkathon()
  const searchParams = useSearchParams()
  const { setIsStakingModalOpen, setIsDelegateModalOpen } = useApp()
  const router = useRouter()
  let [tabOrientation, setTabOrientation] = useState<"horizontal" | "vertical">(
    "horizontal"
  )

  useEffect(() => {
    let lgMediaQuery = window.matchMedia("(min-width: 1024px)")

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? "vertical" : "horizontal")
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener("change", onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange)
    }
  }, [])

  const selectedFeature =
    searchParams.get("feature") || features[0].title.toLowerCase()

  let selectedIndex = features.findIndex(
    (feature) => feature.title.toLowerCase() === selectedFeature
  )

  if (selectedIndex === -1) {
    selectedIndex = 0
  }

  // useEffect(() => {
  //   router.push(
  //     `#features?feature=${features[selectedIndex].title.toLowerCase()}`,
  //     {
  //       scroll: false,
  //     },
  //   )
  // }, [selectedIndex, router, selectedFeature])

  return (
    <section
      id="stake-and-delegate"
      aria-label="Staking and Delegating"
      className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-teal-500 pb-28 pt-20 sm:py-32"
    >
      <Container className="b relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            Get your assets to work with The Kusamarian!
          </h2>
          <p className="mt-12 w-full text-center text-sm tracking-tight text-white">
            ↓ Select Network ↓
          </p>
        </div>
        <ChainSwitch
          className="mt-12"
          buttonClasses="h-20 w-20 rounded-full border-2 p-2 transition-all hover:rotate-6 hover:scale-105 hover:outline-2 sm:h-20 sm:w-20 md:h-32 md:w-32 md:p-3"
        />
        <p className="mt-12 w-full text-center text-sm tracking-tight text-white">
          ↓ Stake + Delegate ↓
        </p>
        <div className="mt-12 flex items-center gap-x-6 justify-center">
          <div className="h-48 w-1/2 md:w-1/3 group">
            <Button
              className="h-auto w-full p-4 flex flex-col"
              onClick={() => setIsStakingModalOpen(true)}
            >
              <div className="flex items-center justify-center">
                <Stake stroke="#fff" className="mr-2 inline-block" width={25} />{" "}
                {/* @ts-ignore */}
                Stake {activeChain?.tokenSymbol}
              </div>
              <p className="whitespace-normal font-normal text-sm mt-2 hidden group-hover:block transition-all">
                Stake your assets, earn rewards and secure the Polkadot network
              </p>
            </Button>
          </div>
          <div className="h-48 w-1/2 md:w-1/3 group">
            <Button
              className="h-auto w-full p-4 flex flex-col"
              onClick={() => setIsDelegateModalOpen(true)}
            >
              <div className="flex items-center justify-center">
                <Delegate
                  stroke="#fff"
                  className="mr-2 inline-bloc k"
                  width={25}
                />{" "}
                {/* @ts-ignore */}
                Delegate {activeChain?.tokenSymbol}
              </div>
              <p className="whitespace-normal font-normal text-sm mt-2 hidden group-hover:block">
                Your Votes matter. Delegate your voting power to us and shape
                Polkadot&apos;s future
              </p>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
