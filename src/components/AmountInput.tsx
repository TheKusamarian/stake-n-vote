"use client"

import { useInkathon } from "@scio-labs/use-inkathon"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { cn } from "../lib/utils"
import { AvailableBalance } from "./AvailableBalance"

export function AmountInput({
  children,
  className,
  label,
  onChange,
  value,
  ...rest
}: {
  children?: React.ReactNode
  className?: string
  label: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
}) {
  const { activeChain, activeAccount } = useInkathon()
  // @ts-ignore
  const tokenSymbol = activeChain?.tokenSymbol || "Unit"

  return (
    <div
      className={cn(
        "flex flex-col flex-1 w-full md:flex-row md:items-center",
        className
      )}
    >
      <div className="flex flex-row flex-1 items-center mr-4">
        <div className="flex-1">
          <Label htmlFor="amount" className="font-bold">
            {label}
          </Label>
          <Input
            id="amount"
            type="number"
            min={0}
            step={0.01}
            className="text-black"
            onChange={onChange}
            value={value}
            placeholder="Enter amount"
            {...rest}
          />
          <AvailableBalance
            params={activeAccount?.address}
            className="ml-0.5"
          />
        </div>
        <span className="flex h-10 w-12 items-center px-2 text-sm font-bold">
          {tokenSymbol}
        </span>
      </div>
      {children}
    </div>
  )
}
