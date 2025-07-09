import { API_ENDPOINTS } from "@/utils/constants";
import { EtherscanService } from "./etherscanService";
import { EtherscanStrategy } from "./EtherscanStrategy";
import { RpcService } from "./HardhatRpcStrategy";

enum ETHERSCAN_NETWORK { 
  MAINNET = 'ETHERSCAN_MAINNET',
  SEPOLIA = 'ETHERSCAN_SEPOLIA',
}

export async function createStrategyOnClient(chainId: number): Promise<EtherscanService> {
  if (chainId === parseInt(process.env.NEXT_PUBLIC_HARDHAT_CHAIN_ID || '31337', 10)) {
    return new EtherscanService(new RpcService());
  }

  const network = chainId === 11155111 ? 'SEPOLIA' : 'MAINNET'
  return new EtherscanService(new EtherscanStrategy(API_ENDPOINTS[ETHERSCAN_NETWORK[network]]));
}

