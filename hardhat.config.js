// 默认只支持加载.env文件，设置同时加载.env.local文件
require("./loadEnv").loadEnvFiles();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: parseInt(process.env.NEXT_PUBLIC_HARDHAT_CHAIN_ID || "31337", 10)
    },
    localhost: {
      url: process.env.NEXT_PUBLIC_LOCALHOST,
      chainId: parseInt(process.env.NEXT_PUBLIC_HARDHAT_CHAIN_ID || "31337", 10)
    },
    sepolia: {
      url: process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA + process.env.ALCHEMY_API_KEY,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    mainnet: {
      url: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET + process.env.ALCHEMY_API_KEY,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}; 