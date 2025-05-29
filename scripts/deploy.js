const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  // Deploy DeFiToken
  console.log("\nDeploying DeFiToken...");
  const DeFiToken = await ethers.getContractFactory("DeFiToken");
  const defiToken = await DeFiToken.deploy(
    "DeFi Dashboard Token",
    "DDT",
    deployer.address
  );
  
  await defiToken.waitForDeployment();
  const defiTokenAddress = await defiToken.getAddress();
  
  console.log("DeFiToken deployed to:", defiTokenAddress);
  
  // Verify deployment
  const tokenInfo = await defiToken.getTokenInfo();
  console.log("\nToken Information:");
  console.log("Name:", tokenInfo.tokenName);
  console.log("Symbol:", tokenInfo.tokenSymbol);
  console.log("Decimals:", tokenInfo.tokenDecimals.toString());
  console.log("Total Supply:", ethers.formatEther(tokenInfo.tokenTotalSupply));
  console.log("Max Supply:", ethers.formatEther(tokenInfo.tokenMaxSupply));
  
  // Save deployment info
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address,
    contracts: {
      DeFiToken: {
        address: defiTokenAddress,
        name: tokenInfo.tokenName,
        symbol: tokenInfo.tokenSymbol,
        decimals: tokenInfo.tokenDecimals.toString(),
        totalSupply: ethers.formatEther(tokenInfo.tokenTotalSupply),
        maxSupply: ethers.formatEther(tokenInfo.tokenMaxSupply)
      }
    },
    timestamp: new Date().toISOString()
  };
  
  console.log("\nDeployment completed successfully!");
  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });