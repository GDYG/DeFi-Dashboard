import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';
import { QueryClient } from '@tanstack/react-query';

const hardhatLocal = defineChain({
  id: Number(process.env.HARDHAT_CHAIN_ID) || 31337,
  name: 'Hardhat Local',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
})

// Create wagmi config using the new v2 API
const wagmiConfig = getDefaultConfig({
  appName: 'DeFi-Dashboard',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [sepolia, mainnet, hardhatLocal],
  transports: {
    [sepolia.id]: http(
      process.env.ALCHEMY_API_KEY 
        ? `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
        : undefined
    ),
    [mainnet.id]: http(
      process.env.ALCHEMY_API_KEY 
        ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
        : undefined
    ),
    [hardhatLocal.id]: http('http://127.0.0.1:8545'), // 添加localhost RPC
  },
  ssr: true,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (renamed from cacheTime)
    },
  },
})

export { 
  hardhatLocal,
  wagmiConfig,
  queryClient,
}

