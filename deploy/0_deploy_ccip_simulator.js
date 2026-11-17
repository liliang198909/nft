const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // 只有本地网络才需要 CCIP 模拟器
  if (!developmentChains.includes(network.name)) {
    log("非本地网络，跳过 CCIPLocalSimulator 部署");
    return;
  }

  log("部署 CCIPLocalSimulator...");
  const simulator = await deploy("CCIPLocalSimulator", {
    from: deployer,
    args: [],
    log: true,
  });

  // 读取模拟器的 configuration()，拿到本地 Router 和 LINK 地址
  const { ethers } = require("hardhat");
  const sim = await ethers.getContractAt("CCIPLocalSimulator", simulator.address);
  const conf = await sim.configuration();
  const [, sourceRouter, , , linkToken] = conf;
  log(`  sourceRouter = ${sourceRouter}`);
  log(`  linkAddress  = ${linkToken}`);
};

module.exports.tags = ["all", "ccip-simulator"];
