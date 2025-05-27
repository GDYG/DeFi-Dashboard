'use client'

import { formatTxHash } from '@/utils/format'
import { CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react'

interface Transaction {
  hash: string
  type: string
  amount: string
  status: 'success' | 'pending' | 'failed'
  time: string
  from: string
  to: string
}

interface TransactionCardProps {
  transaction: Transaction
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-400" />
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-400" />
    case 'failed':
      return <XCircle className="w-4 h-4 text-red-400" />
    default:
      return <Clock className="w-4 h-4 text-gray-400" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-500/20 text-green-400'
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'failed':
      return 'bg-red-500/20 text-red-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const isPositive = transaction.amount.startsWith('+')
  const isNegative = transaction.amount.startsWith('-')

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            {getStatusIcon(transaction.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <a 
                href={`https://etherscan.io/tx/${transaction.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-blue-400 hover:text-blue-300 truncate max-w-[200px] flex items-center gap-1"
              >
                {formatTxHash(transaction.hash)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                {transaction.type}
              </span>
              <span className="text-xs text-gray-400">{transaction.time}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`font-semibold ${
            isPositive 
              ? 'text-green-400'
              : isNegative
              ? 'text-red-400'
              : 'text-white'
          }`}>
            {transaction.amount}
          </p>
          <p className="text-xs text-gray-400 capitalize">
            {transaction.status}
          </p>
        </div>
      </div>
      
      {/* 交易详情 */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div>
            从: <span className="font-mono">{formatTxHash(transaction.from)}</span>
          </div>
          <div>
            到: <span className="font-mono">{formatTxHash(transaction.to)}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 