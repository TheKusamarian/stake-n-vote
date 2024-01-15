"use client";

import { usePolkadotExtension } from "../providers/extension-provider";

export function ChainButton({ onClick }: { onClick: () => void }) {
  const { isExtensionAvailable } = usePolkadotExtension();
  return (
    <button
      onClick={onClick}
      className="bg-white text-black rounded-full px-4 py-2"
    >
      connect
    </button>
  );
}
