const { task } = require("hardhat/config");

task("check-wnft").setAction(async (taskArgs, hre) => {
    const { ethers, deployments } = hre;

    const wnftDeploy = await deployments.get("WrappedMyToken");
    const wnft = await ethers.getContractAt("WrappedMyToken", wnftDeploy.address);

    const totalSupply = await wnft.totalSupply();
    console.log(`Checking WrappedMyToken at ${wnftDeploy.address}`);
    console.log(`Total supply: ${totalSupply}`);

    // totalSupply 是 BigInt，循环变量也要用 BigInt
    for (let tokenId = 0n; tokenId < totalSupply; tokenId++) {
        const owner = await wnft.ownerOf(tokenId);
        console.log(`  tokenId: ${tokenId}, owner: ${owner}`);
    }
});

module.exports = {};
