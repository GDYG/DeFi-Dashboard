// 客户端API服务 - 通过内部API路由获取数据
export class ClientApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_APP_URL || ''
      : 'http://localhost:3000'
  }

  /**
   * 获取用户资产数据
   */
  async getUserAssets(address: string, chainId: number | null) {
    try {
      const ret = await fetch(
        `${this.baseUrl}/api/assets?address=${encodeURIComponent(address)}&chainId=${chainId}`
      )
      const data = await ret.json()
      return data.assets || []
    } catch (error) {
      console.error('获取用户资产失败:', error)
      return []
    }
  }

  /**
   * 获取用户交易记录
   */
  async getUserTransactions(address: string, chainId: number | null) {
    try {
      const ret = await fetch(
        `${this.baseUrl}/api/transactions?address=${encodeURIComponent(address)}&chainId=${chainId}`
      )
      const data = await ret.json()

      return data.transactions || []
    } catch (error) {
      console.error('获取交易记录失败:', error)
      return []
    }
  }

  /**
   * 获取以太坊价格
   */
  async getEthereumPrice() {
    try {
      const ret = await fetch(`${this.baseUrl}/api/prices`)
      const data = await ret.json()
      return data.ethereumPrice
    } catch (error) {
      console.error('获取以太坊价格失败:', error)
      return null
    }
  }

  /**
   * 获取代币价格
   */
  async getTokenPrices(tokenIds: string[]) {
    try {
      const ret = await fetch(
        `${this.baseUrl}/api/prices?tokenIds=${tokenIds.join(',')}`
      )
      const data = await ret.json()
      return data.prices || {}
    } catch (error) {
      console.error('获取代币价格失败:', error)
      return {}
    }
  }

  /**
   * 根据合约地址获取代币价格
   */
  async getTokenPriceByContract(contractAddress: string) {
    try {
      const ret = await fetch(
        `${this.baseUrl}/api/prices?contractAddress=${encodeURIComponent(contractAddress)}`
      )
      const data = await ret.json()
      return data.price
    } catch (error) {
      console.error('根据合约获取代币价格失败:', error)
      return null
    }
  }

  /**
   * 获取账户ETH余额
   */
  async getAccountBalance(address: string, chainId: number | null) {
    try {
      const ret = await fetch(
        `${this.baseUrl}/api/balance?address=${encodeURIComponent(address)}&chainId=${chainId}`
      )
      const data = await ret.json()
      return data.balance || '0'
    } catch (error) {
      console.error('获取账户余额失败:', error)
      return '0'
    }
  }

  /**
   * 获取代币余额
   */
  async getTokenBalance(address: string, contractAddress: string, chainId: number | null) {
    try {
      const ret = await fetch(
        `${this.baseUrl}/api/balance?address=${encodeURIComponent(address)}&contractAddress=${encodeURIComponent(contractAddress)}&chainId=${chainId}`
      )
      const data = await ret.json()
      return data.balance || '0'
    } catch (error) {
      console.error('获取代币余额失败:', error)
      return '0'
    }
  }
}

// 导出客户端服务实例
export const clientApiService = new ClientApiService() 