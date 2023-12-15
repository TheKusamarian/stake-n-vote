import Image from "next/image";
import { clsx } from "clsx";
import { useChain } from "@/app/providers/chain-provider";
import { useQueryClient } from "react-query";

export function ChainSwitch() {
  const { api, activeChain, setActiveChain } = useChain();
  const queryClient = useQueryClient();

  function handleChainChange(chain: "Kusama" | "Polkadot") {
    setActiveChain(chain);
  }

  return (
    <div className="flex gap-4 justify-center">
      <button
        className={clsx(
          "rounded-full hover:outline-2 border-3 border-transparent w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 p-2 md:p-3 hover:rotate-6 hover:scale-105 transition-all",
          {
            "border-white": activeChain === "Kusama",
            "opacity-50": activeChain !== "Kusama",
          }
        )}
        onClick={() => handleChainChange("Kusama")}
      >
        <Image
          src="kusama.png"
          alt="Kusama Logo"
          width={100}
          height={100}
          className="rounded-full"
        />
      </button>
      <button
        className={clsx(
          "rounded-full hover:outline-2 border-3 border-transparent w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 p-2 md:p-3 hover:rotate-6 hover:scale-105 transition-all",
          {
            "border-white": activeChain === "Polkadot",
            "opacity-50": activeChain !== "Polkadot",
          }
        )}
        onClick={() => handleChainChange("Polkadot")}
      >
        <Image
          src="polkadot.svg"
          alt="Polkadot Logo"
          width={100}
          height={100}
          className="-mt-0.5"
        />
      </button>
    </div>
  );
}
