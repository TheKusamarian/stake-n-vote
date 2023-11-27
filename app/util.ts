export const trimAddress = (
  address: string | undefined,
  amount: number = 5
) => {
  if (!address) {
    return "";
  }
  return `${address.slice(0, amount)}...${address.slice(-amount)}`;
};
