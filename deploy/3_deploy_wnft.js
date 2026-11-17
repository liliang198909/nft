const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // wNFT 只存在于目标链（本地网络两个角色都部署，方便测试）
  if (!developmentChains.includes(network.name) && networkConfig[chainId]?.role !== "dest") {
    log("非目标链，跳过 WrappedMyToken 部署");
    return;
  }

  log("部署 WrappedMyToken...");
  await deploy("WrappedMyToken", {
    from: deployer,
    args: ["WrappedMyNFT", "wMNFT"],
    log: true,
  });
};

module.exports.tags = ["all", "wnft", "destchain"];
