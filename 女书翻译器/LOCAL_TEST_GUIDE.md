# 女书链上平台 - 本地测试指南

本指南将帮助您在本地环境（链下）测试女书链上平台的所有功能，包括视觉、交互、钱包登录、OCR识别和文字转换等。

## 测试准备

### 1. 安装依赖

确保您已安装以下软件：
- Node.js 18+
- Git
- PostgreSQL 14+（本地安装或使用Docker）
- MetaMask浏览器插件

### 2. 启动本地PostgreSQL数据库

如果您使用本地PostgreSQL：
```bash
# 启动PostgreSQL服务（根据您的操作系统）
# macOS
brew services start postgresql
# Ubuntu
sudo systemctl start postgresql

# 创建数据库和用户
sudo -u postgres psql
CREATE DATABASE nushu_protocol;
CREATE USER postgres WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nushu_protocol TO postgres;
```

如果您使用Docker：
```bash
docker run --name nushu-postgres -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=nushu_protocol -p 5432:5432 -d postgres:14
```

## 测试步骤

### 1. 配置环境变量

#### 根目录（智能合约）
创建 `.env` 文件：
```env
# Local Development Configuration
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

#### 后端目录
在 `backend/` 目录下创建 `.env` 文件：
```env
# Server Configuration
PORT=3001

# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=nushu_protocol
DB_PASSWORD=your_password
DB_PORT=5432

# Blockchain Configuration
SEPOLIA_RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=
```

#### 前端目录
在 `frontend/` 目录下创建 `.env` 文件：
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_CONTRACT_ADDRESS=
```

### 2. 启动本地Hardhat节点

```bash
# 在项目根目录执行
npx hardhat node
```

这将启动一个本地以太坊节点，输出包含20个测试账户和私钥。

### 3. 部署合约到本地节点

打开一个新的终端：
```bash
# 在项目根目录执行
npx hardhat run scripts/deploy.js --network localhost
```

记录输出的合约地址，用于后续配置。

### 4. 配置前端和后端的合约地址

#### 前端配置
更新 `frontend/.env` 文件，添加合约地址：
```env
VITE_CONTRACT_ADDRESS=YOUR_LOCAL_CONTRACT_ADDRESS
```

#### 后端配置
更新 `backend/.env` 文件，添加合约地址：
```env
CONTRACT_ADDRESS=YOUR_LOCAL_CONTRACT_ADDRESS
```

### 5. 导入测试账户到MetaMask

1. 打开MetaMask扩展
2. 点击右上角头像 → 设置 → 网络 → 添加网络
3. 点击"添加网络手动"
4. 填写以下信息：
   - 网络名称：Hardhat Local
   - RPC URL：http://localhost:8545
   - 链ID：31337
   - 货币符号：ETH
   - 区块浏览器URL：（留空）
5. 保存并切换到该网络
6. 点击"导入账户"
7. 从本地节点输出中复制一个测试账户的私钥，粘贴进去
8. 导入成功后，您将看到该账户有10000 ETH

### 6. 启动后端服务

```bash
# 在backend目录执行
npm run dev
```

后端服务将在 http://localhost:3001 运行。

### 7. 启动前端开发服务器

```bash
# 在frontend目录执行
npm run dev
```

前端应用将在 http://localhost:5173 运行。

## 功能测试

### 1. 视觉和交互测试

- 打开浏览器，访问 http://localhost:5173
- 检查页面布局是否正常
- 测试响应式设计（调整浏览器窗口大小）
- 检查所有按钮和输入框是否可用

### 2. 钱包登录测试

- 点击"连接MetaMask"按钮
- MetaMask将弹出，选择您导入的测试账户
- 连接成功后，页面将显示您的账户地址和积分

### 3. 免费汉字转女书测试

- 在"免费汉字转女书"区域输入汉字，如"女书文化"
- 点击"转换为女书"按钮
- 检查转换结果是否正确显示
- 点击"复制结果"按钮，测试复制功能

### 4. 积分管理测试

- 在浏览器控制台中执行以下代码，领取初始积分：
  ```javascript
  // 连接到智能合约
  const contract = new ethers.Contract(
    process.env.VITE_CONTRACT_ADDRESS,
    NushuProtocolABI,
    signer
  );
  
  // 领取初始积分
  await contract.claimInitialPoints();
  ```
- 刷新页面，检查积分是否更新为50

### 5. 付费拍照翻译测试

- 点击"选择图片"按钮，选择一张本地图片
- 点击"开始翻译"按钮
- MetaMask将弹出，确认交易
- 检查积分是否扣除5分
- 等待处理完成，检查翻译结果

### 6. OCR识别测试

- 使用API测试工具（如Postman或curl）测试OCR功能：
  ```bash
  curl -X POST http://localhost:3001/api/ocr/image-to-chinese -H "Content-Type: application/json" -d '{"imageUrl": "https://example.com/nushu-image.jpg"}'
  ```
- 检查返回结果是否包含识别的汉字和女书字符

### 7. 图片库测试

- 使用API测试工具测试图片获取功能：
  ```bash
  curl http://localhost:3001/api/nushu/images
  ```
- 检查返回结果是否包含女书图片列表

## 测试注意事项

1. **本地节点重启**：如果您重启了本地Hardhat节点，需要重新部署合约并更新合约地址
2. **数据库清理**：每次测试前，您可以清理数据库数据：
   ```sql
   TRUNCATE TABLE translation_requests, nushu_images, nushu_characters;
   ```
3. **MetaMask重置**：如果遇到连接问题，可以重置MetaMask的本地网络：
   - 设置 → 高级 → 重置账户
4. **日志查看**：
   - 后端日志：查看后端终端输出
   - 前端日志：使用浏览器开发者工具的控制台
   - 智能合约日志：查看本地节点终端输出

## 常见问题排查

### 1. 钱包连接失败
- 确保MetaMask已切换到Hardhat Local网络
- 确保本地节点正在运行
- 尝试重置MetaMask账户

### 2. 合约交易失败
- 确保合约地址已正确配置
- 确保账户有足够的ETH支付燃气费用
- 检查本地节点日志，查看具体错误信息

### 3. OCR功能不工作
- 确保后端服务正在运行
- 检查后端日志，查看OCR处理过程
- 确保数据库连接正常

### 4. 前端页面无法访问
- 确保前端开发服务器正在运行
- 检查前端终端日志，查看是否有编译错误
- 尝试清除浏览器缓存

## 测试完成后

1. 停止所有服务：
   - 前端：Ctrl + C
   - 后端：Ctrl + C
   - 本地节点：Ctrl + C
   - PostgreSQL：根据您的启动方式停止

2. 清理测试数据（可选）：
   ```sql
   DROP DATABASE nushu_protocol;
   CREATE DATABASE nushu_protocol;
   ```

3. 保存测试结果和问题，用于后续开发和优化

## 后续步骤

完成本地测试后，您可以：
1. 修复测试中发现的问题
2. 添加新功能
3. 优化用户体验
4. 准备部署到Sepolia测试网
5. 进行安全审计

祝您测试愉快！
