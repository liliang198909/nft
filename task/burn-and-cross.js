const { task } = require("hardhat/config");
const { networkConfig, developmentChains } = require("../test/help-hardhat-config.js");

task("burn-and-cross")
    .addOptionalParam("chainSelector", "chain Selector of dest chain")
    .addOptionalParam("receiver", "receiver address of dest chain")
    .addOptionalParam("tokenid", "token ID to be crossed chain")
    .setAction(async (taskArgs, hre) => {
        const { ethers, deployments } = hre;
        const { deployer } = await hre.getNamedAccounts();
        const signer = await ethers.getSigner(deployer);
        const chainId = hre.network.config.chainId;

        // chainSelector：命令行优先 → 否则取配置里的 companionChainSelector
        let chainSelector = taskArgs.chainSelector
            ? taskArgs.chainSelector
            : networkConfig[chainId].companionChainSelector;
        console.log(`chainSelector: ${chainSelector}`);

        // receiver：命令行优先 → 否则从 companionNetworks 拿目标链的 Pool 地址
        let receiver = taskArgs.receiver;
        if (!receiver) {
            if (developmentChains.includes(hre.network.name)) {
                // 本地测试：两个池在同一链上
                const lockPool = await deployments.get("NFTPoolLockAndRelease");
                receiver = lockPool.address;
            } else {
                // 真实链：从 companionNetworks 查目标链部署
                const destDeployments = hre.companionNetworks["destChain"].deployments;
                const lockPool = await destDeployments.get("NFTPoolLockAndRelease");
                receiver = lockPool.address;
            }
            console.log(`receiver (auto): ${receiver}`);
        }

        // LINK 代币地址
        const linkTokenAddress = networkConfig[chainId].linkToken;
        const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddress);

        // 部署销毁铸造池
        const burnPoolDeploy = await deployments.get("NFTPoolBurnAndMint");
        const nftPoolBurnAndMint = await ethers.getContractAt(
            "NFTPoolBurnAndMint",
            burnPoolDeploy.address
        );

        // 给池子转 LINK 支付 CCIP 费用
        const transferTx = await linkToken.transfer(
            nftPoolBurnAndMint.target,
            ethers.parseEther("10")
        );
        await transferTx.wait(6);
        const balance = await linkToken.balanceOf(nftPoolBurnAndMint.target);
        console.log(`Pool LINK balance: ${balance}`);

        // approve 池子可以 transferFrom 你的 wNFT
        const wnftDeploy = await deployments.get("WrappedMyToken");
        const wnft = await ethers.getContractAt("WrappedMyToken", wnftDeploy.address);
        const tokenId = BigInt(taskArgs.tokenid ?? 0);
        await wnft.approve(nftPoolBurnAndMint.target, tokenId);
        console.log(`Approved pool for tokenId ${tokenId}`);

        // 发起跨链：注意参数顺序 (tokenId, newOwner, chainSelector, receiver)
        const tx = await nftPoolBurnAndMint.burnAndSendNFT(
            tokenId,
            signer.address,
            chainSelector,
            receiver
        );
        console.log(`CCIP tx sent: ${tx.hash}`);
    });

module.exports = {};
