require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: "http://127.0.0.1:9545"
      // 移除accounts配置，使用Hardhat内置的20个测试账户
    }
  }
};

// Only add Sepolia network if both RPC URL and private key are provided
if (process.env.SEPOLIA_RPC_URL && process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "YOUR_PRIVATE_KEY") {
  config.networks.sepolia = {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY]
  };
}

module.exports = config;
