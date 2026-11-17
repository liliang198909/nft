require("@chainlink/env-enc").config();
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("./task");

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const ARB_SEPOLIA_RPC_URL = process.env.ARB_SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
    },
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
      blockConfirmations: 6,
    },
    arbitrumSepolia: {
      url: ARB_SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 421614,
      blockConfirmations: 6,
      allowUnlimitedContractSize: true,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  // hardhat-deploy 跨网络配置：从源链任务查目标链的部署
  companionNetworks: {
    destChain: "arbitrumSepolia",
  },
  paths: {
    deploy: "deploy",
    deployments: "deployments",
  },
};
