# VisionFocus Hours NFT 合约部署指南

## 📋 前置要求

1. **Node.js** (v16+)
2. **MetaMask** 钱包
3. **测试网ETH** (Sepolia测试网)
4. **Infura/Alchemy账户** (用于RPC节点)

## 🚀 快速开始

### 1. 安装依赖

```bash
cd VisionFocusHours
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写：

```bash
# 网络配置
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY

# 部署账户私钥（注意安全！）
PRIVATE_KEY=your_private_key_here

# Etherscan API Key（用于验证合约）
ETHERSCAN_API_KEY=your_etherscan_api_key

# 收入接收地址
TREASURY_ADDRESS=0xYourTreasuryAddress
```

### 3. 编译合约

```bash
npm run compile
```

### 4. 部署到Sepolia测试网

```bash
npm run deploy:sepolia
```

部署成功后，会输出：
- 合约地址
- 部署账户
- 网络信息

### 5. 更新前端配置

在 `src/js/utils/contract.js` 中更新合约地址：

```javascript
const CONTRACT_ADDRESS = {
    sepolia: "0x你的合约地址",
    mainnet: "",
    localhost: ""
};
```

## 📝 部署参数说明

默认部署参数：
- **铸造价格**: 0.01 ETH
- **最大供应量**: 无限制 (0)
- **每用户每年最大铸造数**: 1
- **版税比例**: 2.5% (250基点)

如需修改，编辑 `scripts/deploy.js` 中的参数。

## 🔍 验证合约

部署后自动验证（如果配置了Etherscan API Key）：

```bash
npm run verify
```

或手动在 [Etherscan](https://sepolia.etherscan.io/) 验证。

## 🧪 测试

```bash
npm run test
```

## 📦 合约功能

### 核心功能
- ✅ ERC-721标准NFT
- ✅ 年度NFT铸造
- ✅ 元数据存储（IPFS）
- ✅ 版税支持（EIP-2981）
- ✅ 枚举支持（ERC721Enumerable）
- ✅ 暂停/恢复机制
- ✅ 访问控制

### 查询功能
- `getUserYearToken(user, year)` - 获取用户某年的Token ID
- `getUserTokens(user)` - 获取用户所有Token
- `getTokenMetadata(tokenId)` - 获取Token元数据
- `getYearMintCount(year)` - 获取某年铸造总数

### 管理员功能
- `setMintPrice(newPrice)` - 设置铸造价格
- `setMaxSupply(newMaxSupply)` - 设置最大供应量
- `setTreasury(newTreasury)` - 设置收入接收地址
- `setRoyaltyBps(newRoyaltyBps)` - 设置版税比例
- `pause()` / `unpause()` - 暂停/恢复合约
- `withdraw(amount)` - 提款

## 🔐 安全注意事项

1. **私钥安全**: 永远不要将 `.env` 文件提交到Git
2. **测试网优先**: 先在测试网充分测试
3. **代码审计**: 主网部署前进行安全审计
4. **多签钱包**: 生产环境使用多签钱包作为treasury地址

## 🌐 网络配置

### Sepolia测试网
- Chain ID: 11155111
- RPC: https://sepolia.infura.io/v3/YOUR_KEY
- Explorer: https://sepolia.etherscan.io/
- Faucet: https://sepoliafaucet.com/

### 主网
- Chain ID: 1
- RPC: https://mainnet.infura.io/v3/YOUR_KEY
- Explorer: https://etherscan.io/

## 📚 相关文档

- [智能合约文档](./docs/smart-contract-documentation.md)
- [前端合约交互](./src/js/utils/contract.js)
- [OpenZeppelin文档](https://docs.openzeppelin.com/contracts/)

## ❓ 常见问题

### Q: 部署失败，提示Gas不足？
A: 确保钱包有足够的测试网ETH。

### Q: 合约验证失败？
A: 检查Etherscan API Key是否正确，或稍后手动验证。

### Q: 如何修改铸造价格？
A: 部署后调用 `setMintPrice(newPrice)` 函数（需要owner权限）。

### Q: 如何上传元数据到IPFS？
A: 使用Pinata、NFT.Storage或自建IPFS节点。参考 `prepareTokenURI()` 函数。

## 🎯 下一步

1. ✅ 部署合约到测试网
2. ✅ 更新前端合约地址
3. ✅ 测试NFT铸造功能
4. ⏳ 集成IPFS上传服务
5. ⏳ 主网部署（充分测试后）

