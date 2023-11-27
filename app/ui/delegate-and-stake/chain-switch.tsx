import Image from "next/image";
import { clsx } from "clsx";
import { useChain } from "@/app/providers/chain-provider";

export function ChainSwitch() {
  const { api, activeChain, setActiveChain } = useChain();
  return (
    <div className="flex gap-4 justify-center">
      <button
        className={clsx(
          "rounded-full hover:outline-2 p-2 border-3 border-transparent p-3",
          {
            "border-white": activeChain === "Kusama",
            "opacity-50": activeChain !== "Kusama",
          }
        )}
        onClick={() => setActiveChain("Kusama")}
      >
        <Image
          src="/kusama.png"
          alt="Kusama Logo"
          width={100}
          height={100}
          className="rounded-full"
        />
      </button>
      <button
        className={clsx(
          "rounded-full hover:outline-2 p-2 border-3 border-transparent p-3",
          {
            "border-white": activeChain === "Polkadot",
            "opacity-50": activeChain !== "Polkadot",
          }
        )}
        onClick={() => setActiveChain("Polkadot")}
      >
        <Image
          src="/polkadot.svg"
          alt="Polkadot Logo"
          width={100}
          height={100}
        />
      </button>
    </div>
  );
}
