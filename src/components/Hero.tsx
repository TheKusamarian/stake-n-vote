"use client"

import Image from "next/image"
import Link from "next/link"
import { useInkathon } from "@scio-labs/use-inkathon"
import Stake from "@w3f/polkadot-icons/keyline/Stake"
import Delegate from "@w3f/polkadot-icons/keyline/Vote"
import { useParallax } from "react-scroll-parallax"

import { useApp } from "@/app/app-provider"

import { ChainSwitch } from "./ChainSwitch"
import { LatestYtVideo } from "./latest-yt-video"
import { Button } from "./ui/button"

export function Hero() {
  const { ref } = useParallax({
    speed: -10,
  })

  const { activeChain } = useInkathon()
  const { setIsStakingModalOpen, setIsDelegateModalOpen } = useApp()

  return (
    <div className="relative isolate flex flex-col overflow-hidden bg-white lg:flex-row">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-primary-500 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
        />
      </svg>
      <div className="max-w-8xl container mx-auto px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-32">
        <div className="w-full flex-none lg:w-2/5">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            The Kusamarian
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Your #1 news resource on Polkadot. Daily news, insights, and
            interviews with the top minds in the Polkadot ecosystem.
          </p>
          <h2 className="font-bold text-xl mt-16 text-center">
            Get your assets to work with The Kusamarian!
          </h2>
          <p className="mt-6 w-full text-center text-sm font-bold tracking-tight text-gray-600">
            ↓ Select Network ↓
          </p>
          <ChainSwitch className="mt-4" />
          <p className="mt-4 w-full text-center text-sm font-bold tracking-tight text-gray-600">
            ↓ Stake + Delegate ↓
          </p>
          <div className="mt-4 flex items-center gap-x-6">
            <div className="h-48 w-1/2 group">
              <Button
                className="h-auto w-full p-4 flex flex-col"
                onClick={() => setIsStakingModalOpen(true)}
              >
                <div className="flex items-center justify-center">
                  <Stake
                    stroke="#fff"
                    className="mr-2 inline-block"
                    width={25}
                  />{" "}
                  {/* @ts-ignore */}
                  Stake {activeChain?.tokenSymbol}
                </div>
                <p className="whitespace-normal font-normal text-sm mt-2 hidden group-hover:block transition-all">
                  Stake your assets, earn rewards and secure the Polkadot
                  network
                </p>
              </Button>
            </div>
            <div className="h-48 w-1/2 group">
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
        </div>
        {/* @ts-ignore */}
        <div className="mt-16 flex-auto lg:ml-16 lg:mt-" ref={ref}>
          <div className="w-full flex-none sm:max-w-5xl">
            <div className="group relative mt-4 overflow-hidden rounded-xl p-2 lg:mt-0 lg:p-4">
              <div className="absolute -left-1/2 -top-1/2 h-[200%] w-[200%] origin-center rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 group-hover:animate-spin_right"></div>
              <LatestYtVideo />
            </div>
            <div className="mt-8 w-full text-center text-sm font-semibold">
              <div>
                The latest on Polkadot <span aria-hidden="true">↑</span>
              </div>
              <Button className="mt-4 bg-white" variant="outline">
                <Link href="#videos">
                  👀 View even more <span aria-hidden="true"> ↓</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
