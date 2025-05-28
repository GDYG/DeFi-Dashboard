import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface ApiStatusProps {
  className?: string
}

interface ApiStatus {
  etherscan: 'checking' | 'ok' | 'error'
  coingecko: 'checking' | 'ok' | 'error'
}

export function ApiStatus({ className = '' }: ApiStatusProps) {
  const [status, setStatus] = useState<ApiStatus>({
    etherscan: 'checking',
    coingecko: 'checking'
  })
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    // 检查环境变量
    const etherscanKey = process.env.ETHERSCAN_API_KEY
    const coingeckoKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY

    setStatus({
      etherscan: etherscanKey ? 'ok' : 'error',
      coingecko: 'ok' // CoinGecko 免费版不需要API Key
    })
  }

  const getStatusIcon = (apiStatus: 'checking' | 'ok' | 'error') => {
    switch (apiStatus) {
      case 'ok':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  const hasErrors = status.etherscan === 'error' || status.coingecko === 'error'

  if (!hasErrors) return null

  return (
    <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            API 配置提醒
          </span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 text-sm"
        >
          {showDetails ? '隐藏' : '详情'}
        </button>
      </div>

      {showDetails && (
        <div className="mt-3 space-y-2">
          <div className="text-sm text-yellow-700 dark:text-yellow-300">
            为了获得最佳体验，请配置以下API密钥：
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {getStatusIcon(status.etherscan)}
              <span className="text-sm text-yellow-700 dark:text-yellow-300">
                Etherscan API Key {status.etherscan === 'error' && '(未配置 - 数据可能无法加载)'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusIcon(status.coingecko)}
              <span className="text-sm text-yellow-700 dark:text-yellow-300">
                CoinGecko API (免费版本可用)
              </span>
            </div>
          </div>

          <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
            请查看 README.md 了解如何获取和配置API密钥
          </div>
        </div>
      )}
    </div>
  )
} 