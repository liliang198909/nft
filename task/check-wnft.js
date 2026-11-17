const { task } = require("hardhat/config");

task("check-wnft").setAction(async (taskArgs, hre) => {
const { firstAccount } = await getNamedAccounts()

  // 从 deployments 里拿 MyToken 的地址（第二个参数必须是地址，不是账户名）

  const wnft = await ethers.getContractAt("WrappedMyToken", firstAccount);

  const totalSupply = await wnft.totalSupply();

  console.log("checking status of MyToken");

  // totalSupply 是 BigInt，循环变量也要用 BigInt
  for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
    const owner = await wnft.ownerOf(tokenId);
    console.log(`tokenId: ${tokenId}, owner: ${owner}`);
  }
});

module.exports = {};
