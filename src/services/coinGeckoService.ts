import { API_ENDPOINTS } from "@/utils/constants"
import { ApiClient } from "./api"

interface CoinGeckoTokenPrice {
  usd: number
  usd_24h_change: number
}

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



// 导出服务实例（仅用于服务端）
export const coinGeckoService = new CoinGeckoService()
