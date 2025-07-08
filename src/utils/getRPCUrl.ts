export function getRpcUrl(network: "mainnet" | "sepolia", provider: "alchemy" | "infura") {
  if (network === "mainnet") {
    return provider === "alchemy"
      ? process.env.NEXT_PUBLIC_ALCHEMY_MAINNET
      : process.env.NEXT_PUBLIC_INFURA_MAINNET;
  } else {
    return provider === "alchemy"
      ? process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA
      : process.env.NEXT_PUBLIC_INFURA_SEPOLIA;
  }
}