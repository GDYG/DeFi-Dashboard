// API响应类型定义
export interface EtherscanResponse<T = any> {
  status: string
  message: string
  result: T
}

export interface EtherscanTransaction {
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

export interface EtherscanTokenTransfer {
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

export interface IEthProviderStrategy {
  getAccountBalance(address: string): Promise<string>
  getAccountTransactions(address: string, page: number, offset: number): Promise<EtherscanTransaction[]>
  getTokenTransfers(address: string, page: number, offset: number, contractAddress?: string): Promise<EtherscanTokenTransfer[]>
  getTokenBalance(address: string, contractAddress: string): Promise<string>
}