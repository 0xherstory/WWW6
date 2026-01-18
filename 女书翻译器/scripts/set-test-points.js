// 给测试账户设置500积分的脚本
const hre = require("hardhat");

async function main() {
  // 获取合约实例
  const NushuProtocol = await hre.ethers.getContractFactory("NushuProtocol");
  const contract = await NushuProtocol.attach("0x8A791620dd6260079BF849Dc5567aDC3F2FdC318");
  
  // 测试账户地址（用户实际使用的账户）
  const testAccount = "0x39f791a52a9131e07ee5664203e42f482d152986";
  
  console.log("为测试账户设置500积分...");
  
  // 使用新添加的setPoints函数直接设置积分
  const tx = await contract.setPoints(testAccount, 500);
  
  await tx.wait();
  
  // 检查积分是否成功设置
  const points = await contract.points(testAccount);
  console.log(`测试账户 ${testAccount} 的积分已设置为: ${points} 积分`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});