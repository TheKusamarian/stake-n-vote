"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@nextui-org/dropdown";
import Identicon from "@polkadot/react-identicon";
import { Button } from "@nextui-org/button";

import { Key, useEffect, useState } from "react";
import UseCases from "@w3f/polkadot-icons/keyline/UseCases";
import Users from "@w3f/polkadot-icons/keyline/Users";
import { encodeAddress } from "@polkadot/keyring";
import ConnectWallet from "@w3f/polkadot-icons/keyline/ConnectWallet";
import Copy from "@w3f/polkadot-icons/keyline/Copy";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { usePolkadotExtension } from "@/app/providers/extension-provider";
import { useChain } from "@/app/providers/chain-provider";
import { trimAddress } from "@/app/util";

export const WalletConnect = () => {
  const {
    isExtensionAvailable,
    accounts,
    selectedAccount,
    initiateConnection,
    userWantsConnection,
    setSelectedAccountIndex,
    disconnect,
  } = usePolkadotExtension();

  const { chainConfig } = useChain();

  const { ss58Format } = chainConfig;
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (key: Key) => {
    if (["profile"].includes(key as string)) {
      router.push(`/${key}`);
      return;
    }
    const accountIdx = accounts?.findIndex(
      (account) => account.address === key
    );

    if (accountIdx >= 0) {
      setSelectedAccountIndex(accountIdx);
    }
  };

  if (!userWantsConnection) {
    return (
      <div className="max-w-xs">
        <Button
          onClick={initiateConnection}
          variant="bordered"
          size="lg"
          className="border-3 border-white text-xl"
        >
          Connect <ConnectWallet stroke="white" width={25} height={25} />
        </Button>
      </div>
    );
  }

  if (!isExtensionAvailable)
    return (
      <Button
        variant="bordered"
        size="lg"
        isIconOnly={true}
        className="border-white"
      >
        <ConnectWallet stroke="currentColor" width={20} height={20} />
      </Button>
    );

  if (accounts.length === 0) return <p>No account found</p>;

  return (
    <div className="max-w-xs">
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
              {selectedAccount?.meta?.name ||
                trimAddress(selectedAccount?.address)}
            </span>
            <Identicon
              value={selectedAccount?.address}
              size={45}
              theme="polkadot"
              className="hover:cursor-pointer"
              // prefix={ss58Prefix}
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="bordered"
          aria-label="Account Select"
          onAction={handleChange}
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
            {accounts?.map((account) => (
              <DropdownItem
                key={account.address}
                value={account.address}
                description={trimAddress(
                  encodeAddress(account.address, ss58Format)
                )}
                startContent={
                  <Identicon
                    value={account.address}
                    size={40}
                    theme="polkadot"
                    className="hover:cursor-pointer"
                  />
                }
                aria-label={account.address}
                className="hover:bg-default-100"
              >
                <span className="truncate text-xs">
                  {account.meta?.name || trimAddress(account.address)}
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
              onClick={disconnect}
              className="hover:bg-default-100"
            >
              Logout
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
