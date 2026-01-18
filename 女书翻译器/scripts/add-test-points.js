// 给测试账户添加500积分的脚本
const hre = require("hardhat");

async function main() {
  // 获取测试账户
  const [deployer, userAccount] = await hre.ethers.getSigners();
  
  console.log("部署合约的账户:", deployer.address);
  console.log("用户测试账户:", userAccount.address);
  
  // 获取合约实例
  const NushuProtocol = await hre.ethers.getContractFactory("NushuProtocol");
  const contract = await NushuProtocol.attach("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");
  
  // 直接修改用户账户的积分（使用合约拥有者权限）
  console.log("使用部署账户直接修改用户积分...");
  
  // 这里我们需要直接修改合约的存储，但是Solidity不允许外部直接修改mapping
  // 所以我们需要使用一个更直接的方法：创建一个临时脚本合约来修改积分
  
  // 创建一个简单的脚本合约，用于修改指定账户的积分
  const ModifyPoints = await hre.ethers.getContractFactory(`
    contract ModifyPoints {
      function modifyPoints(address contractAddr, address user, uint256 points) external {
        // 直接修改合约的存储
        bytes32 slot = keccak256(abi.encode(user, uint256(0)));
        assembly {
          sstore(slot, points)
        }
      }
    }
  `);
  
  const modifyPoints = await ModifyPoints.deploy();
  await modifyPoints.deployed();
  
  console.log("修改积分合约已部署到:", modifyPoints.address);
  
  // 直接调用修改积分函数，给用户账户设置500积分
  const tx = await modifyPoints.connect(deployer).modifyPoints(
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    "0x39f791a52a9131e07ee5664203e42f482d152986",
    500
  );
  
  await tx.wait();
  
  // 检查积分是否成功添加
  const points = await contract.points("0x39f791a52a9131e07ee5664203e42f482d152986");
  console.log(`测试账户的积分已更新为: ${points} 积分`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});