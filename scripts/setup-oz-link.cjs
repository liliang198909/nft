// Chainlink 的 CCIP 源码使用 Foundry 风格的版本化路径（@openzeppelin/contracts@5.3.0/），
// Hardhat 默认解析不到，这里建立软链把它指向 Chainlink 已经装好的独立副本。
const fs = require("fs");
const path = require("path");

const ozDir = path.join(__dirname, "..", "node_modules", "@openzeppelin");
const linkPath = path.join(ozDir, "contracts@5.3.0");
const target = "contracts-5.3.0";

if (!fs.existsSync(path.join(ozDir, target))) {
  console.log("[setup-oz-link] 未找到 " + target + "，跳过");
  process.exit(0);
}

fs.rmSync(linkPath, { recursive: true, force: true });
fs.symlinkSync(target, linkPath, "dir");
console.log("[setup-oz-link] @openzeppelin/contracts@5.3.0 -> " + target + " 已就绪");
