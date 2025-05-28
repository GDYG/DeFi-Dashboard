'use client'

import { useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { useWalletStore } from '@/store/useWalletStore'
import AssetCard from '@/components/AssetCard'
import TransactionCard from '@/components/TransactionCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import { ApiStatus } from '@/components/ApiStatus'

export default function Home() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  const {
    assets,
    transactions,
    totalValue,
    isLoadingAssets,
    isLoadingTransactions,
    error,
    setConnection,
    refresh
  } = useWalletStore()

  // 监听钱包连接状态变化
  useEffect(() => {
    setConnection(isConnected, address, chainId)
  }, [isConnected, address, chainId, setConnection])

  // 如果钱包未连接，显示连接提示
  if (!isConnected) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-6xl mb-4">🔗</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                欢迎使用 DeFi Dashboard
              </h2>
              <p className="text-gray-300 mb-6 max-w-md">
                连接您的钱包以查看资产余额、交易记录和投资组合概览
              </p>
              <div className="text-sm text-gray-400">
                请点击右上角的"连接钱包"按钮开始使用
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* API状态提醒 */}
        <ApiStatus className="mb-6" />

        {/* 错误提示 */}
        {error && (
          <div className="mb-6">
            <ErrorMessage 
              message={error} 
              onRetry={refresh}
            />
          </div>
        )}

        {/* 投资组合概览 */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">投资组合概览</h2>
              <button
                onClick={refresh}
                disabled={isLoadingAssets || isLoadingTransactions}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                {(isLoadingAssets || isLoadingTransactions) ? (
                  <>
                    <LoadingSpinner size="sm" />
                    刷新中...
                  </>
                ) : (
                  <>
                    🔄
                    刷新
                  </>
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {isLoadingAssets ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    totalValue
                  )}
                </div>
                <div className="text-gray-300">总资产价值</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {isLoadingAssets ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    assets.length
                  )}
                </div>
                <div className="text-gray-300">持有代币</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {isLoadingTransactions ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    transactions.length
                  )}
                </div>
                <div className="text-gray-300">最近交易</div>
              </div>
            </div>

            {/* 钱包地址显示 */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="text-sm text-gray-300">
                当前钱包: <span className="font-mono text-white">{address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 资产列表 */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">我的资产</h2>
              {isLoadingAssets && <LoadingSpinner size="sm" />}
            </div>
            
            <div className="space-y-4">
              {isLoadingAssets ? (
                // 加载状态
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                        <div>
                          <div className="w-16 h-4 bg-gray-600 rounded mb-1"></div>
                          <div className="w-20 h-3 bg-gray-600 rounded"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-20 h-4 bg-gray-600 rounded mb-1"></div>
                        <div className="w-16 h-3 bg-gray-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : assets.length > 0 ? (
                assets.map((asset, index) => (
                  <AssetCard key={`${asset.symbol}-${index}`} asset={asset} />
                ))
              ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
                  <div className="text-4xl mb-4">💰</div>
                  <div className="text-gray-300">暂无资产数据</div>
                  <div className="text-sm text-gray-400 mt-2">
                    请确保您的钱包中有资产或稍后重试
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 交易记录 */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">最近交易</h2>
              {isLoadingTransactions && <LoadingSpinner size="sm" />}
            </div>
            
            <div className="space-y-4">
              {isLoadingTransactions ? (
                // 加载状态
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                        <div>
                          <div className="w-20 h-4 bg-gray-600 rounded mb-1"></div>
                          <div className="w-32 h-3 bg-gray-600 rounded"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-24 h-4 bg-gray-600 rounded mb-1"></div>
                        <div className="w-16 h-3 bg-gray-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <TransactionCard key={`${transaction.hash}-${index}`} transaction={transaction} />
                ))
              ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <div className="text-gray-300">暂无交易记录</div>
                  <div className="text-sm text-gray-400 mt-2">
                    您的交易记录将在这里显示
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 