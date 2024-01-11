"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  FC,
  SetStateAction,
  Dispatch,
} from "react";
import { Signer } from "@polkadot/types/types";
import { ModalInstallExtension } from "../ui/modal-install-extension";
import { useDisclosure } from "@nextui-org/modal";
import { getWallets } from "@talismn/connect-wallets";
import { web3EnablePromise } from "@polkadot/extension-dapp";

import type {
  InjectedAccount,
  InjectedAccountWithMeta,
  InjectedExtension,
  InjectedProviderWithMeta,
  InjectedWindow,
  ProviderList,
  Unsubcall,
  Web3AccountsOptions,
} from "@polkadot/extension-inject/types";

// import { web3EnablePromise } from "@polkadot/extension-dapp";

interface PolkadotContextProps {
  accounts: InjectedAccountWithMeta[];
  isExtensionAvailable: boolean | undefined;
  selectedAccount: InjectedAccountWithMeta | null;
  setSelectedAccountIndex: Dispatch<SetStateAction<number | null>>;
  initiateConnection: () => void;
  disconnect: () => void;
  userWantsConnection: boolean;
  getSigner: () => Promise<Signer | undefined>;
  openExtensionModal: () => void;
  isExtensionCheckInProgress: boolean;
  getExtensions: () => Promise<InjectedExtension[]>;
}

const PolkadotExtensionContext = createContext<
  PolkadotContextProps | undefined
>(undefined);

export const PolkadotExtensionProvider = ({
  appName,
  children,
}: {
  appName?: string;
  children: React.ReactNode;
}) => {
  const [extensions, setExtensions] = useState<InjectedExtension[] | null>(
    null
  );
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<
    number | null
  >(null);
  const [isExtensionAvailable, setIsExtensionAvailable] = useState<
    boolean | undefined
  >(undefined);
  const [userWantsConnection, setUserWantsConnection] = useState<boolean>(
    () => localStorage.getItem("userWantsConnection") === "true"
  );
  const [isExtensionCheckInProgress, setIsExtensionCheckInProgress] =
    useState<boolean>(false);

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  async function getExtensions() {
    const { web3Accounts, web3Enable } = await import(
      "@polkadot/extension-dapp"
    );

    web3Enable("The Kus");
    const extensions = await web3EnablePromise;
    console.log("extensions", extensions);
    setExtensions(extensions);
    return extensions || [];
  }

  async function areExtensionsAvailable() {
    const extensions = await getExtensions();
    return extensions.length > 0;
  }

  useEffect(() => {
    getExtensions();
  }, []);

  useEffect(() => {
    if (extensions?.length === 0) {
      return;
    }

    const enableExtension = async () => {
      if (!userWantsConnection) return;

      const { web3Accounts } = await import("@polkadot/extension-dapp");

      try {
        const availableAccounts = await web3Accounts();
        setAccounts(availableAccounts);

        const selectedIndex = localStorage.getItem("selectedAccountIndex");

        if (isNaN(Number(selectedIndex)) || Number(selectedIndex) < 0) {
          setSelectedAccountIndex(0);
          localStorage.setItem("selectedAccountIndex", "0");
          return;
        }
        const chosenIndex = Number(selectedIndex);
        setSelectedAccountIndex(chosenIndex);
      } catch (error) {
        console.error("Error enabling the extension:", error);
      }
    };

    enableExtension();
  }, [extensions, userWantsConnection]);

  // useEffect(() => {
  //   const enableExtension = async () => {
  //     if (!userWantsConnection) return;

  //     setIsExtensionCheckInProgress(true);

  //     // const { web3Accounts, web3Enable } = await import(
  //     //   "@polkadot/extension-dapp"
  //     // );

  //     // get an array of wallets which are installed
  //     const installedWallets = getWallets().filter(
  //       (wallet) => wallet.installed
  //     );

  //     // get talisman from the array of installed wallets
  //     const talismanWallet = installedWallets.find(
  //       (wallet) => wallet.extensionName === "talisman"
  //     );

  //     console.log("installedWallets", installedWallets);
  //     console.log("talismanWallet", talismanWallet);

  //     try {
  //       // const extensions = await web3Enable(
  //       //   appName || process.env.NEXT_PUBLIC_APP_NAME || "The Kus"
  //       // );

  //       if (installedWallets.length === 0) {
  //         console.warn("No extension found");
  //         setIsExtensionCheckInProgress(false);
  //         setIsExtensionAvailable(false);
  //         return;
  //       }

  //       const favoriteWallet = installedWallets[0];

  //       await favoriteWallet.enable(
  //         appName || process.env.NEXT_PUBLIC_APP_NAME || "The Kus"
  //       );

  //       setIsExtensionAvailable(true);

  //       const availableAccounts = await favoriteWallet.getAccounts();

  //       console.log("availableAccounts", availableAccounts);
  //       setAccounts(availableAccounts);

  //       const selectedIndex = localStorage.getItem("selectedAccountIndex");

  //       if (isNaN(Number(selectedIndex)) || Number(selectedIndex) < 0) {
  //         setSelectedAccountIndex(0);
  //         localStorage.setItem("selectedAccountIndex", "0");
  //         setIsExtensionCheckInProgress(false);
  //         return;
  //       }
  //       const chosenIndex = Number(selectedIndex);
  //       setSelectedAccountIndex(chosenIndex);
  //     } catch (error) {
  //       setIsExtensionCheckInProgress(false);
  //       console.warn("Error enabling the extension:", error);
  //     }
  //     setIsExtensionCheckInProgress(false);
  //   };

  //   enableExtension();
  // }, [userWantsConnection]);

  const initiateConnection = () => {
    console.log("initiating connection");
    setUserWantsConnection(true);
    localStorage.setItem("userWantsConnection", "true");
  };

  const disconnect = () => {
    setUserWantsConnection(false);
    localStorage.removeItem("userWantsConnection");
  };

  const getSigner = async () => {
    const { web3FromSource } = await import("@talismn/connect-components");
    if (
      selectedAccountIndex !== null &&
      accounts.length > selectedAccountIndex
    ) {
      const selectedAccount = accounts[selectedAccountIndex];
      try {
        const injector = await web3FromSource();
        return injector.signer;
      } catch (error) {
        console.warn("Unable to get the signer", error);
      }
    }
    return undefined;
  };

  const selectedAccount = accounts[selectedAccountIndex ?? 0] || undefined;
  console.log(
    "selectedAccount",
    selectedAccount,
    selectedAccountIndex,
    accounts
  );

  return (
    <PolkadotExtensionContext.Provider
      value={{
        accounts,
        isExtensionAvailable,
        selectedAccount,
        setSelectedAccountIndex: (index) => {
          console.log("setting accountIndex to local storage", String(index));
          setSelectedAccountIndex(index);
          localStorage.setItem("selectedAccountIndex", String(index));
        },
        initiateConnection,
        userWantsConnection,
        disconnect,
        getSigner,
        openExtensionModal: onOpenChange,
        isExtensionCheckInProgress,
        getExtensions,
      }}
    >
      {children}
      <ModalInstallExtension isOpen={isOpen} onOpenChange={onOpenChange} />
    </PolkadotExtensionContext.Provider>
  );
};

export const usePolkadotExtension = (): PolkadotContextProps => {
  const context = useContext(PolkadotExtensionContext);
  if (context === undefined) {
    throw new Error("usePolkadot must be used within a PolkadotProvider");
  }
  return context;
};
