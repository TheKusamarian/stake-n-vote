"use client"

import { useInkathon } from "@scio-labs/use-inkathon"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { cn } from "../lib/utils"
import AvailableBalance from "./AvailableBalance"
import { StakedBalance } from "./StakedBalance"

import { safeToBn } from "@/util"

const MAX_ALLOWED_AMOUNT = 999999999

export function AmountInput({
  children,
  className,
  label,
  onChange,
  value,
  info = "available",
  max = MAX_ALLOWED_AMOUNT,
  ...rest
}: {
  children?: React.ReactNode
  className?: string
  label: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  info?: "available" | "staked"
  max?: number
}) {
  const { activeChain, activeAccount } = useInkathon()
  // @ts-ignore
  const tokenSymbol = activeChain?.tokenSymbol || "Unit"

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (parseFloat(e.target.value) >= MAX_ALLOWED_AMOUNT) {
      e.target.value = MAX_ALLOWED_AMOUNT.toString();
      onChange(e);
      return
    }

    const inputValueBN = safeToBn(inputValue);
    e.target.value = inputValueBN.toString();
    onChange(e);
  }

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
            onChange={handleInputChange}
            value={value}
            placeholder="Enter amount"
            {...rest}
          />
          {info === "available" && (
            <AvailableBalance
              key={"available-balance"}
              params={activeAccount?.address}
              className="ml-0.5"
            />
          )}
          {info === "staked" && (
            <StakedBalance
              key={"staked-balance"}
              params={activeAccount?.address}
              className="ml-0.5"
            />
          )}
        </div>
        <span className="flex h-10 w-12 items-center px-2 text-sm font-bold">
          {tokenSymbol}
        </span>
      </div>
      {children}
    </div>
  )
}
