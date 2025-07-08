import { NextRequest, NextResponse } from 'next/server'
import { CoinGeckoService } from '@/services/coinGeckoService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tokenIds = searchParams.get('tokenIds')
    const contractAddress = searchParams.get('contractAddress')

    // 在服务端创建服务实例，API密钥只在服务端使用
    const coinGeckoService = new CoinGeckoService()

    if (contractAddress) {
      // 根据合约地址获取代币价格
      const tokenPrice = await coinGeckoService.getTokenPriceByContract(contractAddress)
      return NextResponse.json({ price: tokenPrice })
    } else if (tokenIds) {
      // 根据代币ID列表获取价格
      const tokenIdArray = tokenIds.split(',')
      const prices = await coinGeckoService.getTokenPrices(tokenIdArray)
      return NextResponse.json({ prices })
    } else {
      // 获取以太坊价格
      const ethereumPrice = await coinGeckoService.getEthereumPrice()
      return NextResponse.json({ ethereumPrice })
    }
  } catch (error) {
    console.error('获取价格数据失败:', error)
    return NextResponse.json(
      { error: '获取价格数据失败' },
      { status: 500 }
    )
  }
} 