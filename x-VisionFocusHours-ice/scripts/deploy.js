const hre = require("hardhat");

async function main() {
  console.log("开始部署 VisionFocusHoursNFT 合约...\n");

  // 获取部署账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("部署账户:", deployer.address);
  console.log("账户余额:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH\n");

  // 部署参数
  const mintPrice = hre.ethers.parseEther("0.01"); // 0.01 ETH
  const maxSupply = 0; // 无限制
  const maxMintsPerUserPerYear = 1; // 每年每个用户最多铸造1个
  const treasury = deployer.address; // 收入接收地址（可以改为多签钱包）
  const royaltyBps = 250; // 2.5% 版税

  console.log("部署参数:");
  console.log("  铸造价格:", hre.ethers.formatEther(mintPrice), "ETH");
  console.log("  最大供应量:", maxSupply === 0 ? "无限制" : maxSupply.toString());
  console.log("  每用户每年最大铸造数:", maxMintsPerUserPerYear);
  console.log("  收入接收地址:", treasury);
  console.log("  版税比例:", royaltyBps / 100, "%\n");

  // 部署合约
  console.log("正在部署合约...");
  const VisionFocusHoursNFT = await hre.ethers.getContractFactory("VisionFocusHoursNFT");
  const nftContract = await VisionFocusHoursNFT.deploy(
    mintPrice,
    maxSupply,
    maxMintsPerUserPerYear,
    treasury,
    royaltyBps
  );

  await nftContract.waitForDeployment();
  const contractAddress = await nftContract.getAddress();

  console.log("✅ 合约部署成功!");
  console.log("合约地址:", contractAddress);
  console.log("网络:", hre.network.name);
  console.log("链ID:", (await hre.ethers.provider.getNetwork()).chainId, "\n");

  // 等待区块确认
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("等待区块确认...");
    await nftContract.deploymentTransaction().wait(5);
    console.log("✅ 区块确认完成\n");
  }

  // 验证合约（如果支持）
  if (hre.network.name === "sepolia" || hre.network.name === "mainnet") {
    try {
      console.log("验证合约...");
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [
          mintPrice,
          maxSupply,
          maxMintsPerUserPerYear,
          treasury,
          royaltyBps
        ],
      });
      console.log("✅ 合约验证成功\n");
    } catch (error) {
      console.log("⚠️  合约验证失败:", error.message);
      console.log("可以稍后手动验证\n");
    }
  }

  // 保存部署信息
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    constructorArgs: {
      mintPrice: mintPrice.toString(),
      maxSupply: maxSupply.toString(),
      maxMintsPerUserPerYear: maxMintsPerUserPerYear.toString(),
      treasury: treasury,
      royaltyBps: royaltyBps.toString()
    }
  };

  console.log("部署信息:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("\n✅ 部署完成!");

  // 提示
  console.log("\n📝 下一步:");
  console.log("1. 将合约地址添加到前端配置");
  console.log("2. 更新 .env 文件中的 CONTRACT_ADDRESS");
  console.log("3. 在前端测试 NFT 铸造功能");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("部署失败:", error);
    process.exit(1);
  });

