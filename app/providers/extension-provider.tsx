import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  FC,
  SetStateAction,
  Dispatch,
} from "react";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Signer } from "@polkadot/types/types";

interface PolkadotContextProps {
  accounts: InjectedAccountWithMeta[];
  isExtensionAvailable: boolean;
  selectedAccount: InjectedAccountWithMeta | null;
  setSelectedAccountIndex: Dispatch<SetStateAction<number | null>>;
  initiateConnection: () => void;
  disconnect: () => void;
  userWantsConnection: boolean;
  getSigner: () => Promise<Signer | undefined>;
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
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<
    number | null
  >(null);
  const [isExtensionAvailable, setIsExtensionAvailable] =
    useState<boolean>(false);
  const [userWantsConnection, setUserWantsConnection] = useState<boolean>(
    () => localStorage.getItem("userWantsConnection") === "true"
  );

  useEffect(() => {
    const enableExtension = async () => {
      if (!userWantsConnection) return;

      const { web3Accounts, web3Enable } = await import(
        "@polkadot/extension-dapp"
      );

      try {
        const extensions = await web3Enable(
          appName ||
            process.env.NEXT_PUBLIC_APP_NAME ||
            "Polkadot Multi Chain App"
        );

        if (extensions.length === 0) {
          console.error("No extension found");
          return;
        }

        setIsExtensionAvailable(true);

        const availableAccounts = await web3Accounts();
        setAccounts(availableAccounts);

        const selectedIndex = localStorage.getItem("selectedAccountIndex");
        const chosenIndex =
          !isNaN(Number(selectedIndex)) && Number(selectedIndex) >= 0
            ? Number(selectedIndex)
            : 0;
        setSelectedAccountIndex(chosenIndex);
      } catch (error) {
        console.error("Error enabling the extension:", error);
      }
    };

    enableExtension();
  }, [userWantsConnection]);

  const initiateConnection = () => {
    setUserWantsConnection(true);
    localStorage.setItem("userWantsConnection", "true");
  };

  const disconnect = () => {
    setUserWantsConnection(false);
    localStorage.removeItem("userWantsConnection");
  };

  const getSigner = async () => {
    const { web3FromSource } = await import("@polkadot/extension-dapp");
    if (
      selectedAccountIndex !== null &&
      accounts.length > selectedAccountIndex
    ) {
      const selectedAccount = accounts[selectedAccountIndex];
      try {
        const injector = await web3FromSource(selectedAccount.meta.source);
        return injector.signer;
      } catch (error) {
        console.error("Unable to get the signer", error);
      }
    }
    return undefined;
  };

  const selectedAccount = accounts[selectedAccountIndex ?? 0] || undefined;

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
      }}
    >
      {children}
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
