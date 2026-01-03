# 合约配置指南

## ⚠️ 当前状态

如果看到"合约地址未配置"的错误，说明合约还未部署或地址未配置。

## 🚀 快速解决方案

### 方案1：部署真实合约（推荐）

#### 步骤1：安装依赖
```bash
cd VisionFocusHours
npm install
```

#### 步骤2：配置环境变量
创建 `.env` 文件（复制 `.env.example`）：
```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
TREASURY_ADDRESS=0xYourTreasuryAddress
```

#### 步骤3：编译和部署
```bash
npm run compile
npm run deploy:sepolia
```

#### 步骤4：更新合约地址
部署成功后，复制合约地址，更新 `src/js/utils/contract.js`：

```javascript
const CONTRACT_ADDRESS = {
    sepolia: "0x你的合约地址", // 粘贴这里
    mainnet: "",
    localhost: ""
};
```

### 方案2：使用模拟模式（临时测试）

如果暂时不想部署合约，系统会自动启用**模拟模式**：

- ✅ 可以测试前端功能
- ✅ 可以查看NFT预览
- ✅ 可以体验完整流程
- ⚠️ NFT不会真正上链
- ⚠️ 数据不会永久保存

模拟模式会自动生成模拟的：
- Token ID
- 交易哈希
- 合约地址

## 📝 详细部署步骤

### 1. 获取测试网ETH

访问Sepolia水龙头获取测试ETH：
- https://sepoliafaucet.com/
- https://faucet.quicknode.com/ethereum/sepolia

### 2. 获取Infura API Key

1. 访问 https://infura.io/
2. 注册/登录账户
3. 创建新项目
4. 选择"Ethereum"网络
5. 复制API Key

### 3. 部署合约

```bash
# 编译
npm run compile

# 部署到Sepolia
npm run deploy:sepolia
```

部署成功后会显示：
```
✅ 合约部署成功!
合约地址: 0x...
网络: sepolia
链ID: 11155111
```

### 4. 验证合约（可选）

```bash
npm run verify
```

### 5. 更新前端配置

在 `src/js/utils/contract.js` 中更新：

```javascript
const CONTRACT_ADDRESS = {
    sepolia: "0x你的合约地址", // 更新这里
    mainnet: "",
    localhost: ""
};
```

## 🔍 验证配置

部署并配置后，刷新NFT页面，应该看到：
- ✅ 不再显示"模拟模式"警告
- ✅ 可以连接真实钱包
- ✅ 可以真实铸造NFT

## ❓ 常见问题

### Q: 如何知道合约是否已部署？
A: 检查 `src/js/utils/contract.js` 中的 `CONTRACT_ADDRESS.sepolia` 是否为空字符串。

### Q: 模拟模式和真实模式有什么区别？
A: 
- **模拟模式**：前端测试，不上链，数据不保存
- **真实模式**：真实上链，永久保存，需要Gas费用

### Q: 部署需要多少ETH？
A: 部署合约大约需要 0.01-0.05 ETH（测试网），铸造每个NFT需要 0.01 ETH + Gas费用。

### Q: 可以跳过部署直接使用吗？
A: 可以！系统会自动启用模拟模式，你可以先测试前端功能，稍后再部署真实合约。

## 📚 相关文档

- [完整部署指南](./CONTRACT_DEPLOYMENT.md)
- [合约文档](./docs/smart-contract-documentation.md)

