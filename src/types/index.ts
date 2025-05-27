export interface Asset {
  symbol: string
  name: string
  amount: string
  usd: string
  icon: string
  address?: string
  change?: string
}

export interface Transaction {
  hash: string
  type: string
  amount: string
  status: 'success' | 'pending' | 'failed'
  time: string
  from?: string
  to?: string
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string
  assets: Asset[]
  transactions: Transaction[]
  portfolioValue: string
  dailyChange: string
  isLoading: boolean
  
  // Actions
  setConnected: (connected: boolean) => void
  setAddress: (address: string | null) => void
  setBalance: (balance: string) => void
  setAssets: (assets: Asset[]) => void
  setTransactions: (transactions: Transaction[]) => void
  setPortfolioValue: (value: string) => void
  setDailyChange: (change: string) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export interface ContractInfo {
  address: string
  name: string
  symbol: string
  decimals: string
  totalSupply: string
  maxSupply: string
}

export interface DeploymentInfo {
  network: any
  deployer: string
  contracts: {
    DeFiToken: ContractInfo
  }
  timestamp: string
} 