'use client'

import { formatTxHash } from '@/utils/format'

interface Asset {
  symbol: string
  name: string
  amount: string
  usd: string
  icon: string
  change: string
  address: string
}

interface AssetCardProps {
  asset: Asset
}

export default function AssetCard({ asset }: AssetCardProps) {
  const isPositiveChange = asset.change.startsWith('+')

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {asset.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white">{asset.symbol}</h3>
            <p className="text-sm text-gray-300">{asset.name}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-semibold text-white">{asset.amount}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-300">{asset.usd}</p>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isPositiveChange 
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {asset.change}
            </span>
          </div>
        </div>
      </div>
      
      {/* 合约地址 */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="text-xs text-gray-400">
          合约: <span className="font-mono">{formatTxHash(asset.address)}</span>
        </div>
      </div>
    </div>
  )
} 