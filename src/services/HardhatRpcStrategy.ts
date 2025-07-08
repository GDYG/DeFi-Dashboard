import { HttpsProxyAgent } from "https-proxy-agent"
import { IEthProviderStrategy } from "./IEthProviderStrategy"
import { API_ENDPOINTS } from "@/utils/constants"

/**
 * RPC服务
*/
export class RpcService implements IEthProviderStrategy {
  private chainId: number

  constructor(chainId?: number) {
    this.chainId = chainId || parseInt(process.env.NEXT_PUBLIC_HARDHAT_CHAIN_ID || '31337', 10)
  }

  private getRpcUrl(chainId: number): string {
    switch (chainId) {
      case 31337: // Hardhat
        return API_ENDPOINTS.LOCAL
      case 11155111: // Sepolia
        return `${API_ENDPOINTS.ALCHEMY_SEPOLIA}/${process.env.ALCHEMY_API_KEY}`
      case 1: // Mainnet
        return `${API_ENDPOINTS.ALCHEMY_MAINNET}/${process.env.ALCHEMY_API_KEY}`
      default:
        return API_ENDPOINTS.LOCAL
    }
  }

  private async callRpc(method: string, params: any[]): Promise<any> {
    const rpcUrl = this.getRpcUrl(this.chainId)

     // 添加代理配置，和ApiClient保持一致
    const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:7890');
    const _rest = process.env.NODE_ENV === 'production' ? {} : {
      agent: proxyAgent,
    }
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: 1,
      }),
      ..._rest, // 添加代理配置
    })

    const data = await response.json()
    
    if (data?.error) throw new Error(data?.error?.message)
    return data?.result;
  }

  // 获取账户余额
  async getAccountBalance(address: string): Promise<string> {
    const balance = await this.callRpc('eth_getBalance', [address, 'latest'])
    return this.hexWeiToEth(balance);
  }

  // 获取代币余额
  async getTokenBalance(address: string, contractAddress: string): Promise<string> {
    const data = '0x70a08231' + address.slice(2).padStart(64, '0')
    return this.callRpc('eth_call', [{ to: contractAddress, data }, 'latest'])
  }

  // 获取账户交易记录
  async getAccountTransactions(address: string, page: number, offset: number): Promise<any[]> {
    try {
      // 1. 获取最新区块号
      const latestBlockHex = await this.callRpc('eth_blockNumber', [])
      const latestBlock = parseInt(latestBlockHex, 16)
      
      console.log('🔍 最新区块:', latestBlock)
      
      const transactions = []
      const targetAddress = address.toLowerCase()
      
      // 2. 遍历最近的区块（从最新往前查）
      for (let i = latestBlock; i >= Math.max(0, latestBlock - 100) && transactions.length < offset; i--) {
        const blockHex = '0x' + i.toString(16)
        
        // 3. 获取区块详情（包含交易）
        const block = await this.callRpc('eth_getBlockByNumber', [blockHex, true])
        
        if (block && block.transactions) {
          // 4. 过滤与目标地址相关的交易
          for (const tx of block.transactions) {
            if (tx.from?.toLowerCase() === targetAddress || tx.to?.toLowerCase() === targetAddress) {
              transactions.push({
                ...this.transferToEtherscanTransaction(tx),
                blockNumber: parseInt(block.number, 16),
                timestamp: parseInt(block.timestamp, 16),
              })
            }
          }
        }
      }
      
      const startPageIndex = (page - 1) * offset;
      return transactions.sort((a, b) => b.timestamp - a.timestamp).slice(startPageIndex, startPageIndex + offset)
    } catch (error) {
      console.error('获取本地交易记录失败:', error)
      return []
    }
  }

  // 获取代币的交易记录
  async getTokenTransfers(address: string,  page: number, offset: number, contractAddress?: string): Promise<any[]> {
    try {
      // ERC20 Transfer事件签名: Transfer(address,address,uint256)
      const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      
      const params: Record<string, any> = {
        fromBlock: '0x0',
        toBlock: 'latest',
        topics: [
          transferTopic,
          null, // from地址 (任意)
          null  // to地址 (任意)
        ]
      }

      // 如果指定了代币合约地址
      if (contractAddress) {
        params.address = contractAddress
      }

      const logs = await this.callRpc('eth_getLogs', [params])
      
      const targetAddress = address.toLowerCase()
      const transfers = []

      for (const log of logs) {
        // 解析Transfer事件
        const fromAddress = '0x' + log.topics[1].slice(26) // 去掉前面的0
        const toAddress = '0x' + log.topics[2].slice(26)
        
        if (fromAddress === targetAddress || toAddress === targetAddress) {
          transfers.push({
            ...this.transferToEtherscanTransaction(log),
            contractAddress: log.address,
            blockNumber: parseInt(log.blockNumber, 16),
            timestamp: parseInt(log?.timestamp, 16),
          })
        }
      }

      const startPageIndex = (page - 1) * offset;
      return transfers.sort((a, b) => b.timestamp - a.timestamp).slice(startPageIndex, startPageIndex + offset)
    } catch (error) {
      console.error('获取代币转账记录失败:', error)
      return []
    }
  }

  // 转换为EtherscanTransaction格式 
  async transferToEtherscanTransaction(localTxs: any[]) { 
     return localTxs.map(tx => ({
        hash: tx?.hash,
        from: tx?.from,
        to: tx?.to,
        value: tx?.value,
        gasPrice: tx?.gasPrice,
        gas: tx?.gas,
        isError: '0' // 本地网络假设都成功
     }))
  }

  hexWeiToEth(hexWei: string | undefined) {
    // return ethers.formatEther(hexWei); // 转换为 ETH 单位
    return BigInt(hexWei || '0').toString();
  }
}