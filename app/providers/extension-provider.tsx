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
import { Wallet, WalletAccount, getWallets } from "@talismn/connect-wallets";
// import { web3EnablePromise } from "@polkadot/extension-dapp";

import type {
  InjectedAccount,
  InjectedExtension,
  InjectedProviderWithMeta,
  InjectedWindow,
  ProviderList,
  Unsubcall,
  Web3AccountsOptions,
} from "@polkadot/extension-inject/types";
import { get } from "http";

// import { web3EnablePromise } from "@polkadot/extension-dapp";

interface PolkadotContextProps {
  accounts: WalletAccount[];
  isExtensionAvailable: boolean | undefined;
  selectedAccount: WalletAccount | null;
  setSelectedAccountIndex: Dispatch<SetStateAction<number | null>>;
  initiateConnection: () => void;
  disconnect: () => void;
  userWantsConnection: boolean;
  getSigner: () => Promise<Signer | undefined>;
  openExtensionModal: () => void;
  isExtensionCheckInProgress: boolean;
  getExtensions: () => Promise<Wallet[]>;
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
  const [extensions, setExtensions] = useState<Wallet[] | null>(null);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<
    number | null
  >(null);
  const [isExtensionAvailable, setIsExtensionAvailable] = useState<
    boolean | undefined
  >(undefined);
  const [userWantsConnection, setUserWantsConnection] = useState<boolean>(
    () => localStorage.getItem("userWantsConnection") === "true"
  );
  const [lastEnabledExtension, setLastEnabledExtension] = useState<
    string | null
  >(localStorage.getItem("lastEnabledExtension"));
  const [isExtensionCheckInProgress, setIsExtensionCheckInProgress] =
    useState<boolean>(false);

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  useEffect(() => {
    // setSelectedAccountIndex(0);
    // localStorage.setItem("selectedAccountIndex", String(0));
    enableExtension();
  }, [lastEnabledExtension]);

  async function getExtensions(): Promise<Wallet[]> {
    // const { web3Accounts, web3Enable } = await import(
    //   "@polkadot/extension-dapp"
    // );

    if (!userWantsConnection) return [];
    // web3Enable("The Kus");
    // const extensions = await web3EnablePromise;
    // console.log("extensions", extensions);
    // setExtensions(extensions);
    const installedWallets = getWallets().filter((wallet) => wallet.installed);
    // setExtensions(installedWallets);

    return installedWallets || [];
  }

  const enableExtension = async () => {
    // console.log("enableExtension userWantsconnection", userWantsConnection);
    // console.log("enableExtensions extensions", extensions);

    if (!userWantsConnection) return;

    const favoriteWallet = extensions?.[0];

    if (!favoriteWallet) {
      const extensions = await getExtensions();
      if (extensions.length === 0) {
        onOpenChange();
      } else {
        setExtensions(extensions);
      }
    }

    setLastEnabledExtension(favoriteWallet?.extensionName || null);
    localStorage.setItem(
      "lastEnabledExtension",
      favoriteWallet?.extensionName || ""
    );

    const enablePromise = favoriteWallet?.enable("The Kus") as Promise<void>;

    enablePromise &&
      enablePromise
        .then(() => {
          // console.log("favorite wallet enabled", favoriteWallet);
          favoriteWallet?.subscribeAccounts((accounts) => {
            // do anything you want with the accounts provided by the wallet
            // console.log("got accounts", accounts);
            setAccounts(accounts || []);
          });
        })
        .catch((error: any) => {
          console.error("error enabling the wallet, not authorized", error);
        });

    if (extensions && extensions?.length !== 0) {
      // console.log("We try to enable the kus");

      try {
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
    }
  };

  useEffect(() => {
    // console.log("user wants connection now in useEffect", userWantsConnection);
    enableExtension();
  }, [userWantsConnection, extensions]);

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

  const initiateConnection = async () => {
    if (userWantsConnection) {
      await enableExtension();
    } else {
      setUserWantsConnection(true);
      localStorage.setItem("userWantsConnection", "true");
    }
  };

  const disconnect = () => {
    setUserWantsConnection(false);
    localStorage.removeItem("userWantsConnection");
    localStorage.removeItem("lastEnabledExtension");
  };

  const getSigner = async () => {
    if (
      selectedAccountIndex !== null &&
      accounts.length > selectedAccountIndex
    ) {
      const selectedAccount = accounts[selectedAccountIndex];
      return selectedAccount.signer as Signer;
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
