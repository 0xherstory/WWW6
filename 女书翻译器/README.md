# 女书链上保护平台

基于 Sepolia 测试网的女书文化保护平台，通过 MetaMask 实现积分结算，提供免费汉字转女书及基于链下 OCR 识别的付费拍照翻译（5 积分/次）服务。

## 项目架构

### 技术栈

| 模块 | 技术 | 版本 |
|------|------|------|
| 智能合约 | Solidity | 0.8.24 |
| 后端服务 | Node.js + Express | Node.js 18+ |
| 数据库 | PostgreSQL | 14+ |
| 前端 | React + Vite | React 18 |
| Web3 交互 | ethers.js | 6.x |

### 项目结构

```
├── contracts/          # 智能合约源代码
├── frontend/           # 前端应用
├── backend/            # 后端服务
├── scripts/            # 部署脚本
├── config/             # 配置文件
├── test/               # 测试文件
├── package.json        # 项目依赖
└── README.md           # 项目说明
```

## 快速开始

### 1. 安装依赖

```bash
# 安装根目录依赖（智能合约相关）
npm install

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 2. 配置环境变量

#### 2.1 智能合约和部署配置

创建 `.env` 文件：

```env
# Sepolia Testnet Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=YOUR_PRIVATE_KEY
```

#### 2.2 后端配置

在 `backend/` 目录下创建 `.env` 文件：

```env
# Server Configuration
PORT=3001

# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=nushu_protocol
DB_PASSWORD=
DB_PORT=5432

# Blockchain Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
```

#### 2.3 前端配置

在 `frontend/` 目录下创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:3001
```

### 3. 部署智能合约

```bash
# 编译合约
npx hardhat compile

# 部署到 Sepolia 测试网
npx hardhat run scripts/deploy.js --network sepolia
```

### 4. 启动后端服务

```bash
cd backend
npm run dev
```

后端服务将在 http://localhost:3001 运行。

### 5. 启动前端开发服务器

```bash
cd frontend
npm run dev
```

前端应用将在 http://localhost:5173 运行。

## 功能说明

### 1. 免费汉字转女书

- 在首页输入汉字，点击"转换为女书"按钮
- 系统将汉字转换为女书字符
- 支持复制女书文本到剪贴板

### 2. 付费拍照翻译

1. **选择图片**：点击"选择图片"按钮，上传女书图片
2. **连接钱包**：确保已安装 MetaMask 并连接到 Sepolia 测试网
3. **开始翻译**：点击"开始翻译"按钮，系统将：
   - 检查用户积分是否足够（5积分/次）
   - 调用智能合约扣除积分
   - 触发链上事件
   - 后端监听器处理 OCR 识别
   - 返回翻译结果
4. **查看结果**：等待几秒钟后，查看翻译结果

### 3. 积分管理

- **初始积分**：新用户可领取 50 初始积分
- **购买积分**：支持 1 ETH = 10,000 积分的兑换
- **使用积分**：付费拍照翻译服务每次扣除 5 积分

## 测试流程

### 1. 连接钱包

1. 打开前端应用 http://localhost:5173
2. 点击"连接MetaMask"按钮
3. 授权 MetaMask 访问权限
4. 确保网络已切换到 Sepolia 测试网

### 2. 领取初始积分

1. 在浏览器控制台中执行以下代码：
   ```javascript
   // 连接到智能合约
   const contract = new ethers.Contract(
     '0xYOUR_DEPLOYED_CONTRACT_ADDRESS',
     NushuProtocolABI,
     signer
   );
   
   // 领取初始积分
   await contract.claimInitialPoints();
   ```

### 3. 测试免费翻译

1. 在"免费汉字转女书"区域输入汉字
2. 点击"转换为女书"按钮
3. 查看转换结果
4. 点击"复制结果"按钮

### 4. 测试付费翻译

1. 准备一张女书图片
2. 在"付费拍照翻译"区域点击"选择图片"按钮，上传图片
3. 点击"开始翻译"按钮
4. 授权 MetaMask 交易
5. 等待几秒钟后，查看翻译结果

## 智能合约 API

### 公共方法

| 方法名 | 功能 | 参数 | 返回值 |
|--------|------|------|--------|
| `claimInitialPoints()` | 领取初始积分 | 无 | 无 |
| `buyPoints()` | 购买积分 | 无（通过 msg.value 传入 ETH） | 无 |
| `useService(requestId, imageUrl)` | 使用翻译服务 | requestId: uint256, imageUrl: string | 无 |
| `getUserPoints(user)` | 获取用户积分 | user: address | uint256 |

### 事件

| 事件名 | 触发时机 | 参数 |
|--------|----------|------|
| `PointsClaimed` | 领取初始积分成功 | user: address, amount: uint256 |
| `PointsPurchased` | 购买积分成功 | user: address, ethAmount: uint256, pointsAmount: uint256 |
| `TranslationRequested` | 使用翻译服务成功 | user: address, requestId: uint256, imageUrl: string |

## 后端 API

### 翻译请求 API

| 接口 | 方法 | 功能 |
|------|------|------|
| `/api/translation/request` | POST | 创建翻译请求 |
| `/api/translation/update-tx` | POST | 更新交易哈希 |
| `/api/translation/result/:requestId` | GET | 获取翻译结果 |
| `/api/translation/history/:userWallet` | GET | 获取用户翻译历史 |

### 健康检查

| 接口 | 方法 | 功能 |
|------|------|------|
| `/health` | GET | 健康检查 |

## 开发说明

### 智能合约开发

```bash
# 编译合约
npx hardhat compile

# 运行测试
npx hardhat test

# 部署合约
npx hardhat run scripts/deploy.js --network sepolia
```

### 后端开发

```bash
# 启动开发服务器
npm run dev

# 启动生产服务器
npm start
```

### 前端开发

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 安全注意事项

1. 本项目仅用于测试和演示，请勿在主网部署
2. 请勿将真实的私钥和 API 密钥提交到版本控制
3. 确保使用安全的 RPC 节点和数据库连接
4. 定期更新依赖，修复安全漏洞

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题，请联系项目维护者。
