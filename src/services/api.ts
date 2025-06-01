import { API_ENDPOINTS } from '@/utils/constants'
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';

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

    const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:7890');
    const response = await fetch(url.toString(), {
      agent: proxyAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }
    
    return response.json() as Promise<T>
  }
}

/**
 * CoinGecko API 服务
 * 🔐 仅用于服务端 - 包含敏感API密钥
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
      const apiKey = process.env.COINGECKO_API_KEY
      if (apiKey) {
        params.x_cg_demo_api_key = apiKey
      }

      const response = await this.client.get<Record<string, CoinGeckoTokenPrice>>('simple/price', params)
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

      const apiKey = process.env.COINGECKO_API_KEY
      if (apiKey) {
        params.x_cg_demo_api_key = apiKey
      }

      const response = await this.client.get<Record<string, CoinGeckoTokenPrice>>('simple/token_price/ethereum', params)
      return response[contractAddress.toLowerCase()] || null
    } catch (error) {
      console.error('Failed to fetch token price by contract:', error)
      return null
    }
  }
}

/**
 * Etherscan API 服务
 * 🔐 仅用于服务端 - 包含敏感API密钥
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

// 导出服务实例（仅用于服务端）
export const coinGeckoService = new CoinGeckoService()
export const etherscanService = new EtherscanService()

// 注意：
// - 以上服务类包含API密钥，仅应在服务端使用
// - 客户端应该使用 ClientApiService 通过内部API路由获取数据
// - 这样可以保护敏感信息不被暴露在客户端代码中 