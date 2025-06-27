// API 端点配置
export const API_ENDPOINTS = {
  COINGECKO: 'https://api.coingecko.com/api/v3/',
  ETHERSCAN: process.env.ETHERSCAN_NETWORK || 'https://api-sepolia.etherscan.io/api',
  ALCHEMY: 'https://eth-mainnet.g.alchemy.com/v2',
  INFURA: 'https://mainnet.infura.io/v3'
} as const
