"use client";

export function ChainButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white text-black rounded-full px-4 py-2"
    >
      connect
    </button>
  );
}
