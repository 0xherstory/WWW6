# VisionFocus Hours NFT 智能合约

## ✅ 已完成

### 1. 智能合约代码
- ✅ `contracts/VisionFocusHoursNFT.sol` - 完整的ERC-721 NFT合约
- ✅ 支持年度NFT铸造
- ✅ 元数据管理
- ✅ 版税支持（EIP-2981）
- ✅ 安全特性（OpenZeppelin）

### 2. 部署配置
- ✅ `hardhat.config.js` - Hardhat配置
- ✅ `package.json` - 项目依赖
- ✅ `scripts/deploy.js` - 部署脚本
- ✅ `.env.example` - 环境变量模板

### 3. 前端集成
- ✅ `src/js/utils/contract.js` - 合约交互工具类
- ✅ `src/pages/NFT.html` - 更新为连接真实合约
- ✅ 支持MetaMask钱包连接
- ✅ 真实NFT铸造功能

## 🚀 使用步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env` 并填写你的配置。

### 3. 编译合约
```bash
npm run compile
```

### 4. 部署到测试网
```bash
npm run deploy:sepolia
```

### 5. 更新前端合约地址
在 `src/js/utils/contract.js` 中更新 `CONTRACT_ADDRESS.sepolia`。

### 6. 测试铸造
打开 `src/pages/NFT.html`，连接钱包，点击"开始铸造NFT"。

## 📝 合约功能

### 铸造NFT
```javascript
await contractService.mintNFT(
    year,              // 年份
    totalFocusHours,   // 总专注时间
    wishesCount,       // 愿望数量
    completedWishes,   // 完成的愿望数量
    tokenURI          // IPFS URI
);
```

### 查询功能
```javascript
// 获取用户某年的Token
const tokenId = await contractService.getUserYearToken(userAddress, year);

// 获取Token元数据
const metadata = await contractService.getTokenMetadata(tokenId);

// 获取用户所有Token
const tokens = await contractService.getUserTokens(userAddress);
```

## ⚠️ 注意事项

1. **IPFS集成**: 当前使用base64临时URI，实际应该上传到IPFS
2. **网络切换**: 确保MetaMask连接到正确的网络（Sepolia测试网）
3. **Gas费用**: 铸造需要支付Gas费用和铸造费用
4. **合约地址**: 部署后务必更新前端配置

## 🔗 相关文档

- [部署指南](./CONTRACT_DEPLOYMENT.md)
- [智能合约文档](./docs/smart-contract-documentation.md)

