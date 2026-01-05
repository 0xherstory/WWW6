# 🛡️ 数字遗产继承 (Digital Inheritance)

基于以太坊智能合约的去中心化数字遗产继承平台。

## 📖 项目简介

本项目允许用户创建智能合约来管理数字资产的继承。合约所有者需要定期"签到"以证明活跃状态，如果超过设定的时间间隔未签到，继承人可以领取合约中的资产。

## ✨ 核心功能

### 🔗 钱包连接
- 支持 MetaMask 钱包连接
- 自动切换到 Sepolia 测试网络
- 实时显示钱包地址和网络状态

### 📝 创建遗产
- 设置继承人地址
- 自定义签到间隔（年/月/日/分钟）
- 初始存入 ETH 金额

### 📋 合约管理
- **Owner 功能**：
  - ✅ 签到（Check-In）- 重置倒计时
  - 💰 追加资金 - 向合约充值
  - 🔄 更换继承人 - 修改继承人地址
  - ⏱️ 修改间隔 - 调整签到时间间隔
  - ↩️ 撤回资金 - 取回合约中的 ETH（仅限未到期）

- **Heir 功能**：
  - 🎁 领取遗产 - 当合约到期后领取资产

### 📊 状态展示
- 合约余额实时显示
- 距离到期时间倒计时
- 合约状态标签（活跃/可领取/已继承）
- 事件日志记录

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS + shadcn/ui
- **动画效果**: Framer Motion
- **区块链交互**: ethers.js v6
- **路由管理**: React Router v6

## 📜 智能合约

### 合约地址（Sepolia 测试网）

| 合约 | 地址 |
|------|------|
| Factory | `0xcBC747c01C918497efc702f1e9c6e337731e343F` |

### 合约功能

**InheritanceFactory**
- `createInheritance(heir, intervalSeconds)` - 创建新的遗产合约
- `getAllInheritances()` - 获取所有遗产合约地址
- `getInstanceCount()` - 获取合约实例数量

**DigitalInheritance**
- `checkIn()` - 所有者签到
- `finalizeInheritance()` - 继承人领取遗产
- `withdraw()` - 所有者撤回资金
- `changeHeir(newHeir)` - 更换继承人
- `changeInterval(newInterval)` - 修改签到间隔

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm 或 bun
- MetaMask 钱包
- Sepolia 测试网 ETH

### 安装步骤

```bash
# 克隆项目
git clone <YOUR_GIT_URL>

# 进入项目目录
cd <YOUR_PROJECT_NAME>

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 获取测试 ETH

访问 [Sepolia Faucet](https://sepoliafaucet.com/) 获取测试网 ETH。

## 📁 项目结构

```
src/
├── components/
│   ├── layout/          # 布局组件
│   ├── ui/              # UI 基础组件
│   ├── EventLog.tsx     # 事件日志组件
│   ├── InheritanceCard.tsx  # 遗产卡片组件
│   └── WalletButton.tsx # 钱包按钮组件
├── contexts/
│   └── WalletContext.tsx    # 钱包上下文
├── hooks/
│   └── useWallet.ts     # 钱包 Hook
├── lib/
│   ├── contracts.ts     # 合约 ABI 和地址
│   └── utils.ts         # 工具函数
├── pages/
│   ├── Home.tsx         # 首页
│   ├── Hub.tsx          # 导航中心
│   ├── Create.tsx       # 创建遗产
│   └── List.tsx         # 合约列表
└── App.tsx              # 应用入口
```

## 🔒 安全说明

- 请确保在安全环境下操作钱包
- 建议先在测试网进行充分测试
- 妥善保管私钥和助记词
- 合约代码已开源，欢迎审计

## 📄 许可证

© 2025 StubbornStone & VivianToo. All rights reserved.

## 🔗 相关链接

- [Etherscan 合约地址](https://sepolia.etherscan.io/address/0xcBC747c01C918497efc702f1e9c6e337731e343F)
- [Lovable 项目](https://lovable.dev)
