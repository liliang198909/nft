const { network, ethers } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // 锁定/释放池只存在于源链
  if (!developmentChains.includes(network.name) && networkConfig[chainId]?.role !== "source") {
    log("非源链，跳过 NFTPoolLockAndRelease 部署");
    return;
  }

  // 依赖的 NFT 合约地址
  const nft = await get("MyToken");

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

  log("部署 NFTPoolLockAndRelease...");
  await deploy("NFTPoolLockAndRelease", {
    from: deployer,
    args: [router, link, nft.address],
    log: true,
  });
};

module.exports.tags = ["all", "pool-lock-and-release", "sourcechain"];
module.exports.dependencies = ["ccip-simulator", "nft"];
