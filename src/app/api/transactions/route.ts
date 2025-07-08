import { NextRequest, NextResponse } from 'next/server'
import { createStrategyOnClient } from '@/services/ethServiceFactory'
import { formatTimeAgo } from '@/utils/format'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const chainId = searchParams.get('chainId')

    if (!address || !chainId) {
      return NextResponse.json(
        { error: '地址参数是必需的' },
        { status: 400 }
      )
    }

    // 在服务端创建服务实例，API密钥只在服务端使用
    const ethService = await createStrategyOnClient(+chainId)

    // 获取ETH交易记录
    const ethTransactions = await ethService.getAccountTransactions(address, 1, 5)
    
    // 获取代币转账记录
    const tokenTransfers = await ethService.getTokenTransfers(address, 1, 5, undefined)

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