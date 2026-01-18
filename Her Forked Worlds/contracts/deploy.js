// 智能合约部署脚本
// 使用 Hardhat 部署到以太坊测试网或主网

const hre = require("hardhat");

async function main() {
  console.log("开始部署分叉叙事宇宙智能合约...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("部署账户:", deployer.address);
  console.log("账户余额:", (await deployer.getBalance()).toString(), "wei\n");

  // ========== 1. 部署版权注册合约 ==========
  console.log("📝 部署 CopyrightRegistry 合约...");
  const CopyrightRegistry = await hre.ethers.getContractFactory("CopyrightRegistry");
  const copyrightRegistry = await CopyrightRegistry.deploy();
  await copyrightRegistry.waitForDeployment();
  const copyrightAddress = await copyrightRegistry.getAddress();
  console.log("✅ CopyrightRegistry 部署成功:", copyrightAddress, "\n");

  // ========== 2. 部署章节NFT合约 ==========
  console.log("🎨 部署 StoryChapterNFT 合约...");
  const platformWallet = deployer.address; // 可以修改为专门的平台钱包地址
  const StoryChapterNFT = await hre.ethers.getContractFactory("StoryChapterNFT");
  const storyChapterNFT = await StoryChapterNFT.deploy(platformWallet);
  await storyChapterNFT.waitForDeployment();
  const nftAddress = await storyChapterNFT.getAddress();
  console.log("✅ StoryChapterNFT 部署成功:", nftAddress);
  console.log("   平台钱包:", platformWallet, "\n");

  // ========== 3. 部署收益分配合约 ==========
  console.log("💰 部署 RevenueSharing 合约...");
  // 注意：如果你有平台Token，替换下面的地址
  const platformTokenAddress = "0x0000000000000000000000000000000000000000";
  const RevenueSharing = await hre.ethers.getContractFactory("RevenueSharing");
  const revenueSharing = await RevenueSharing.deploy(platformTokenAddress);
  await revenueSharing.waitForDeployment();
  const revenueAddress = await revenueSharing.getAddress();
  console.log("✅ RevenueSharing 部署成功:", revenueAddress, "\n");

  // ========== 部署总结 ==========
  console.log("=" .repeat(60));
  console.log("🎉 所有合约部署完成！");
  console.log("=" .repeat(60));
  console.log("\n📋 合约地址汇总：");
  console.log("-" .repeat(60));
  console.log("CopyrightRegistry  :", copyrightAddress);
  console.log("StoryChapterNFT    :", nftAddress);
  console.log("RevenueSharing     :", revenueAddress);
  console.log("-" .repeat(60));

  // ========== 生成前端配置 ==========
  const config = {
    network: hre.network.name,
    contracts: {
      CopyrightRegistry: copyrightAddress,
      StoryChapterNFT: nftAddress,
      RevenueSharing: revenueAddress,
    },
    deployer: deployer.address,
    platformWallet: platformWallet,
    deployedAt: new Date().toISOString(),
  };

  console.log("\n📄 前端配置（复制到你的config.js）：");
  console.log("-" .repeat(60));
  console.log(JSON.stringify(config, null, 2));
  console.log("-" .repeat(60));

  // ========== 验证合约（可选） ==========
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ 等待区块确认后验证合约...");
    console.log("请手动运行以下命令验证合约：");
    console.log(`npx hardhat verify --network ${hre.network.name} ${copyrightAddress}`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${nftAddress} ${platformWallet}`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${revenueAddress} ${platformTokenAddress}`);
  }

  console.log("\n✨ 部署完成！现在可以开始使用合约了。");
}

// 错误处理
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ 部署失败:");
    console.error(error);
    process.exit(1);
  });
