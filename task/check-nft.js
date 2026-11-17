const { task } = require("hardhat/config");

task("check-nft").setAction(async (taskArgs, hre) => {
  const { ethers, deployments } = hre;

  // 从 deployments 里拿 MyToken 的地址（第二个参数必须是地址，不是账户名）
  const nftDeployment = await deployments.get("MyToken");
  const nft = await ethers.getContractAt("MyToken", nftDeployment.address);

  const totalSupply = await nft.totalSupply();
  console.log(`checking status of MyToken at ${nftDeployment.address}`);
  console.log(`totalSupply: ${totalSupply}`);

  // totalSupply 是 BigInt，循环变量也要用 BigInt
  for (let tokenId = 0n; tokenId < totalSupply; tokenId++) {
    const owner = await nft.ownerOf(tokenId);
    console.log(`tokenId: ${tokenId}, owner: ${owner}`);
  }
});

module.exports = {};
