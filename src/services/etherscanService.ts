import { EtherscanTokenTransfer, EtherscanTransaction, IEthProviderStrategy } from './IEthProviderStrategy'

/**
 * Etherscan API 服务
 * 🔐 仅用于服务端 - 包含敏感API密钥
 */
export class EtherscanService implements IEthProviderStrategy {
  constructor(private strategy: IEthProviderStrategy) {}

  /**
   * 获取账户ETH余额
   */
  async getAccountBalance(address: string): Promise<string> { 
    return this.strategy.getAccountBalance(address)
  }

  /**
   * 获取账户ERC20代币余额
   */
  async getTokenBalance(address: string, contractAddress: string): Promise<string> { 
    return this.strategy.getTokenBalance(address, contractAddress)
  }

  /**
   * 获取账户交易记录
   */
  async getAccountTransactions(
    address: string,
    page: number = 1,
    offset: number = 10
  ): Promise<EtherscanTransaction[]> { 
    return this.strategy?.getAccountTransactions(address, page, offset)
  }

  /**
   * 获取ERC20代币转账记录
   */
  async getTokenTransfers(
    address: string,
    page: number = 1,
    offset: number = 10,
    contractAddress?: string // 代币地址
  ): Promise<EtherscanTokenTransfer[]> { 
    return this.strategy.getTokenTransfers(address, page, offset, contractAddress)
  }
}