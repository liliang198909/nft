developmentChains = ["local", "hardhat"]

const networkConfig = {
    11155111: {
        name: "sepolia",
        router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
        link: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        companionChainSelector: 16015286601757825753n,
    }

}
module.exports = {
    developmentChains,
    networkConfig
}