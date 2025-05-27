'use client'

import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useDisconnect } from 'wagmi'
import { Moon, Sun, LogOut, Copy, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { ToastManager } from '@/components/Toast'

export function Header() {
  const [isDark, setIsDark] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const { disconnect } = useDisconnect()
  const { toasts, removeToast, success } = useToast()

  useEffect(() => {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    success('地址已复制到剪贴板')
    setShowAccountMenu(false)
  }

  const openEtherscan = (address: string) => {
    window.open(`https://etherscan.io/address/${address}`, '_blank')
    setShowAccountMenu(false)
  }

  const handleDisconnect = () => {
    disconnect()
    setShowAccountMenu(false)
    success('钱包已断开连接')
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                DeFi Dashboard
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {/* Wallet Connect Button */}
              <div className="relative">
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected =
                      ready &&
                      account &&
                      chain &&
                      (!authenticationStatus ||
                        authenticationStatus === 'authenticated');

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          'style': {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button 
                                onClick={openConnectModal} 
                                type="button"
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                              >
                                连接钱包
                              </button>
                            );
                          }

                          if (chain.unsupported) {
                            return (
                              <button 
                                onClick={openChainModal} 
                                type="button"
                                className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                              >
                                错误网络
                              </button>
                            );
                          }

                          return (
                            <div className="flex items-center space-x-2">
                              {/* Network Button */}
                              <button
                                onClick={openChainModal}
                                className="flex items-center space-x-2 bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-gray-700 dark:text-white"
                                type="button"
                              >
                                {chain.hasIcon && (
                                  <div
                                    style={{
                                      background: chain.iconBackground,
                                      width: 16,
                                      height: 16,
                                      borderRadius: 999,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {chain.iconUrl && (
                                      <img
                                        alt={chain.name ?? 'Chain icon'}
                                        src={chain.iconUrl}
                                        style={{ width: 16, height: 16 }}
                                      />
                                    )}
                                  </div>
                                )}
                                <span className="text-sm font-medium">
                                  {chain.name}
                                </span>
                              </button>

                              {/* Account Button with Dropdown */}
                              <div className="relative">
                                <button 
                                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                                  type="button"
                                  className="bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center space-x-2"
                                >
                                  <span>{account.displayName}</span>
                                  {account.displayBalance && (
                                    <span className="text-sm opacity-75">
                                      ({account.displayBalance})
                                    </span>
                                  )}
                                </button>

                                {/* Dropdown Menu */}
                                {showAccountMenu && (
                                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                      <div className="text-sm text-gray-500 dark:text-gray-400">钱包地址</div>
                                      <div className="font-mono text-sm text-gray-900 dark:text-gray-100 truncate">
                                        {account.address}
                                      </div>
                                    </div>
                                    
                                    <button
                                      onClick={() => copyAddress(account.address)}
                                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                                    >
                                      <Copy className="w-4 h-4" />
                                      <span>复制地址</span>
                                    </button>
                                    
                                    <button
                                      onClick={() => openEtherscan(account.address)}
                                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      <span>在 Etherscan 查看</span>
                                    </button>
                                    
                                    <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                                      <button
                                        onClick={handleDisconnect}
                                        className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 text-red-600 dark:text-red-400"
                                      >
                                        <LogOut className="w-4 h-4" />
                                        <span>断开连接</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
          </div>
        </div>

        {/* Click outside to close menu */}
        {showAccountMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowAccountMenu(false)}
          />
        )}
      </header>

      {/* Toast Manager */}
      <ToastManager toasts={toasts} removeToast={removeToast} />
    </>
  )
} 