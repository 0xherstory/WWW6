# VisionFocus Hours · 专注时光愿景板

![License](https://img.shields.io/badge/license-Non--Commercial-red.svg)
![Web3 Ready](https://img.shields.io/badge/Web3-Hackathon_Project-purple.svg)
![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)
![Status](https://img.shields.io/badge/status-MVP_Ready-green.svg)

> ✨ 用专注时光，显化你的愿景 ✨  
> 一个结合冥想引导、愿景可视化与时间投资的Web3 DApp

## 🌟 项目简介

**VisionFocus Hours** 是一个沉浸式的愿景实现工具，帮助用户：
- 通过专业冥想引导设定年度愿景
- 创建个性化的视觉愿景板
- 记录并可视化专注时间投入
- 体验愿望逐渐显化的成就感
- 生成年度NFT纪念时光投资

### 核心哲学
> "时间是每个人最公平的资源，如何投资时间，决定未来的模样"

## 🚀 立即体验

- 🌐 **在线演示**: [百炼成真](https://vision-focus-hours.vercel.app/)
- 📱 **桌面版优先**: 最佳体验在桌面/平板浏览器
- 🔗 **测试网**: Sepolia测试网NFT铸造（支持模拟模式）

## ✨ 核心功能

### 🧘 沉浸式冥想引导
- ✅ 5阶段专业冥想流程
- ✅ 自动引导模式（可手动控制）
- ✅ 背景音乐控制（M键切换）
- ✅ 旁白控制（V键切换）
- ✅ 呼吸动画 + 动态背景切换
- ✅ 完成后的星球进入动画

### 💭 愿望碎片输入
- ✅ 1-12个愿望输入
- ✅ 智能类型识别和图标匹配
- ✅ 动态添加/删除愿望
- ✅ 示例关键词快速添加
- ✅ 键盘快捷键支持

### 🎨 手绘风格愿景板编辑器
- ✅ 拖拽排列愿望项目
- ✅ 图片上传功能（转base64存储）
- ✅ 多种相框选择
- ✅ 贴纸添加功能
- ✅ 背景选择
- ✅ 文字编辑、缩放、旋转
- ✅ 完整愿景板图片保存（html2canvas）

### ⏳ 专注时光记录（核心创新）
- ✅ **存入专注时光**：1小时专注 = 1个"时光币"
- ✅ **视觉显化系统**：
  - 10小时：星星点点效果 ✨
  - 30小时：微光荧光效果 🌟
  - 60小时：金色流光效果 ⭐
  - 100小时：钻石七彩流光效果 💎
- ✅ **多巴胺反馈**：投币动画 + 粒子特效
- ✅ 里程碑提示和统计展示
- ✅ 全屏模式

### 🔮 年度NFT纪念
- ✅ NFT预览生成（完整愿景板渲染）
- ✅ 真实区块链铸造（ERC-721标准）
- ✅ 模拟模式支持（合约未部署时）
- ✅ 铸造流程可视化
- ✅ NFT详情展示和区块浏览器链接
- ✅ 下载和分享功能

### 🌌 星球轨迹展示
- ✅ 轨道系统可视化
- ✅ 真实星球数据加载
- ✅ 智能路由系统
- ✅ 信息面板展示
- ✅ 时间轴导航

### 🧠 智能路由系统
- ✅ 根据完成状态自动跳转
- ✅ 支持从任意入口进入正确页面
- ✅ 状态徽章显示

## 🛠 技术栈

### 前端
- **HTML5** + **CSS3** + **JavaScript (ES6+)**
- **模块化架构**：ES6 Modules
- **纯静态网站**：无需构建工具，可直接部署

### Web3
- **Ethers.js v6**：Web3交互
- **MetaMask集成**：直接使用 `window.ethereum` API
- **智能合约**：ERC-721 NFT标准（OpenZeppelin）

### 存储
- **LocalStorage**：数据持久化（按年份隔离）
- **状态管理**：完整的星球状态跟踪

### 动画与视觉效果
- **CSS Animations**：星空背景、过渡效果
- **JavaScript动画**：投币效果、粒子特效
- **html2canvas**：愿景板图片生成

### 音频
- **Web Audio API**：背景音乐和旁白播放
- **音频控制**：音量、静音、淡入淡出

### 部署
- **Vercel**：一键部署（已配置 `vercel.json`）
- **GitHub Pages**：支持静态部署
- **无服务器**：纯前端实现

## 📁 项目结构

```
VisionFocusHours/
├── src/                          # 源代码目录
│   ├── index.html               # 启动页
│   ├── pages/                   # 页面文件
│   │   ├── home.html           # 星球首页
│   │   ├── meditation.html     # 冥想引导页
│   │   ├── dreamfragment.html # 愿望碎片输入页
│   │   ├── visionboard.html    # 愿景板编辑器
│   │   ├── hoursputin.html     # 专注时光投资页
│   │   ├── NFT.html            # NFT生成与铸造页
│   │   └── startresult.html    # 星球轨迹展示页
│   ├── js/                      # JavaScript文件
│   │   ├── config.js           # 全局配置
│   │   ├── utils/              # 工具类
│   │   │   ├── storage.js      # 数据管理
│   │   │   ├── wallet.js       # 钱包连接
│   │   │   ├── audio.js        # 音频系统
│   │   │   ├── helpers.js      # 工具函数
│   │   │   └── contract.js     # 合约交互
│   │   └── animations/         # 动画效果
│   │       ├── coin-effect.js  # 投币动画
│   │       └── manifestation.js # 显化效果
│   ├── css/                     # 样式文件
│   │   ├── variables.css       # CSS变量
│   │   ├── global.css          # 全局样式
│   │   └── animations.css      # 动画样式
│   └── assets/                  # 静态资源
│       ├── audio/              # 音频文件
│       ├── images/             # 图片资源
│       └── animations/         # 动画资源
├── contracts/                    # 智能合约
│   └── VisionFocusHoursNFT.sol  # ERC-721 NFT合约
├── scripts/                      # 部署脚本
│   └── deploy.js               # 合约部署脚本
├── docs/                         # 项目文档
│   ├── smart-contract-documentation.md
│   ├── api-documentation.md
│   ├── routing-documentation.md
│   └── dev/                     # 开发文档
├── vercel.json                   # Vercel部署配置
├── hardhat.config.js            # Hardhat配置
├── package.json                 # 项目配置
├── LICENSE                      # 许可证文件
└── README.md                    # 本文件
```
```

## 🎯 功能路线图

### ✅ P0 - 核心功能（已完成）

- ✅ 钱包连接（MetaMask）
- ✅ 冥想引导流程（5阶段+音频）
- ✅ 愿望碎片输入系统
- ✅ 愿景板编辑器（完整工具集）
- ✅ 专注时光投资（投币动画+显化效果）
- ✅ 本地存储与状态管理
- ✅ 智能路由系统
- ✅ NFT生成与铸造（支持模拟模式）
- ✅ 星球轨迹可视化

### 🔄 P1 - 增强体验（计划中）

- ⏳ 番茄钟专注计时器
- ⏳ 更多贴纸和相框素材
- ⏳ 导出/导入愿景配置
- ⏳ 调试模式和演示功能
- ⏳ 数据统计和可视化

### 📅 P2 - 未来规划

- 📅 季度回顾和统计数据
- 📅 社交分享功能
- 📅 移动端适配优化
- 📅 IPFS去中心化存储
- 📅 多链支持
- 📅 后端API集成

## 📄 许可证

本项目采用**非商业许可证**，详情请参阅 [LICENSE](LICENSE) 文件。

### 许可证要点
- ✅ **允许**：个人使用、学习、教育用途、开源贡献
- ❌ **禁止**：商业使用、闭源分发、商标商业使用
- 📧 **商业许可**：如需商业使用，请联系项目维护者获取商业许可

**重要提示**：使用本软件即表示您同意遵守许可证条款。违反许可证的行为可能导致法律后果。

## 🏗 开发指南

### 环境要求
- **Node.js 16+**（仅用于智能合约开发）
- **MetaMask钱包**（用于Web3功能）
- **现代浏览器**（Chrome/Firefox/Edge，支持ES6 Modules）



**用每一小时专注，绘制未来的自己**  
*Every hour focused, paints a clearer future.*

© 2026 VisionFocus Hours
