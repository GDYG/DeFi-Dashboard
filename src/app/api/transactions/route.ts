import { NextRequest, NextResponse } from 'next/server'
import { EtherscanService } from '@/services/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: '地址参数是必需的' },
        { status: 400 }
      )
    }

    // 在服务端创建服务实例，API密钥只在服务端使用
    const etherscanService = new EtherscanService()

    // 获取ETH交易记录
    const ethTransactions = await etherscanService.getAccountTransactions(address, 1, 5)
    
    // 获取代币转账记录
    const tokenTransfers = await etherscanService.getTokenTransfers(address, undefined, 1, 5)

    // 格式化时间为相对时间
    const formatTimeAgo = (timestamp: number): string => {
      const now = Date.now()
      const diffInSeconds = Math.floor((now - timestamp) / 1000)

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

    // 合并并格式化交易记录
    const allTransactions = [
      ...ethTransactions.map(tx => ({
        hash: tx.hash,
        type: 'Transfer',
        amount: `${tx.from.toLowerCase() === address.toLowerCase() ? '-' : '+'}${(parseFloat(tx.value) / 1e18).toFixed(4)} ETH`,
        status: tx.isError === '0' ? 'success' as const : 'failed' as const,
        time: formatTimeAgo(parseInt(tx.timeStamp) * 1000),
        from: tx.from,
        to: tx.to,
        timestamp: parseInt(tx.timeStamp)
      })),
      ...tokenTransfers.map(tx => ({
        hash: tx.hash,
        type: 'Token Transfer',
        amount: `${tx.from.toLowerCase() === address.toLowerCase() ? '-' : '+'}${(parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal))).toFixed(4)} ${tx.tokenSymbol}`,
        status: 'success' as const,
        time: formatTimeAgo(parseInt(tx.timeStamp) * 1000),
        from: tx.from,
        to: tx.to,
        timestamp: parseInt(tx.timeStamp)
      }))
    ]

    // 按时间排序
    const sortedTransactions = allTransactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)

    return NextResponse.json({ transactions: sortedTransactions })
  } catch (error) {
    console.error('获取交易记录失败:', error)
    return NextResponse.json(
      { error: '获取交易记录失败' },
      { status: 500 }
    )
  }
} 