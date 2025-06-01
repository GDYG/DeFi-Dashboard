import { NextRequest, NextResponse } from 'next/server'
import { EtherscanService } from '@/services/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const contractAddress = searchParams.get('contractAddress')

    if (!address) {
      return NextResponse.json(
        { error: '地址参数是必需的' },
        { status: 400 }
      )
    }

    // 在服务端创建服务实例，API密钥只在服务端使用
    const etherscanService = new EtherscanService()

    if (contractAddress) {
      // 获取代币余额
      const tokenBalance = await etherscanService.getTokenBalance(address, contractAddress)
      return NextResponse.json({ balance: tokenBalance })
    } else {
      // 获取ETH余额
      const ethBalance = await etherscanService.getAccountBalance(address)
      return NextResponse.json({ balance: ethBalance })
    }
  } catch (error) {
    console.error('获取余额数据失败:', error)
    return NextResponse.json(
      { error: '获取余额数据失败' },
      { status: 500 }
    )
  }
} 