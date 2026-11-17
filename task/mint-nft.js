const { task } = require("hardhat/config");

task("mint-nft").setAction(async (taskArgs, hre) => {
    const { ethers, deployments } = hre;
    const { deployer } = await hre.getNamedAccounts();
    const signer = await ethers.getSigner(deployer);

    // 从 deployments 拿地址（第二个参数必须是地址，不是账户名）
    const nftDeploy = await deployments.get("MyToken");
    const nft = await ethers.getContractAt("MyToken", nftDeploy.address);

    console.log(`Minting NFT to ${signer.address}...`);
    const tx = await nft.safeMint(signer.address);
    await tx.wait(6);
    console.log(`NFT minted! Tx: ${tx.hash}`);

    const totalSupply = await nft.totalSupply();
    console.log(`Total supply now: ${totalSupply}`);
});

module.exports = {};
