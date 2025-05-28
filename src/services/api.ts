import { API_ENDPOINTS } from '@/utils/constants'

// API响应类型定义
interface EtherscanResponse<T = any> {
  status: string
  message: string
  result: T
}

interface CoinGeckoTokenPrice {
  usd: number
  usd_24h_change: number
}

interface EtherscanTransaction {
  hash: string
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  gasUsed: string
  timeStamp: string
  confirmations: string
  isError: string
}

interface EtherscanTokenTransfer {
  hash: string
  from: string
  to: string
  value: string
  tokenName: string
  tokenSymbol: string
  tokenDecimal: string
  contractAddress: string
  timeStamp: string
}

/**
 * 基础API客户端
 */
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(endpoint, this.baseUrl)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }
}

/**
 * CoinGecko API 服务
 */
export class CoinGeckoService {
  private client: ApiClient

  constructor() {
    this.client = new ApiClient(API_ENDPOINTS.COINGECKO)
  }

  /**
   * 获取代币价格
   */
  async getTokenPrices(tokenIds: string[]): Promise<Record<string, CoinGeckoTokenPrice>> {
    try {
      const params: Record<string, string> = {
        ids: tokenIds.join(','),
        vs_currencies: 'usd',
        include_24hr_change: 'true'
      }

      // 如果有API Key，添加到参数中
      const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY
      if (apiKey) {
        params.x_cg_demo_api_key = apiKey
      }

      const response = await this.client.get<Record<string, CoinGeckoTokenPrice>>('/simple/price', params)
      return response
    } catch (error) {
      console.warn('⚠️ CoinGecko API 请求失败，可能是网络问题或请求频率限制:', error)
      
      // 返回默认价格数据以避免应用崩溃
      const fallbackPrices: Record<string, CoinGeckoTokenPrice> = {}
      tokenIds.forEach(id => {
        fallbackPrices[id] = {
          usd: 0,
          usd_24h_change: 0
        }
      })
      return fallbackPrices
    }
  }

  /**
   * 获取以太坊价格
   */
  async getEthereumPrice(): Promise<CoinGeckoTokenPrice | null> {
    try {
      const prices = await this.getTokenPrices(['ethereum'])
      return prices.ethereum || null
    } catch (error) {
      console.error('Failed to fetch Ethereum price:', error)
      return null
    }
  }

  /**
   * 根据合约地址获取代币价格
   */
  async getTokenPriceByContract(contractAddress: string): Promise<CoinGeckoTokenPrice | null> {
    try {
      const params: Record<string, string> = {
        contract_addresses: contractAddress,
        vs_currencies: 'usd',
        include_24hr_change: 'true'
      }

      const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY
      if (apiKey) {
        params.x_cg_demo_api_key = apiKey
      }

      const response = await this.client.get<Record<string, CoinGeckoTokenPrice>>('/simple/token_price/ethereum', params)
      return response[contractAddress.toLowerCase()] || null
    } catch (error) {
      console.error('Failed to fetch token price by contract:', error)
      return null
    }
  }
}

/**
 * Etherscan API 服务
 */
export class EtherscanService {
  private client: ApiClient
  private apiKey: string

  constructor() {
    this.client = new ApiClient(API_ENDPOINTS.ETHERSCAN)
    this.apiKey = process.env.ETHERSCAN_API_KEY || ''
    
    if (!this.apiKey) {
      console.warn('⚠️ Etherscan API Key 未配置，将使用免费限制版本')
    }
  }

  /**
   * 获取账户ETH余额
   */
  async getAccountBalance(address: string): Promise<string> {
    try {
      const response = await this.client.get<EtherscanResponse<string>>('', {
        module: 'account',
        action: 'balance',
        address,
        tag: 'latest',
        apikey: this.apiKey
      })
      
      if (response.status === '1') {
        return response.result
      }
      
      // 处理API错误
      if (response.message === 'NOTOK') {
        console.warn('⚠️ Etherscan API 请求失败，可能是API密钥问题或请求频率限制')
        return '0'
      }
      
      throw new Error(response.message)
    } catch (error) {
      console.error('Failed to fetch account balance:', error)
      return '0'
    }
  }

  /**
   * 获取账户交易记录
   */
  async getAccountTransactions(
    address: string,
    page: number = 1,
    offset: number = 10
  ): Promise<EtherscanTransaction[]> {
    try {
      const response = await this.client.get<EtherscanResponse<EtherscanTransaction[]>>('', {
        module: 'account',
        action: 'txlist',
        address,
        startblock: '0',
        endblock: '99999999',
        page: page.toString(),
        offset: offset.toString(),
        sort: 'desc',
        apikey: this.apiKey
      })
      
      if (response.status === '1') {
        return response.result
      }
      return []
    } catch (error) {
      console.error('Failed to fetch account transactions:', error)
      return []
    }
  }

  /**
   * 获取ERC20代币转账记录
   */
  async getTokenTransfers(
    address: string,
    contractAddress?: string,
    page: number = 1,
    offset: number = 10
  ): Promise<EtherscanTokenTransfer[]> {
    try {
      const params: Record<string, string> = {
        module: 'account',
        action: 'tokentx',
        address,
        page: page.toString(),
        offset: offset.toString(),
        sort: 'desc',
        apikey: this.apiKey
      }

      if (contractAddress) {
        params.contractaddress = contractAddress
      }

      const response = await this.client.get<EtherscanResponse<EtherscanTokenTransfer[]>>('', params)
      
      if (response.status === '1') {
        return response.result
      }
      return []
    } catch (error) {
      console.error('Failed to fetch token transfers:', error)
      return []
    }
  }

  /**
   * 获取账户ERC20代币余额
   */
  async getTokenBalance(address: string, contractAddress: string): Promise<string> {
    try {
      const response = await this.client.get<EtherscanResponse<string>>('', {
        module: 'account',
        action: 'tokenbalance',
        contractaddress: contractAddress,
        address,
        tag: 'latest',
        apikey: this.apiKey
      })
      
      if (response.status === '1') {
        return response.result
      }
      return '0'
    } catch (error) {
      console.error('Failed to fetch token balance:', error)
      return '0'
    }
  }
}

/**
 * 真实数据服务
 */
export class RealDataService {
  private etherscanService: EtherscanService
  private coinGeckoService: CoinGeckoService

  constructor() {
    this.etherscanService = new EtherscanService()
    this.coinGeckoService = new CoinGeckoService()
  }

  /**
   * 获取用户资产数据
   */
  async getUserAssets(address: string) {
    try {
      // 获取ETH余额
      const ethBalance = await this.etherscanService.getAccountBalance(address)
      const ethBalanceInEther = parseFloat(ethBalance) / 1e18

      // 获取ETH价格
      const ethPrice = await this.coinGeckoService.getEthereumPrice()

      // 主要ERC20代币合约地址
      const tokenContracts = {
        USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      }

      // 获取代币余额
      const tokenBalances = await Promise.all([
        this.etherscanService.getTokenBalance(address, tokenContracts.USDC),
        this.etherscanService.getTokenBalance(address, tokenContracts.UNI),
        this.etherscanService.getTokenBalance(address, tokenContracts.LINK),
      ])

      // 获取代币价格
      const tokenPrices = await this.coinGeckoService.getTokenPrices(['uniswap', 'chainlink'])

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

      return assets.filter(asset => parseFloat(asset.amount) > 0)
    } catch (error) {
      console.error('Failed to fetch user assets:', error)
      return []
    }
  }

  /**
   * 获取用户交易记录
   */
  async getUserTransactions(address: string) {
    try {
      // 获取ETH交易记录
      const ethTransactions = await this.etherscanService.getAccountTransactions(address, 1, 5)
      
      // 获取代币转账记录
      const tokenTransfers = await this.etherscanService.getTokenTransfers(address, undefined, 1, 5)

      // 合并并格式化交易记录
      const allTransactions = [
        ...ethTransactions.map(tx => ({
          hash: tx.hash,
          type: 'Transfer',
          amount: `${tx.from.toLowerCase() === address.toLowerCase() ? '-' : '+'}${(parseFloat(tx.value) / 1e18).toFixed(4)} ETH`,
          status: tx.isError === '0' ? 'success' as const : 'failed' as const,
          time: this.formatTimeAgo(parseInt(tx.timeStamp) * 1000),
          from: tx.from,
          to: tx.to,
          timestamp: parseInt(tx.timeStamp)
        })),
        ...tokenTransfers.map(tx => ({
          hash: tx.hash,
          type: 'Token Transfer',
          amount: `${tx.from.toLowerCase() === address.toLowerCase() ? '-' : '+'}${(parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal))).toFixed(4)} ${tx.tokenSymbol}`,
          status: 'success' as const,
          time: this.formatTimeAgo(parseInt(tx.timeStamp) * 1000),
          from: tx.from,
          to: tx.to,
          timestamp: parseInt(tx.timeStamp)
        }))
      ]

      // 按时间排序
      return allTransactions
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10)
    } catch (error) {
      console.error('Failed to fetch user transactions:', error)
      return []
    }
  }

  /**
   * 格式化时间为相对时间
   */
  private formatTimeAgo(timestamp: number): string {
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
}

// 导出服务实例
export const coinGeckoService = new CoinGeckoService()
export const etherscanService = new EtherscanService()
export const realDataService = new RealDataService() 