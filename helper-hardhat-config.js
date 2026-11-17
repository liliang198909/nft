// 各网络的 Chainlink CCIP 相关地址与角色
// 地址来源：https://docs.chain.link/ccip/directory/mainnet（测试网请核对官方目录）
const networkConfig = {
  // Sepolia：作为源链，NFT 在这里被锁定
  11155111: {
    name: "sepolia",
    role: "source",
    router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
    link: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    chainSelector: 16015286601757825753n,
  },
  // Arbitrum Sepolia：作为目标链，wNFT 在这里被铸造
  421614: {
    name: "arbitrumSepolia",
    role: "dest",
    router: "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165",
    link: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
    chainSelector: 3478487238524512106n,
  },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = { networkConfig, developmentChains };
