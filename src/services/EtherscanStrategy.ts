import { ApiClient } from './api'
import { API_ENDPOINTS } from '@/utils/constants'
import { EtherscanResponse, EtherscanTokenTransfer, EtherscanTransaction, IEthProviderStrategy } from './IEthProviderStrategy'

/**
 * Etherscan API 服务
 * 🔐 仅用于服务端 - 包含敏感API密钥
 */
export class EtherscanStrategy implements IEthProviderStrategy {
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
    page: number = 1,
    offset: number = 10,
    contractAddress?: string
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