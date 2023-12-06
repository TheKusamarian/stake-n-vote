import React, {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { CHAIN_CONFIG } from "../config";

export type ChainConfigType = {
  ss58Format: number;
  tokenDecimals: number;
  tokenSymbol: string;
};

interface ChainContextType {
  api: ApiPromise | undefined;
  activeChain: string;
  setActiveChain: (chain: string) => void;
  chainConfig: ChainConfigType;
}

export const ChainContext = createContext<ChainContextType | undefined>(
  undefined
);

interface ChainProviderProps {
  children: ReactNode;
}

const ChainProvider = ({ children }: ChainProviderProps) => {
  const [api, setApi] = useState<ApiPromise | undefined>(undefined);
  const [activeChain, setActiveChain] = useState<string>("Kusama"); // Default to Kusama
  const [chainConfig, setChainConfig] = useState<ChainConfigType>({
    ss58Format: 2,
    tokenDecimals: 12,
    tokenSymbol: "KSM",
  });

  useEffect(() => {
    console.log("activeChain changed", activeChain, chainConfig);
    const initApi = async () => {
      const wsProvider = new WsProvider(
        activeChain === "Polkadot"
          ? "wss://rpc.polkadot.io"
          : "wss://kusama-rpc.polkadot.io"
      );
      const newApi = await ApiPromise.create({ provider: wsProvider });
      setApi(newApi);
    };

    initApi();
    setChainConfig(CHAIN_CONFIG[activeChain]);

    return () => {
      api?.disconnect();
    };
  }, [activeChain]);

  return (
    <ChainContext.Provider
      value={{ api, activeChain, setActiveChain, chainConfig }}
    >
      {children}
    </ChainContext.Provider>
  );
};

export const useChain = (): ChainContextType => {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error("useChain must be used within a ChainProvider");
  }
  return context;
};

export default ChainProvider;
