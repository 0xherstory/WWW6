# 分叉叙事宇宙 - 智能合约系统

## 📚 合约概述

本项目包含3个核心智能合约，实现了Web3小说平台的完整功能：

### 1. StoryChapterNFT.sol - 章节NFT合约 ⭐
**主要功能：**
- ✅ 章节铸造为NFT（ERC721）
- ✅ 加密内容存储与访问控制
- ✅ NFT购买与交易
- ✅ 创作者永久版税（二次销售分成）
- ✅ 时间锁定机制（早鸟优惠）
- ✅ 打赏系统

**核心方法：**
```solidity
// 发布章节
publishChapter(storyId, title, contentHash, encryptedIPFS, encryptedKey, price, unlockTime, royalty, tokenURI)

// 购买章节NFT
purchaseChapter(tokenId) payable

// 获取解密密钥（需要权限）
getDecryptionKey(tokenId)

// 检查访问权限
hasAccessToChapter(tokenId, user)

// 打赏章节
tipChapter(tokenId) payable
```

### 2. CopyrightRegistry.sol - 版权注册合约 📝
**主要功能：**
- ✅ 内容哈希上链（不可篡改的时间戳证明）
- ✅ 版权查询与验证
- ✅ 版权转让
- ✅ 抄袭检测（基于注册时间）

**核心方法：**
```solidity
// 注册版权
registerCopyright(contentHash, title, ipfsHash, licenseType)

// 验证版权归属
verifyCopyrightOwnership(contentHash, claimedOwner)

// 检查抄袭
checkPlagiarism(originalHash, suspectedHash)

// 获取版权信息
getCopyright(contentHash)
```

### 3. RevenueSharing.sol - 收益分配合约 💰
**主要功能：**
- ✅ 奖励池管理
- ✅ 基于贡献度的收益分配
- ✅ 创作者激励机制
- ✅ 灵活的权重配置

**核心方法：**
```solidity
// 充值奖励池
fundRewardPool() payable

// 记录贡献
recordContribution(creator, readCount, likeCount, sales, tips)

// 分配收益
distributeRevenue(creators[])

// 领取收益
claimRevenue(creator)

// 预估收益
estimateRevenue(creator)
```

---

## 🔐 加密与访问控制流程

### 内容发布流程：

```
1. 前端：创作者写作内容
   ↓
2. 前端：生成AES-256密钥
   key = generateRandomKey()
   ↓
3. 前端：加密内容
   encrypted = AES.encrypt(content, key)
   ↓
4. 前端：计算原始内容哈希（版权证明）
   contentHash = keccak256(content)
   ↓
5. 前端：上传加密内容到IPFS
   ipfsHash = uploadToIPFS(encrypted)
   ↓
6. 前端：用创作者公钥加密AES密钥
   encryptedKey = RSA.encrypt(key, creatorPublicKey)
   ↓
7. 智能合约：发布章节NFT
   publishChapter(
     storyId,
     title,
     contentHash,      // 版权证明
     ipfsHash,         // 加密内容位置
     encryptedKey,     // 加密的密钥
     price,
     unlockTime,       // 48小时后免费
     royalty,
     tokenURI
   )
   ↓
8. 链上记录：
   - NFT铸造给创作者
   - 版权信息上链
   - 加密密钥存储在合约中
```

### 内容阅读流程：

```
1. 前端：检查用户访问权限
   hasAccess = await contract.hasAccessToChapter(tokenId, userAddress)
   ↓
2. 如果无权限：
   - 显示"购买NFT"按钮
   - 或显示倒计时（距离免费解锁还有XX小时）
   ↓
3. 如果有权限：
   - 从合约获取加密的密钥
     encryptedKey = await contract.getDecryptionKey(tokenId)
   ↓
4. 前端：用用户私钥解密AES密钥
   key = RSA.decrypt(encryptedKey, userPrivateKey)
   ↓
5. 前端：从IPFS获取加密内容
   encrypted = await fetchFromIPFS(ipfsHash)
   ↓
6. 前端：解密内容
   content = AES.decrypt(encrypted, key)
   ↓
7. 前端：显示内容给用户
```

---

## 💡 部署指南

### 环境要求：
- Node.js >= 16.x
- Hardhat 或 Truffle
- MetaMask 钱包

### 安装依赖：

```bash
npm install --save-dev hardhat
npm install @openzeppelin/contracts
npm install @nomiclabs/hardhat-ethers ethers
```

### 部署脚本：

创建 `scripts/deploy.js`：

```javascript
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("部署账户:", deployer.address);

  // 1. 部署版权注册合约
  const CopyrightRegistry = await hre.ethers.getContractFactory("CopyrightRegistry");
  const copyrightRegistry = await CopyrightRegistry.deploy();
  await copyrightRegistry.waitForDeployment();
  console.log("CopyrightRegistry deployed to:", await copyrightRegistry.getAddress());

  // 2. 部署章节NFT合约
  const platformWallet = deployer.address; // 平台钱包
  const StoryChapterNFT = await hre.ethers.getContractFactory("StoryChapterNFT");
  const storyChapterNFT = await StoryChapterNFT.deploy(platformWallet);
  await storyChapterNFT.waitForDeployment();
  console.log("StoryChapterNFT deployed to:", await storyChapterNFT.getAddress());

  // 3. 部署收益分配合约
  const platformTokenAddress = "0x0000000000000000000000000000000000000000"; // 替换为实际Token地址
  const RevenueSharing = await hre.ethers.getContractFactory("RevenueSharing");
  const revenueSharing = await RevenueSharing.deploy(platformTokenAddress);
  await revenueSharing.waitForDeployment();
  console.log("RevenueSharing deployed to:", await revenueSharing.getAddress());

  console.log("\n部署完成！");
  console.log("保存这些地址到前端配置文件中。");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 部署到测试网：

```bash
# 配置 hardhat.config.js
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 🎯 前端集成示例

### 1. 连接合约

```javascript
import { ethers } from 'ethers';
import StoryChapterNFTABI from './abis/StoryChapterNFT.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const contractAddress = "0x..."; // 部署后的合约地址
const contract = new ethers.Contract(
  contractAddress,
  StoryChapterNFTABI,
  signer
);
```

### 2. 发布章节

```javascript
async function publishChapter(chapterData) {
  // 1. 加密内容
  const key = generateRandomKey();
  const encrypted = CryptoJS.AES.encrypt(chapterData.content, key).toString();

  // 2. 上传到IPFS
  const ipfsHash = await uploadToIPFS(encrypted);

  // 3. 计算内容哈希
  const contentHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(chapterData.content)
  );

  // 4. 加密密钥
  const publicKey = await getPublicKey(signer.getAddress());
  const encryptedKey = encryptWithPublicKey(key, publicKey);

  // 5. 调用合约
  const tx = await contract.publishChapter(
    chapterData.storyId,
    chapterData.title,
    contentHash,
    ipfsHash,
    encryptedKey,
    ethers.utils.parseEther("0.001"), // 价格：0.001 ETH
    Math.floor(Date.now() / 1000) + (48 * 3600), // 48小时后免费
    1000, // 10% 版税
    tokenURI
  );

  await tx.wait();
  console.log("章节发布成功！");
}
```

### 3. 购买章节

```javascript
async function buyChapter(tokenId) {
  const chapterInfo = await contract.getChapterInfo(tokenId);
  const price = chapterInfo.price;

  const tx = await contract.purchaseChapter(tokenId, {
    value: price
  });

  await tx.wait();
  console.log("购买成功！");
}
```

### 4. 阅读章节

```javascript
async function readChapter(tokenId) {
  // 1. 检查权限
  const hasAccess = await contract.hasAccessToChapter(
    tokenId,
    await signer.getAddress()
  );

  if (!hasAccess) {
    throw new Error("需要购买NFT或等待免费解锁");
  }

  // 2. 获取加密的密钥
  const encryptedKey = await contract.getDecryptionKey(tokenId);

  // 3. 解密密钥
  const privateKey = await getPrivateKey();
  const key = decryptWithPrivateKey(encryptedKey, privateKey);

  // 4. 获取章节信息
  const chapterInfo = await contract.getChapterInfo(tokenId);

  // 5. 从IPFS下载加密内容
  const encrypted = await fetchFromIPFS(chapterInfo.encryptedContentIPFS);

  // 6. 解密内容
  const content = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);

  return content;
}
```

### 5. 打赏章节

```javascript
async function tipChapter(tokenId, amount) {
  const tx = await contract.tipChapter(tokenId, {
    value: ethers.utils.parseEther(amount.toString())
  });

  await tx.wait();
  console.log("打赏成功！");
}
```

---

## 🛡️ 安全考虑

### 1. 重入攻击防护
- ✅ 使用 `ReentrancyGuard`
- ✅ 遵循 Checks-Effects-Interactions 模式

### 2. 访问控制
- ✅ `onlyOwner` 修饰符
- ✅ NFT所有权验证
- ✅ 时间锁定机制

### 3. 整数溢出
- ✅ Solidity 0.8.x 内置溢出检查

### 4. 前端安全
- ❗ 私钥永远不要发送到服务器
- ❗ 加密密钥在客户端解密
- ❗ 使用HTTPS传输数据

---

## 📊 Gas 优化

1. **批量操作**：使用 `batchRegisterCopyright` 等批量方法
2. **存储优化**：使用 `bytes32` 而非 `string`
3. **事件日志**：用事件替代存储（离线查询）
4. **延迟加载**：按需获取数据

---

## 🔧 测试

创建 `test/StoryChapterNFT.test.js`：

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StoryChapterNFT", function () {
  let contract;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const StoryChapterNFT = await ethers.getContractFactory("StoryChapterNFT");
    contract = await StoryChapterNFT.deploy(owner.address);
    await contract.waitForDeployment();
  });

  it("应该能够发布章节", async function () {
    const tx = await contract.publishChapter(
      1, // storyId
      "第一章",
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("content")),
      "QmHash...",
      "0x1234",
      ethers.utils.parseEther("0.001"),
      0,
      1000,
      "ipfs://metadata"
    );

    await expect(tx).to.emit(contract, "ChapterPublished");
  });

  it("应该能够购买章节", async function () {
    // 先发布
    await contract.publishChapter(
      1, "第一章", ethers.utils.keccak256(ethers.utils.toUtf8Bytes("content")),
      "QmHash...", "0x1234", ethers.utils.parseEther("0.001"),
      0, 1000, "ipfs://metadata"
    );

    // 购买
    await expect(
      contract.connect(user1).purchaseChapter(0, {
        value: ethers.utils.parseEther("0.001")
      })
    ).to.emit(contract, "ChapterPurchased");
  });
});
```

运行测试：
```bash
npx hardhat test
```

---

## 📝 许可证

MIT License

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📞 联系方式

如有问题，请联系开发团队。
