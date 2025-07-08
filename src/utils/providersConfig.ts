import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';
import { QueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from './constants';

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
    default: { http: [API_ENDPOINTS.LOCAL] },
    public: { http: [API_ENDPOINTS.LOCAL] },
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
        ? `${API_ENDPOINTS.ALCHEMY_SEPOLIA}/${process.env.ALCHEMY_API_KEY}`
        : undefined
    ),
    [mainnet.id]: http(
      process.env.ALCHEMY_API_KEY 
        ? `${API_ENDPOINTS.ALCHEMY_MAINNET}/${process.env.ALCHEMY_API_KEY}`
        : undefined
    ),
    [hardhatLocal.id]: http(API_ENDPOINTS.LOCAL), // 添加localhost RPC
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

