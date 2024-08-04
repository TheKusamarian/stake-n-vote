import { BN, formatBalance, BN_ZERO, bnToBn } from "@polkadot/util"

export const trimAddress = (
  address: string | undefined,
  amount: number = 5
) => {
  if (!address) {
    return ""
  }
  return `${address.slice(0, amount)}...${address.slice(-amount)}`
}

export function parseBN(bnValue: BN | string, decimals: number): number {
  // Convert the BN value to a string
  const bnStr = bnValue.toString()

  // Determine where to place the decimal point
  let decimalPointIndex = bnStr.length - decimals

  // Initialize formatted value
  let formattedValue

  // Handle cases where the BN value is smaller than the expected decimal places
  if (decimalPointIndex <= 0) {
    formattedValue = "0." + "0".repeat(Math.abs(decimalPointIndex)) + bnStr
  } else {
    // Insert the decimal point
    formattedValue =
      bnStr.substring(0, decimalPointIndex) +
      "." +
      bnStr.substring(decimalPointIndex)
  }

  // Return the result, parsed as a float and fixed to 2 decimal places
  return parseFloat(formattedValue)
}

export const humanReadableBalance = (
  balance: BN | string | undefined,
  decimals: number | undefined = 12,
  withUnit: string | boolean | undefined = true
): string => {
  return formatBalance(balance, {
    decimals,
    forceUnit: "-",
    withSi: true,
    withAll: false,
    withUnit,
  })
}

export function safeToBn(value: number | string | BN): BN {
  try {
    return bnToBn(value);
  } catch (error) {
    console.error("Conversion to BN failed", error);
    return BN_ZERO;
  }
}

export function findChangedItem<T>(arr1: T[], arr2: T[]): T {
  // Find items in set1 that are not in arr2
  const uniqueToArr1 = Array.from(arr1).filter((item) => !arr2.includes(item))

  // Find items in arr2 that are not in arr1
  const uniqueToArr2 = Array.from(arr2).filter((item) => !arr1.includes(item))

  // Combine the unique items from both sets
  return uniqueToArr1.concat(uniqueToArr2)[0]
}
