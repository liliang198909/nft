const { task } = require("hardhat/config")
const { networkConfig } = require("../test/help-hardhat-config.js")
const { deployments, getNamedAccounts, ethers } = require("hardhat")
task("burn-and-cross")
    .addOptionalParam("chainSelector", "chain Selector of dest chain")
    .addOptionalParam("receiver", "receiver address of dest chain")
    .addOptionalParam("tokenid", "token ID to becrossed chain")
    .setAction(async (taskArgs, hre) => {
        let chainSelector = taskArgs.chainSelector
        let receiver = taskArgs.receiver
        let tokenId = taskArgs.tokenid
        let { firstAccount } = await getNamedAccounts()
        if (taskArgs.chainSelector) {
            chainSelector = taskArgs.chainSelector
        } else {
            chainSelector = networkConfig[network.config.chainId].companionChainSelector
            console.log("chainSelector is not command ")
        }
        console.log(`chainSelector is ${chainSelector}`)
        if (taskArgs.receiver) {
            receiver = taskArgs.receiver
        } else {

            const nftPoolLockAndReleaseDeployment =
                await hre.companionNetworks["destChain"].deployments.get("NFTPoolLockAndRelease")
            receiver = nftPoolLockAndReleaseDeployment.address
            console.log("receiver is not set in command")
        }
        console.log(`receiver's address is ${receiver}`)

        //transfer link token to adress of the pool
        const linkTokenAddress = networkConfig[network.config.chainId].linkToken
        const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddress)
        const nftPoolBurnAndMint = await ethers.getContractAt("NFTPoolBurnAndMint", firstAccount)
        const transferTx = await linkToken.transfer(nftPoolBurnAndMint.target, ethers.parseEther("10"))
        await transferTx.wait(6)
        const balance = await linkToken.balanceOf(nftPoolBurnAndMint.target)
        console.log(`balance of pool is ${balance}`)
        //approve pool address to call tranferFrom
        const wnft = await ethers.getContractAt("WrappedMyToken", firstAccount)
        await wnft.approve(nftPoolBurnAndMint.target, tokenId)
        console.log(`approve success`)
        //call burnAndSendNFT
        const burnAndSendNFTtx = await nftPoolBurnAndMint.
            burnAndSendNFT(firstAccount, tokenId, receiver, chainSelector)
        console.log(`ccip transaction is sent,the tx hash is ${lockAndSendNFTtx.hash}`)

    })
module.exports = {}
