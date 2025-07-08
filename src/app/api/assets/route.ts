import { NextRequest, NextResponse } from 'next/server'
import {  CoinGeckoService } from '@/services/coinGeckoService'
import { createStrategyOnClient } from '@/services/ethServiceFactory'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const chainId = searchParams.get("chainId")

    if (!address || !chainId) {
      return NextResponse.json(
        { error: '地址参数是必需的' },
        { status: 400 }
      )
    }

    // 在服务端创建服务实例，API密钥只在服务端使用
    const ethService = await createStrategyOnClient(+chainId)
    const coinGeckoService = new CoinGeckoService()

    // 获取ETH余额
    const ethBalance = await ethService.getAccountBalance(address)
    const ethBalanceInEther = parseFloat(ethBalance) / 1e18

    // 获取ETH价格
    const ethPrice = await coinGeckoService.getEthereumPrice()

    // 主要ERC20代币合约地址
    const tokenContracts = {
      USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    }

    // 获取代币余额
    const tokenBalances = await Promise.all([
      ethService.getTokenBalance(address, tokenContracts.USDC),
      ethService.getTokenBalance(address, tokenContracts.UNI),
      ethService.getTokenBalance(address, tokenContracts.LINK),
    ])

    // 获取代币价格
    const tokenPrices = await coinGeckoService.getTokenPrices(['uniswap', 'chainlink'])

    const assets = [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        amount: ethBalanceInEther.toFixed(4),
        usd: ethPrice ? `$${(ethBalanceInEther * ethPrice.usd).toFixed(2)}` : '$0.00',
        icon: 'Ξ',
        change: ethPrice ? `${ethPrice.usd_24h_change >= 0 ? '+' : ''}${ethPrice.usd_24h_change.toFixed(2)}%` : '0%',
        address: '0x0000000000000000000000000000000000000000'
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        amount: (parseFloat(tokenBalances[0]) / 1e6).toFixed(2),
        usd: `$${(parseFloat(tokenBalances[0]) / 1e6).toFixed(2)}`,
        icon: '$',
        change: '+0.1%',
        address: tokenContracts.USDC
      },
      {
        symbol: 'UNI',
        name: 'Uniswap',
        amount: (parseFloat(tokenBalances[1]) / 1e18).toFixed(2),
        usd: tokenPrices.uniswap ? `$${((parseFloat(tokenBalances[1]) / 1e18) * tokenPrices.uniswap.usd).toFixed(2)}` : '$0.00',
        icon: '🦄',
        change: tokenPrices.uniswap ? `${tokenPrices.uniswap.usd_24h_change >= 0 ? '+' : ''}${tokenPrices.uniswap.usd_24h_change.toFixed(2)}%` : '0%',
        address: tokenContracts.UNI
      },
      {
        symbol: 'LINK',
        name: 'Chainlink',
        amount: (parseFloat(tokenBalances[2]) / 1e18).toFixed(2),
        usd: tokenPrices.chainlink ? `$${((parseFloat(tokenBalances[2]) / 1e18) * tokenPrices.chainlink.usd).toFixed(2)}` : '$0.00',
        icon: '🔗',
        change: tokenPrices.chainlink ? `${tokenPrices.chainlink.usd_24h_change >= 0 ? '+' : ''}${tokenPrices.chainlink.usd_24h_change.toFixed(2)}%` : '0%',
        address: tokenContracts.LINK
      }
    ]

    const filteredAssets = assets.filter(asset => parseFloat(asset.amount) > 0)

    return NextResponse.json({ assets: filteredAssets })
  } catch (error) {
    console.error('获取资产数据失败:', error)
    return NextResponse.json(
      { error: '获取资产数据失败' },
      { status: 500 }
    )
  }
} 