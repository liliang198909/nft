const { getNamedAccounts, ethers, deployments } = require("hardhat")
const { expect } = require("chai")

let firstAccount
let ccipSimulator
let nft
let wnft
let nftPoolLockAndRelease
let nftPoolBurnAndMint
let ChainSelector


before(async function () {
    //prepare variables: contract, account
    const namedAccounts = await getNamedAccounts();
    firstAccount = namedAccounts.deployer;
    await deployments.fixture(["all"]);
    ccipSimulator = await ethers.getContract("CCIPLocalSimulator", firstAccount)
    nft = await ethers.getContract("MyToken", firstAccount)
    wnft = await ethers.getContract("WrappedMyToken", firstAccount)
    nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstAccount)
    nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstAccount)
    const config = await ccipSimulator.configuration()
    ChainSelector = config.chainSelector_
})

describe("source chain => dest chain tests", async function () {
    it("test if user can mint a nft from nft contract successfully", async function () {
        await nft.safeMint(firstAccount);
        const owner = await nft.ownerOf(0);
        expect(owner).to.equal(firstAccount);
    }
    )

    it("test if user can lock the nft in the pool and send ccip message on source chain",
        async function () {

            await nft.approve(nftPoolLockAndRelease.target, 0)
            await ccipSimulator.requestLinkFromFaucet(nftPoolLockAndRelease.target, ethers.parseEther("10"))
            await nftPoolLockAndRelease.lockAndSendNFT(0,
                firstAccount,
                ChainSelector,
                nftPoolBurnAndMint.target)
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(nftPoolLockAndRelease.target)

        }
    )
    it("test if user can get a wrapped nft in dest chain",

        async function () {
            const owner = await wnft.ownerOf(0)
            expect(owner).to.equal(firstAccount)

        }
    )
    // test if user can lock the nft in the pool and send ccip message on source chain
    // test if user can get a wrapped nft in dest chain
    // dest chain => source chain
    // test if user can burn the wnft and send ccip message on dest chain
    // test if user can have the nft unlocked on source chain
})
describe("dest chain => source chain tests", async function () {
    it("test if user can burn the wnft and send ccip =massage on dest chain",
        async function () {
            await wnft.approve(nftPoolBurnAndMint.target, 0)
            await ccipSimulator.requestLinkFromFaucet(nftPoolBurnAndMint.target, ethers.parseEther("10"))
            await nftPoolBurnAndMint.burnAndSendNFT(0,
                firstAccount,
                ChainSelector,
                nftPoolLockAndRelease.target)
                const totalSupply = await wnft.totalSupply()
                expect(totalSupply).to.equal(0)

        }
    )
   it ("test if user can have the nft unlocked on source chain",
        async function () {
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(firstAccount)
        }
    )

})






