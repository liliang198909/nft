// 这个文件和根目录的 helper-hardhat-config.js 保持同步
// 所有 task 文件从这里 import，deploy 文件从根目录 import
const networkConfig = {
    11155111: {
        name: "sepolia",
        role: "source",
        router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
        link: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        chainSelector: 16015286601757825753n,
        // 源链发往目标链，所以 companionChainSelector = ArbSepolia 的 selector
        companionChainSelector: 3478487238524512106n,
    },
    421614: {
        name: "arbitrumSepolia",
        role: "dest",
        router: "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165",
        link: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
        linkToken: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
        chainSelector: 3478487238524512106n,
        // 目标链发回源链，companionChainSelector = Sepolia 的 selector
        companionChainSelector: 16015286601757825753n,
    },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
    developmentChains,
    networkConfig
};
