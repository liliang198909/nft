const { network, ethers } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // 销毁/铸造池只存在于目标链
  if (!developmentChains.includes(network.name) && networkConfig[chainId]?.role !== "dest") {
    log("非目标链，跳过 NFTPoolBurnAndMint 部署");
    return;
  }

  // 依赖的 wNFT 合约地址
  const wnft = await get("WrappedMyToken");

  // 取 Router 和 LINK 地址：本地用模拟器，真实链用配置
  let router;
  let link;
  if (developmentChains.includes(network.name)) {
    const simulator = await get("CCIPLocalSimulator");
    const sim = await ethers.getContractAt("CCIPLocalSimulator", simulator.address);
    const conf = await sim.configuration();
    [, router, , , link] = conf;
  } else {
    ({ router, link } = networkConfig[chainId]);
  }

  log("部署 NFTPoolBurnAndMint...");
  const burnPool = await deploy("NFTPoolBurnAndMint", {
    from: deployer,
    args: [router, link, wnft.address],
    log: true,
  });

  // 池子需要拥有 wNFT，才能调用 mintTokenWithSpecificTokenId
  const wnftContract = await ethers.getContractAt("WrappedMyToken", wnft.address);
  const currentOwner = await wnftContract.owner();
  if (currentOwner.toLowerCase() !== burnPool.address.toLowerCase()) {
    const tx = await wnftContract.transferOwnership(burnPool.address);
    await tx.wait();
    log(`  WNFT 所有权已转给 NFTPoolBurnAndMint (${burnPool.address})`);
  }
};

module.exports.tags = ["all", "pool-burn-and-mint", "destchain"];
module.exports.dependencies = ["ccip-simulator", "wnft"];
