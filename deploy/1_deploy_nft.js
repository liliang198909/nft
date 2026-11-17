const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // 目标链不需要原始 NFT，只有源链和本地网络部署
  if (!developmentChains.includes(network.name) && networkConfig[chainId]?.role !== "source") {
    log("非源链，跳过 MyToken 部署");
    return;
  }

  log("部署 MyToken...");
  await deploy("MyToken", {
    from: deployer,
    args: ["MyNFT", "MNFT"],
    log: true,
  });
};

module.exports.tags = ["all", "nft", "sourcechain"];
