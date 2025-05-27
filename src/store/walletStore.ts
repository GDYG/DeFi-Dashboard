import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Asset, Transaction, WalletState } from '@/types'

const initialState = {
  isConnected: false,
  address: null,
  balance: '0',
  assets: [],
  transactions: [],
  portfolioValue: '0',
  dailyChange: '0',
  isLoading: false,
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setConnected: (connected) => set({ isConnected: connected }),
      setAddress: (address) => set({ address }),
      setBalance: (balance) => set({ balance }),
      setAssets: (assets) => set({ assets }),
      setTransactions: (transactions) => set({ transactions }),
      setPortfolioValue: (portfolioValue) => set({ portfolioValue }),
      setDailyChange: (dailyChange) => set({ dailyChange }),
      setLoading: (isLoading) => set({ isLoading }),
      reset: () => set(initialState),
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        isConnected: state.isConnected,
        address: state.address,
      }),
    }
  )
) 