// 列出所有Hardhat测试账户的脚本
const hre = require("hardhat");

async function main() {
  // 获取所有测试账户
  const accounts = await hre.ethers.getSigners();
  
  console.log("测试账户列表：");
  console.log("=" .repeat(80));
  console.log("账户地址\t\t\t\t\t\t私钥");
  console.log("=" .repeat(80));
  
  // 遍历并输出每个账户的地址和私钥
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const address = await account.getAddress();
    const privateKey = await account.getPrivateKey();
    
    console.log(`${address}  ${privateKey}`);
  }
  
  console.log("=" .repeat(80));
  console.log(`共找到 ${accounts.length} 个测试账户`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});