/**
 * 格式化数字为货币格式
 */
export function formatCurrency(
  value: number | string,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) return '$0.00'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)
}

/**
 * 格式化大数字（K, M, B）
 */
export function formatLargeNumber(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) return '0'
  
  if (numValue >= 1e9) {
    return (numValue / 1e9).toFixed(1) + 'B'
  }
  if (numValue >= 1e6) {
    return (numValue / 1e6).toFixed(1) + 'M'
  }
  if (numValue >= 1e3) {
    return (numValue / 1e3).toFixed(1) + 'K'
  }
  
  return numValue.toFixed(2)
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) return '0%'
  
  const sign = numValue >= 0 ? '+' : ''
  return `${sign}${numValue.toFixed(2)}%`
}

/**
 * 格式化以太坊地址
 */
export function formatAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (!address) return ''
  
  if (address.length <= startLength + endLength) {
    return address
  }
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * 格式化交易哈希
 */
export function formatTxHash(hash: string): string {
  return formatAddress(hash, 10, 8)
}

/**
 * 格式化时间为相对时间
 */
export function formatRelativeTime(timestamp: number | string | Date): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} 秒前`
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} 分钟前`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} 小时前`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} 天前`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} 个月前`
  }
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} 年前`
}

/**
 * 格式化代币数量
 */
export function formatTokenAmount(
  amount: string | number,
  decimals: number = 18,
  displayDecimals: number = 4
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) return '0'
  
  // 如果是wei单位，转换为ether
  const etherAmount = decimals === 18 ? numAmount / 1e18 : numAmount
  
  return etherAmount.toFixed(displayDecimals)
}

/**
 * 验证以太坊地址
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * 验证交易哈希
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
} 