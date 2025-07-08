import { EtherscanService } from "./etherscanService";
import { EtherscanStrategy } from "./EtherscanStrategy";
import { RpcService } from "./HardhatRpcStrategy";

export async function createStrategyOnClient(chainId: number): Promise<EtherscanService> {
  if (chainId === parseInt(process.env.NEXT_PUBLIC_HARDHAT_CHAIN_ID || '31337', 10)) {
    return new EtherscanService(new RpcService());
  }

  return new EtherscanService(new EtherscanStrategy());
}

