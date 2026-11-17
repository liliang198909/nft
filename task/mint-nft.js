const { task } = require("hardhat/config")
task("mint-nft").setAction(async (taskArgs, hre) => {
    const{firstAccount} = await getNamedAccounts()
    const nft = await ethers.getContractAt("MyToken", firstAccount)
    console.log("minting NFT to firstAccount")
    await nft.safeMint(firstAccount)
    const mintTx=await nft.safeMint(firstAccount)
    await mintTx.wait(6)
    console.log("NFT minted to firstAccount")
})
module.exports={
    mintNFT:task("mint-nft")
}