"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { InjectedAccount } from "@polkadot/extension-inject/types";
import { encodeAddress } from "@polkadot/util-crypto";
import {
  SubstrateWalletPlatform,
  isWalletInstalled,
  useInkathon,
} from "@scio-labs/use-inkathon";
import { ArrowUpRight, CheckCircle, ChevronDown } from "lucide-react";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { trimAddress } from "../util";
import Identicon from "@polkadot/react-identicon";
import UseCases from "@w3f/polkadot-icons/keyline/UseCases";
import { Button } from "@nextui-org/button";
import { cn } from "@nextui-org/system";
import { useApp } from "../providers/app-provider";
import { supportedWallets } from "../lib/wallets";
import ls from "localstorage-slim";

export interface ConnectButtonProps {
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

export const ConnectButton: FC<ConnectButtonProps> = ({ size }) => {
  const {
    activeChain,
    connect,
    disconnect,
    isConnecting,
    activeAccount,
    accounts,
    setActiveAccount,
  } = useInkathon();

  const { isEffectTrue } = useApp();

  // Sort installed wallets first
  const [browserWallets] = useState([
    ...supportedWallets.filter(
      (w) =>
        w.platforms.includes(SubstrateWalletPlatform.Browser) &&
        isWalletInstalled(w)
    ),
    ...supportedWallets.filter(
      (w) =>
        w.platforms.includes(SubstrateWalletPlatform.Browser) &&
        !isWalletInstalled(w)
    ),
  ]);

  useEffect(() => {
    const userWantsConnection = ls.get("userWantsConnection");
    if (userWantsConnection) {
      connect?.();
    }
  }, []);

  // Connect Button
  if (!activeAccount)
    return (
      <Dropdown
        classNames={{
          content:
            "border-3 border-white bg-gradient-to-r from-[#105b5d] to-[#9a1c54]",
        }}
      >
        <DropdownTrigger>
          <Button
            variant="flat"
            size="sm"
            className={cn(
              "p-7 bg-transparent max-w-[300px] border-2 border-white py-6 text-base rounded-xl",
              { "animate-wiggle": isEffectTrue }
            )}
            isLoading={isConnecting}
            isDisabled={isConnecting}
            onClick={() => {
              console.log("clickled");
              ls.set("userWantsConnection", true);
            }}
          >
            {isConnecting ? (
              "connecting"
            ) : (
              <>
                Connect Wallet
                <ChevronDown size={16} />
              </>
            )}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          className="min-w-[14rem]"
          variant="bordered"
          aria-label="WalletSelect"
          classNames={{ base: "w-[250px]" }}
        >
          <DropdownSection>
            {!activeAccount &&
              browserWallets.map((w) =>
                isWalletInstalled(w) ? (
                  <DropdownItem
                    key={w.id}
                    className="cursor-pointer hover:bg-transparent data-[hover=true]:border-white hover:border-white"
                    onClick={() => {
                      connect?.(undefined, w);
                    }}
                  >
                    {w.name}
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    key={w.id}
                    className="opacity-50 hover:bg-transparent data-[hover=true]:border-white hover:border-white"
                  >
                    <Link href={w.urls.website}>
                      <div className="align-center flex justify-start gap-2">
                        <p>{w.name}</p>
                        <ArrowUpRight />
                      </div>
                      <p>Not installed</p>
                    </Link>
                  </DropdownItem>
                )
              )}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    );

  // Account Menu & Disconnect Button
  return (
    <div className="flex select-none flex-wrap items-stretch justify-center gap-4">
      <Dropdown
        classNames={{
          content:
            "border-3 border-white bg-gradient-to-r from-[#105b5d] to-[#9a1c54]",
        }}
      >
        <DropdownTrigger>
          <Button
            variant="flat"
            size="lg"
            className="p-7 bg-transparent max-w-[300px] border-white"
          >
            <span className="truncate text-sm sm:flex hidden">
              {activeAccount.name || trimAddress(activeAccount?.address)}
            </span>
            <Identicon
              value={activeAccount?.address}
              size={45}
              theme="polkadot"
              className="hover:cursor-pointer"
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="bordered"
          aria-label="Account Select"
          classNames={{ base: "w-[250px]" }}
        >
          <DropdownSection
            title="Accounts"
            showDivider
            className="max-h"
            classNames={{
              group: "max-h-72 overflow-y-scroll",
            }}
          >
            {(accounts || []).map((account) => (
              <DropdownItem
                key={account.address}
                description={trimAddress(
                  encodeAddress(account.address, activeChain?.ss58Prefix)
                )}
                startContent={
                  <Identicon
                    value={account.address}
                    size={40}
                    theme="polkadot"
                    className="hover:cursor-pointer"
                  />
                }
                onClick={() => {
                  setActiveAccount?.(account);
                }}
                aria-label={account.address}
                className={cn(
                  "hover:bg-transparent data-[hover=true]:border-white hover:border-white",
                  {
                    "bg-white/10": activeAccount?.address === account.address,
                  }
                )}
              >
                <span className="truncate text-xs">
                  {account?.name ||
                    trimAddress(
                      encodeAddress(account.address, activeChain?.ss58Prefix)
                    )}
                </span>
              </DropdownItem>
            ))}
          </DropdownSection>
          <DropdownSection title="Actions">
            <DropdownItem
              startContent={
                <UseCases width={20} height={20} stroke="currentColor" />
              }
              key={"logout"}
              value={"logout"}
              aria-label={"logout"}
              onClick={() => {
                disconnect?.();
                setActiveAccount?.(undefined);
                ls.set("userWantsConnection", false);
              }}
              className="hover:bg-transparent data-[hover=true]:border-white hover:border-white"
            >
              Logout
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export interface AccountNameProps {
  account: InjectedAccount;
}

export const AccountName: FC<AccountNameProps> = ({ account, ...rest }) => {
  return <div>{account.name}</div>;
};
