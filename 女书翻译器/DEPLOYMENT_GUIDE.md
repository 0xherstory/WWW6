# 女书链上协议部署指南

## 1. 环境配置

### 1.1 安装依赖
```bash
npm install
```

### 1.2 配置环境变量

创建 `.env` 文件并添加以下内容：
```env
# Sepolia Testnet Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=YOUR_PRIVATE_KEY
```

- **SEPOLIA_RPC_URL**: 可以从 Alchemy、Infura 或其他 RPC 服务提供商获取
- **PRIVATE_KEY**: 你的 Ethereum 钱包私钥（确保账户中有 Sepolia ETH 用于部署）

## 2. 部署智能合约

### 2.1 编译合约
```bash
npx hardhat compile
```

### 2.2 部署到 Sepolia 测试网
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

部署成功后，你将看到类似以下输出：
```
NushuProtocol deployed to: 0x...
Contract ABI: [...]
```

## 3. 合约验证（可选）

如果你使用 Etherscan API，可以验证合约：
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## 4. 后续步骤

1. 保存部署的合约地址和 ABI，用于前端和后端集成
2. 将 ABI 复制到 `frontend/src/contracts/` 目录
3. 更新后端服务的合约配置

## 5. 注意事项

- 确保部署账户中有足够的 Sepolia ETH 用于燃气费用
- 保存好你的私钥，不要提交到版本控制
- 测试合约功能后再进行实际使用
