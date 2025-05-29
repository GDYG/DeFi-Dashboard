// 网络配置
export const NETWORKS = {
  MAINNET: {
    id: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io',
  },
  SEPOLIA: {
    id: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
} as const

// API 端点配置
export const API_ENDPOINTS = {
  COINGECKO: 'https://api.coingecko.com/api/v3',
  ETHERSCAN: 'https://api.etherscan.io/api',
  ALCHEMY: 'https://eth-mainnet.g.alchemy.com/v2',
  INFURA: 'https://mainnet.infura.io/v3'
} as const

// 支持的网络配置
export const SUPPORTED_CHAINS = {
  ETHEREUM: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: `${API_ENDPOINTS.ALCHEMY}/${process.env.ALCHEMY_API_KEY}`,
    blockExplorer: 'https://etherscan.io'
  },
  SEPOLIA: {
    id: 11155111,
    name: 'Sepolia',
    symbol: 'ETH',
    rpcUrl: `${API_ENDPOINTS.ALCHEMY}/${process.env.ALCHEMY_API_KEY}`,
    blockExplorer: 'https://sepolia.etherscan.io'
  }
} as const

// 主要代币合约地址 (Ethereum Mainnet)
export const TOKEN_CONTRACTS = {
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
} as const

// CoinGecko 代币ID映射
export const COINGECKO_TOKEN_IDS = {
  [TOKEN_CONTRACTS.USDC]: 'usd-coin',
  [TOKEN_CONTRACTS.USDT]: 'tether',
  [TOKEN_CONTRACTS.UNI]: 'uniswap',
  [TOKEN_CONTRACTS.LINK]: 'chainlink',
  [TOKEN_CONTRACTS.WETH]: 'weth',
  [TOKEN_CONTRACTS.DAI]: 'dai',
  [TOKEN_CONTRACTS.WBTC]: 'wrapped-bitcoin'
} as const

// 代币信息配置
export const TOKEN_INFO = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    icon: 'Ξ',
    coingeckoId: 'ethereum'
  },
  [TOKEN_CONTRACTS.USDC]: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    icon: '$',
    coingeckoId: 'usd-coin'
  },
  [TOKEN_CONTRACTS.USDT]: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    icon: '₮',
    coingeckoId: 'tether'
  },
  [TOKEN_CONTRACTS.UNI]: {
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    icon: '🦄',
    coingeckoId: 'uniswap'
  },
  [TOKEN_CONTRACTS.LINK]: {
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    icon: '🔗',
    coingeckoId: 'chainlink'
  },
  [TOKEN_CONTRACTS.WETH]: {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    icon: 'Ξ',
    coingeckoId: 'weth'
  },
  [TOKEN_CONTRACTS.DAI]: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    icon: '◈',
    coingeckoId: 'dai'
  },
  [TOKEN_CONTRACTS.WBTC]: {
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    decimals: 8,
    icon: '₿',
    coingeckoId: 'wrapped-bitcoin'
  }
} as const

// 交易状态配置
export const TRANSACTION_STATUS = {
  SUCCESS: 'success',
  PENDING: 'pending',
  FAILED: 'failed'
} as const

// 交易类型配置
export const TRANSACTION_TYPES = {
  TRANSFER: 'Transfer',
  TOKEN_TRANSFER: 'Token Transfer',
  SWAP: 'Swap',
  APPROVE: 'Approve',
  DEPOSIT: 'Deposit',
  WITHDRAW: 'Withdraw'
} as const

// 应用配置
export const APP_CONFIG = {
  NAME: 'DeFi Dashboard',
  DESCRIPTION: '现代化的DeFi资产管理面板',
  VERSION: '1.0.0',
  GITHUB_URL: 'https://github.com/your-username/defi-dashboard',
  DOCS_URL: 'https://docs.your-domain.com'
} as const

// 默认设置
export const DEFAULT_SETTINGS = {
  THEME: 'dark',
  CURRENCY: 'USD',
  LANGUAGE: 'zh-CN',
  REFRESH_INTERVAL: 30000, // 30秒
  ITEMS_PER_PAGE: 10
} as const

// 错误消息
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: '请先连接钱包',
  NETWORK_NOT_SUPPORTED: '不支持的网络',
  INSUFFICIENT_BALANCE: '余额不足',
  TRANSACTION_FAILED: '交易失败',
  API_ERROR: 'API请求失败',
  INVALID_ADDRESS: '无效的地址格式'
} as const

// 本地存储键
export const STORAGE_KEYS = {
  THEME: 'theme',
  WALLET_STORAGE: 'wallet-storage',
  USER_PREFERENCES: 'user-preferences',
} as const

// 动画配置
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
} as const 