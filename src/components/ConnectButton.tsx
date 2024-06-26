"use client"

import { FC, useEffect, useState } from "react"
import Link from "next/link"
import { WalletIcon } from "@heroicons/react/24/outline"
import { cn } from "@nextui-org/react"
import { InjectedAccount } from "@polkadot/extension-inject/types"
import Identicon from "@polkadot/react-identicon"
import { encodeAddress } from "@polkadot/util-crypto"
import {
  SubstrateWalletPlatform,
  allSubstrateWallets,
  isWalletInstalled,
  useInkathon,
} from "@scio-labs/use-inkathon"
import UseCases from "@w3f/polkadot-icons/keyline/UseCases"
import ls from "localstorage-slim"
import { ArrowUpRight, CheckCircle, ChevronDown } from "lucide-react"

import { supportedWallets } from "@/config/wallets"
import useStakingInfo from "@/hooks/use-staking-info"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useApp } from "@/app/app-provider"

// import {
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownSection,
//   DropdownTrigger,
// } from '@nextui-org/dropdown'
import { parseBN, trimAddress } from "../util"
import StakingInfoBadge from "./stake/stake-info-badge"
import { Badge } from "./ui/badge"
import { Button, buttonVariants } from "./ui/button"

export interface ConnectButtonProps {
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
}

export const ConnectButton: FC<ConnectButtonProps> = ({ size }) => {
  const {
    activeChain,
    connect,
    disconnect,
    isConnecting,
    activeAccount,
    accounts,
    activeExtension,
    setActiveAccount,
  } = useInkathon()

  const {
    isEffectTrue,
    setActiveExtension,
    connectDropdownOpen,
    setConnectDropdownOpen,
  } = useApp()

  const { data: stakingInfo, isLoading, error } = useStakingInfo()

  // Sort installed wallets first
  // Sort installed wallets first
  const [browserWallets] = useState([
    ...allSubstrateWallets.filter(
      (w) =>
        w.platforms.includes(SubstrateWalletPlatform.Browser) &&
        isWalletInstalled(w)
    ),
    ...allSubstrateWallets.filter(
      (w) =>
        w.platforms.includes(SubstrateWalletPlatform.Browser) &&
        !isWalletInstalled(w)
    ),
  ])

  if (!activeAccount) {
    return (
      <DropdownMenu
        open={connectDropdownOpen}
        onOpenChange={(open) => {
          open && ls.set("userWantsConnection", true)
          setConnectDropdownOpen?.(open)
        }}
      >
        <DropdownMenuTrigger
          className={cn(buttonVariants(), { "animate-wiggle": isEffectTrue })}
          // isLoading={isConnecting}
          disabled={isConnecting}
        >
          <Button asChild isLoading={isConnecting}>
            Connect{" "}
            <WalletIcon width={26} className="bg-bottom ml-2 inline-block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          avoidCollisions={false}
          className="min-w-[14rem]"
        >
          <DropdownMenuLabel>Connect Extension</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!activeAccount &&
            browserWallets.map((w) =>
              isWalletInstalled(w) ? (
                <DropdownMenuItem
                  key={w.id}
                  className="cursor-pointer hover:border-white hover:bg-transparent data-[hover=true]:border-white"
                  onClick={() => {
                    setActiveExtension?.(w)
                    connect?.(undefined, w)
                  }}
                >
                  {w.name}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  key={w.id}
                  className="opacity-50 hover:border-white hover:bg-transparent data-[hover=true]:border-white"
                >
                  <Link href={w.urls.website}>
                    <div className="align-center flex justify-start gap-2">
                      <p>{w.name}</p>
                      <ArrowUpRight />
                    </div>
                    <p>Not installed</p>
                  </Link>
                </DropdownMenuItem>
              )
            )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants())}
        // isLoading={isConnecting}
        // isDisabled={isConnecting}
        disabled={isConnecting}
      >
        <Button isLoading={isConnecting} asChild>
          <span className="mr-2 hidden truncate text-sm sm:flex">
            {activeAccount?.name || trimAddress(activeAccount?.address)}
          </span>
          <Identicon
            value={activeAccount?.address}
            size={32}
            theme="polkadot"
            className="hover:cursor-pointer"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        avoidCollisions={false}
        className="min-w-[14rem]"
      >
        <DropdownMenuLabel>Accounts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-auto">
          {(accounts || []).map((account) => (
            <DropdownMenuItem
              key={account.address}
              onClick={() => {
                setActiveAccount?.(account)
              }}
              aria-label={account.address}
              className={cn("border-2 border-transparent", {
                " border-primary-500":
                  activeAccount?.address === account.address,
              })}
            >
              <div className="flex flex-row items-center">
                <Identicon
                  value={account.address}
                  size={30}
                  theme="polkadot"
                  className="mr-2 hover:cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text truncate font-bold">
                    {account?.name ||
                      trimAddress(
                        encodeAddress(account.address, activeChain?.ss58Prefix)
                      )}
                  </span>
                  {account.name && (
                    <span className="text-xs">
                      {trimAddress(
                        encodeAddress(account.address, activeChain?.ss58Prefix)
                      )}
                    </span>
                  )}
                  {/* {activeAccount?.address === account.address && ( */}
                  <StakingInfoBadge
                    className=""
                    withValidator={
                      stakingInfo?.[account.address]?.withValidator
                    }
                    inPool={stakingInfo?.[account.address]?.inPool}
                    isLoading={isLoading}
                    error={error}
                  />
                  {/* )} */}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          key={"logout"}
          aria-label={"logout"}
          onClick={() => {
            disconnect?.()
            setActiveAccount?.(undefined)
            ls.set("userWantsConnection", false)
          }}
          className=""
        >
          <UseCases
            width={20}
            height={20}
            stroke="currentColor"
            className="ml-1 mr-3"
          />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface AccountNameProps {
  account: InjectedAccount
}

export const AccountName: FC<AccountNameProps> = ({ account, ...rest }) => {
  return <div>{account.name}</div>
}
