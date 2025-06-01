import { create } from 'zustand'
import { clientApiService } from '@/services/clientApi'

interface Asset {
  symbol: string
  name: string
  amount: string
  usd: string
  icon: string
  change: string
  address: string
}

interface Transaction {
  hash: string
  type: string
  amount: string
  status: 'success' | 'pending' | 'failed'
  time: string
  from: string
  to: string
}

interface WalletState {
  // 连接状态
  isConnected: boolean
  address: string | null
  chainId: number | null
  
  // 数据状态
  assets: Asset[]
  transactions: Transaction[]
  totalValue: string
  
  // 加载状态
  isLoadingAssets: boolean
  isLoadingTransactions: boolean
  
  // 错误状态
  error: string | null
  
  // Actions
  setConnection: (isConnected: boolean, address?: string, chainId?: number) => void
  setAssets: (assets: Asset[]) => void
  setTransactions: (transactions: Transaction[]) => void
  setLoading: (type: 'assets' | 'transactions', loading: boolean) => void
  setError: (error: string | null) => void
  
  // 数据获取方法
  fetchUserData: (address: string) => Promise<void>
  fetchAssets: (address: string) => Promise<void>
  fetchTransactions: (address: string) => Promise<void>
  
  // 重置方法
  reset: () => void
  refresh: () => Promise<void>
}

export const useWalletStore = create<WalletState>((set, get) => ({
  // 初始状态
  isConnected: false,
  address: null,
  chainId: null,
  
  assets: [],
  transactions: [],
  totalValue: '$0.00',
  
  isLoadingAssets: false,
  isLoadingTransactions: false,
  
  error: null,

  // 设置连接状态
  setConnection: (isConnected, address, chainId) => {
    set({ 
      isConnected, 
      address: address || null, 
      chainId: chainId || null,
      error: null
    })
    
    // 如果连接成功，获取用户数据
    if (isConnected && address) {
      get().fetchUserData(address)
    } else {
      // 如果断开连接，重置数据
      get().reset()
    }
  },

  // 设置资产数据
  setAssets: (assets) => {
    // 计算总价值
    const totalValue = assets.reduce((total, asset) => {
      const value = parseFloat(asset.usd.replace(/[$,]/g, ''))
      return total + (isNaN(value) ? 0 : value)
    }, 0)
    
    set({ 
      assets, 
      totalValue: `$${totalValue.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}` 
    })
  },

  // 设置交易数据
  setTransactions: (transactions) => {
    set({ transactions })
  },

  // 设置加载状态
  setLoading: (type, loading) => {
    if (type === 'assets') {
      set({ isLoadingAssets: loading })
    } else {
      set({ isLoadingTransactions: loading })
    }
  },

  // 设置错误状态
  setError: (error) => {
    set({ error })
  },

  // 获取用户完整数据
  fetchUserData: async (address: string) => {
    const { fetchAssets, fetchTransactions } = get()
    
    try {
      set({ error: null })
      
      // 并行获取资产和交易数据
      await Promise.all([
        fetchAssets(address),
        fetchTransactions(address)
      ])
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      set({ error: '获取用户数据失败，请稍后重试' })
    }
  },

  // 获取资产数据
  fetchAssets: async (address: string) => {
    const { setAssets, setLoading, setError } = get()
    
    try {
      setLoading('assets', true)
      setError(null)
      
      const assets = await clientApiService.getUserAssets(address)
      setAssets(assets)
    } catch (error) {
      console.error('Failed to fetch assets:', error)
      setError('获取资产数据失败')
      setAssets([])
    } finally {
      setLoading('assets', false)
    }
  },

  // 获取交易数据
  fetchTransactions: async (address: string) => {
    const { setTransactions, setLoading, setError } = get()
    
    try {
      setLoading('transactions', true)
      
      const transactions = await clientApiService.getUserTransactions(address)
      setTransactions(transactions)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      setError('获取交易记录失败')
      setTransactions([])
    } finally {
      setLoading('transactions', false)
    }
  },

  // 重置所有数据
  reset: () => {
    set({
      isConnected: false,
      address: null,
      chainId: null,
      assets: [],
      transactions: [],
      totalValue: '$0.00',
      isLoadingAssets: false,
      isLoadingTransactions: false,
      error: null
    })
  },

  // 刷新数据
  refresh: async () => {
    const { address, fetchUserData } = get()
    
    if (address) {
      await fetchUserData(address)
    }
  }
}))

// 导出类型
export type { Asset, Transaction, WalletState } 