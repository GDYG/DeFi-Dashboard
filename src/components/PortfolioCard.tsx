'use client'

import { useWallet } from '@/hooks/useWallet'
import { useWalletStore } from '@/store/walletStore'
import { TrendingUp, DollarSign, PieChart } from 'lucide-react'

export function PortfolioCard() {
  const { isConnected } = useWallet()
  const { portfolioValue, dailyChange } = useWalletStore()

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">投资组合</h2>
          <PieChart className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <PieChart className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">请先连接钱包</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">连接后查看投资组合</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-200 dark:border-gray-700 hover:shadow-card-lg transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">投资组合</h2>
        <PieChart className="w-6 h-6 text-gray-400" />
      </div>
      
      <div className="space-y-6">
        {/* Total Value */}
        <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">总价值</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio Value</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$7,175.00</p>
              <div className="flex items-center space-x-2 mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">+5.2% (24h)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily P&L */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">今日收益</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily P&L</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">+$354.20</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">+5.2%</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">资产数量</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">4</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">最佳表现</p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">UNI</p>
          </div>
        </div>
      </div>
    </div>
  )
} 