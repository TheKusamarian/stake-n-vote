import { BN } from "@polkadot/util";

export const trimAddress = (
  address: string | undefined,
  amount: number = 5
) => {
  if (!address) {
    return "";
  }
  return `${address.slice(0, amount)}...${address.slice(-amount)}`;
};

export function parseBN(bnValue: BN | string, decimals: number) {
  // Convert the BN value to a string
  const bnStr = bnValue.toString();

  // Determine where to place the decimal point
  let decimalPointIndex = bnStr.length - decimals;

  // Initialize formatted value
  let formattedValue;

  // Handle cases where the BN value is smaller than the expected decimal places
  if (decimalPointIndex <= 0) {
    formattedValue = "0." + "0".repeat(Math.abs(decimalPointIndex)) + bnStr;
  } else {
    // Insert the decimal point
    formattedValue =
      bnStr.substring(0, decimalPointIndex) +
      "." +
      bnStr.substring(decimalPointIndex);
  }

  // Return the result, parsed as a float and fixed to 2 decimal places
  return parseFloat(formattedValue).toFixed(2);
}

export function findChangedItem<T>(set1: Set<T>, set2: Set<T>) {
  // Find items in set1 that are not in set2
  const uniqueToSet1 = Array.from(set1).filter((item) => !set2.has(item));

  // Find items in set2 that are not in set1
  const uniqueToSet2 = Array.from(set2).filter((item) => !set1.has(item));

  // Combine the unique items from both sets
  return uniqueToSet1.concat(uniqueToSet2)[0];
}
