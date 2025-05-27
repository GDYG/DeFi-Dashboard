import { useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { useWalletStore } from '@/store/walletStore'

export function useWallet() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address: address,
  })
  
  const {
    setConnected,
    setAddress,
    setBalance,
    setLoading,
    reset,
  } = useWalletStore()

  useEffect(() => {
    if (isConnected && address) {
      setConnected(true)
      setAddress(address)
      setLoading(false)
      
      if (balance) {
        setBalance(balance.formatted)
      }
    } else {
      reset()
    }
  }, [isConnected, address, balance, setConnected, setAddress, setBalance, setLoading, reset])

  return {
    isConnected,
    address,
    balance: balance?.formatted || '0',
  }
} 