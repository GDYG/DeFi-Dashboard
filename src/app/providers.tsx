'use client'

import { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css'
import { queryClient, wagmiConfig } from '@/utils/providersConfig'


interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
} 