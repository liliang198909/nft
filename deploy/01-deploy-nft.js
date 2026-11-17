const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (developmentChains.includes(network.name)) {
    log("本地网络：部署 CCIPLocalSimulator + NFT + Pool");

    // 先部署模拟器，拿到 Router / LINK 地址
    const simulator = await deploy("CCIPLocalSimulator", {
      from: deployer,
      args: [],
      log: true,
    });
    // 读取 configuration() 获取 Router 和 LINK 地址
    const { ethers } = require("hardhat");
    const simAddr = simulator.address;
    const sim = await ethers.getContractAt("CCIPLocalSimulator", simAddr);
    const conf = await sim.configuration();
    // configuration 返回顺序：
    // (uint64 chainSelector, IRouterClient sourceRouter, IRouterClient destRouter,
    //  WETH9 wrappedNative, LinkToken linkToken, BurnMintERC677Helper ccipBnM, BurnMintERC677Helper ccipLnM)
    const [, sourceRouter, , , linkToken] = conf;
    log(`  sourceRouter  = ${sourceRouter}`);
    log(`  linkAddress   = ${linkToken}`);

    // 部署两个 NFT
    const nft = await deploy("MyToken", {
      from: deployer,
      args: ["MyNFT", "MNFT"],
      log: true,
    });
    const wnft = await deploy("WrappedMyToken", {
      from: deployer,
      args: ["WrappedMyNFT", "wMNFT"],
      log: true,
    });

    // 部署两个池，共用同一个 Router 和 LINK
    await deploy("NFTPoolLockAndRelease", {
      from: deployer,
      args: [sourceRouter, linkToken, nft.address],
      log: true,
    });
    const burnPool = await deploy("NFTPoolBurnAndMint", {
      from: deployer,
      args: [sourceRouter, linkToken, wnft.address],
      log: true,
    });

    // BurnAndMint 池需要拥有 WrappedMyToken，才能调用 mintTokenWithSpecificTokenId
    const wnftContract = await ethers.getContractAt("WrappedMyToken", wnft.address);
    await wnftContract.transferOwnership(burnPool.address);
    log(`  WNFT 所有权已转给 NFTPoolBurnAndMint`);

    return;
  }

  const cfg = networkConfig[chainId];
  if (!cfg) {
    throw new Error(`未配置 chainId ${chainId} 的 CCIP 地址，请在 helper-hardhat-config.js 中补充`);
  }

  if (cfg.role === "source") {
    // 源链：NFT + 锁定/释放池
    const nft = await deploy("MyToken", {
      from: deployer,
      args: ["MyNFT", "MNFT"],
      log: true,
    });
    await deploy("NFTPoolLockAndRelease", {
      from: deployer,
      args: [cfg.router, cfg.link, nft.address],
      log: true,
    });
  } else {
    // 目标链：wNFT + 销毁/铸造池
    const wnft = await deploy("WrappedMyToken", {
      from: deployer,
      args: ["WrappedMyNFT", "wMNFT"],
      log: true,
    });
    await deploy("NFTPoolBurnAndMint", {
      from: deployer,
      args: [cfg.router, cfg.link, wnft.address],
      log: true,
    });
  }
};

module.exports.tags = ["all", "nft"];
