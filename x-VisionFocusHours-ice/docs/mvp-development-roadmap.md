# VisionFocus Hours - MVP开发路线图 (黑客松版本)

## 📊 项目现状分析

### ✅ 已完成的准备工作
- [x] 项目理念和需求文档
- [x] 数据库表设计
- [x] API接口文档
- [x] 智能合约设计
- [x] 路由设计文档
- [x] **7个前端HTML原型** (`idea/eg/`)
- [x] 冥想引导词音频 (引导词.wav, 引导词2.wav)

### 📦 可复用资源
```
VisionFocusHours/
├── idea/eg/              # 前端设计原型 (可直接改造)
│   ├── 0walletconnect.html       # 钱包连接页
│   ├── 1starthome.html           # 首页(星球宇宙)
│   ├── 2deepthink.html           # 冥想引导页
│   ├── 3dreamfragment.html       # 愿望输入页
│   ├── 4visionboard.html         # 愿景板编辑器
│   ├── 5hoursputin.html          # 专注时光投入页
│   ├── 6NFT.html                 # NFT展示页
│   └── 7startresult.html         # 年度总结页
├── 引导词.wav / 引导词2.wav      # 音频资源
└── docs/                         # 完整技术文档
```

---

## 🎯 MVP开发策略

### 核心原则
1. **最大化复用现有HTML原型** - 不重复造轮子
2. **LocalStorage优先** - 暂不实现后端API
3. **核心流程优先** - 聚焦用户体验闭环
4. **简化Web3集成** - 仅实现钱包连接和NFT展示

### 开发模式选择
```
推荐方案: 纯静态网站 (HTML + Vanilla JS)
├── 优势:
│   ├── 直接复用现有7个HTML文件
│   ├── 无需构建工具,开发效率最高
│   ├── 可直接部署到GitHub Pages/Vercel
│   └── 符合黑客松时间限制
└── 技术栈:
    ├── HTML5 + CSS3
    ├── Vanilla JavaScript (ES6+)
    ├── Ethers.js (Web3)
    ├── LocalStorage (数据持久化)
    └── Lottie (动画)
```

---

## 🚀 开发路线图 (按优先级)

### 阶段0: 项目整理与架构 (1小时)

#### 0.1 创建标准化项目结构
```bash
VisionFocusHours/
├── index.html                    # 入口页(重定向)
├── pages/                        # 页面目录
│   ├── wallet.html              # 改造自 0walletconnect.html
│   ├── home.html                # 改造自 1starthome.html
│   ├── meditation.html          # 改造自 2deepthink.html
│   ├── wishes.html              # 改造自 3dreamfragment.html
│   ├── board.html               # 改造自 4visionboard.html
│   ├── focus.html               # 改造自 5hoursputin.html
│   ├── nft.html                 # 改造自 6NFT.html
│   └── summary.html             # 改造自 7startresult.html
├── js/
│   ├── utils/
│   │   ├── storage.js           # LocalStorage封装
│   │   ├── wallet.js            # 钱包连接
│   │   ├── audio.js             # 音频管理
│   │   └── router.js            # 简易路由
│   ├── animations/
│   │   ├── coin-effect.js       # 投币动画
│   │   └── manifestation.js     # 显化效果
│   └── config.js                # 全局配置
├── css/
│   ├── global.css               # 全局样式
│   ├── variables.css            # CSS变量
│   └── animations.css           # 动画样式
├── assets/
│   ├── audio/
│   │   ├── guide.wav            # 从根目录移入
│   │   ├── coin.mp3             # 投币音效
│   │   └── success.mp3          # 成功音效
│   ├── images/
│   │   ├── planets/             # 星球图片
│   │   ├── stickers/            # 贴纸素材
│   │   └── icons/               # 图标
│   └── animations/
│       └── coin-drop.json       # Lottie动画
└── docs/                        # 保持现有文档
```

**任务清单**:
- [ ] 创建标准化目录结构
- [ ] 将7个HTML文件复制到 `pages/` 并重命名
- [ ] 提取公共CSS到 `css/global.css`
- [ ] 移动音频文件到 `assets/audio/`

---

### 阶段1: 核心工具类开发 (2小时)

#### 1.1 LocalStorage数据管理器 (`js/utils/storage.js`)
```javascript
// 优先级: P0 (必须)
// 功能: 统一管理所有本地数据
// 数据结构:
{
  user: { wallet: '', nickname: '' },
  planets: [
    {
      year: 2025,
      wishes: [...],
      visionBoard: {...},
      focusRecords: [...],
      totalHours: 0
    }
  ],
  currentPlanet: 2025
}
```

**核心API**:
- `StorageManager.init()` - 初始化
- `StorageManager.getCurrentPlanet()` - 获取当前星球
- `StorageManager.saveWishes(wishes)` - 保存愿望
- `StorageManager.addFocusHours(hours)` - 添加专注时光
- `StorageManager.getManifestationLevel(wishId)` - 获取显化等级

#### 1.2 钱包连接管理 (`js/utils/wallet.js`)
```javascript
// 优先级: P0 (必须)
// 功能: MetaMask连接,切换网络
```

**核心API**:
- `WalletManager.connect()` - 连接钱包
- `WalletManager.getAddress()` - 获取地址
- `WalletManager.switchNetwork()` - 切换到Sepolia

#### 1.3 音频管理器 (`js/utils/audio.js`)
```javascript
// 优先级: P0 (必须)
// 功能: 背景音乐,音效播放
```

**核心API**:
- `AudioManager.playGuide()` - 播放冥想引导
- `AudioManager.playCoinEffect()` - 投币音效
- `AudioManager.stopAll()` - 停止所有音频

#### 1.4 简易路由 (`js/utils/router.js`)
```javascript
// 优先级: P1 (可选)
// 功能: URL参数管理,页面跳转历史
```

**任务清单**:
- [ ] 实现 `storage.js` (1小时)
- [ ] 实现 `wallet.js` (30分钟)
- [ ] 实现 `audio.js` (30分钟)

---

### 阶段2: 页面改造 - 核心流程 (4小时)

#### 2.1 首页 (`pages/home.html`) ⭐
**改造重点**:
- 集成 `WalletManager` 实现真实钱包连接
- 从 `StorageManager` 读取用户历史星球
- 点击"创建新星球"跳转到冥想页
- 点击已有星球跳转到愿景板页

**工作量**: 30分钟

#### 2.2 冥想引导页 (`pages/meditation.html`) ⭐⭐⭐
**改造重点**:
- 集成 `AudioManager` 播放引导词
- 5阶段流程控制
- 完成后自动跳转到愿望输入页
- 标记"已完成冥想"到 LocalStorage

**工作量**: 1小时

#### 2.3 愿望输入页 (`pages/wishes.html`) ⭐⭐
**改造重点**:
- 使用 `StorageManager.saveWishes()` 保存数据
- 自动生成图标逻辑
- 完成后跳转到愿景板编辑页

**工作量**: 45分钟

#### 2.4 愿景板编辑器 (`pages/board.html`) ⭐⭐⭐
**改造重点**:
- 实现拖拽排列功能
- 图片上传(转base64存储)
- 保存愿景板配置到 LocalStorage
- 完成后跳转到专注时光页

**工作量**: 1.5小时

#### 2.5 专注时光投入页 (`pages/focus.html`) ⭐⭐⭐⭐⭐ 核心!
**改造重点**:
- 实现投币动画 (Lottie)
- 显化效果动态渲染
  - 10h: 星星点点
  - 30h: 微光荧光
  - 60h: 金色流光
  - 100h: 七彩流光
- 使用 `StorageManager.addFocusHours()` 记录
- 里程碑提示

**工作量**: 2小时 (重点打磨!)

**任务清单**:
- [ ] 改造 `home.html` (30分钟)
- [ ] 改造 `meditation.html` (1小时)
- [ ] 改造 `wishes.html` (45分钟)
- [ ] 改造 `board.html` (1.5小时)
- [ ] 改造 `focus.html` (2小时) ⭐ 核心体验

---

### 阶段3: 动画与视觉效果 (2小时)

#### 3.1 投币动画 (`js/animations/coin-effect.js`)
```javascript
// 使用Lottie实现
// 或纯CSS动画
// 配合音效
```

#### 3.2 显化效果 (`js/animations/manifestation.js`)
```javascript
// 根据累计时长渲染不同视觉效果
// 使用CSS滤镜 + 动画
```

**效果参考**:
- **10小时**: `filter: brightness(1.2) drop-shadow(0 0 5px gold)`
- **30小时**: `filter: brightness(1.4) drop-shadow(0 0 10px cyan)`
- **60小时**: `animation: golden-flow 2s infinite`
- **100小时**: `animation: rainbow-flow 3s infinite`

**任务清单**:
- [ ] 实现投币动画 (1小时)
- [ ] 实现4级显化效果 (1小时)

---

### 阶段4: Web3集成 - NFT功能 (2小时)

#### 4.1 NFT展示页 (`pages/nft.html`)
**改造重点**:
- 读取年度数据生成NFT预览
- **简化版**: 仅前端生成图片,不真实铸造
- 提供"下载NFT图片"功能
- (可选) 集成合约铸造功能

**工作量**: 1小时

#### 4.2 合约集成 (可选)
- 部署测试合约到Sepolia
- 实现 `mintNFT()` 调用
- 展示OpenSea链接

**工作量**: 1小时 (时间紧张可跳过)

**任务清单**:
- [ ] 改造 `nft.html` (1小时)
- [ ] (可选) 部署合约并集成 (1小时)

---

### 阶段5: 测试与优化 (1小时)

#### 5.1 完整流程测试
- 钱包连接 → 冥想 → 愿望输入 → 编辑愿景板 → 投入时光 → 查看NFT
- 检查LocalStorage数据完整性
- 测试刷新页面后状态保持

#### 5.2 视觉优化
- 统一主题色 (#FF9F7F, #FFD4B8, #FFF4E6)
- 优化动画流畅度
- 响应式适配

#### 5.3 演示准备
- 准备演示数据 (预填充愿望和时长)
- 制作5分钟演示脚本
- 准备备用方案

**任务清单**:
- [ ] 完整流程测试 (30分钟)
- [ ] 视觉优化 (20分钟)
- [ ] 演示准备 (10分钟)

---

## ⏱ 时间分配 (总计12小时)

| 阶段 | 内容 | 时间 | 优先级 |
|------|------|------|--------|
| 0 | 项目整理与架构 | 1h | P0 |
| 1 | 核心工具类开发 | 2h | P0 |
| 2 | 页面改造(核心流程) | 4h | P0 |
| 3 | 动画与视觉效果 | 2h | P0 |
| 4 | Web3集成(NFT) | 2h | P1 |
| 5 | 测试与优化 | 1h | P0 |

---

## 🎬 开发顺序建议

### 推荐顺序 (按依赖关系)
```
Day 1 (8小时):
08:00-09:00  阶段0: 项目整理
09:00-11:00  阶段1: 工具类开发
11:00-12:00  阶段2.1-2.2: 首页+冥想页
--- 午休 ---
13:00-15:00  阶段2.3-2.4: 愿望页+编辑器
15:00-17:00  阶段2.5: 专注时光页 ⭐核心!
17:00-18:00  阶段3: 动画效果
18:00-19:00  测试与调试

Day 2 (4小时) - 可选:
09:00-11:00  阶段4: Web3集成
11:00-12:00  阶段5: 最终优化
```

### 最小可行版本 (6小时赶工版)
如果时间极度紧张,可以砍掉:
- ❌ 冥想引导页 (直接跳过)
- ❌ NFT真实铸造 (仅前端展示)
- ❌ 高级动画效果 (简化为CSS过渡)
- ✅ 保留核心: 愿望输入 + 愿景板 + 投币动画

---

## 🚫 MVP阶段**不做**的事情

### 明确排除的功能
1. ❌ 后端API实现
2. ❌ 数据库部署
3. ❌ 用户认证系统
4. ❌ IPFS集成
5. ❌ 番茄钟计时器
6. ❌ 社交分享功能
7. ❌ 多语言支持
8. ❌ 移动端适配
9. ❌ 单元测试

### 简化策略
- 音频: 直接使用现有wav文件,不做混音
- 图片: 用户上传后转base64存储,不上传服务器
- 贴纸: 提供5-10个固定贴纸,不做贴纸库
- 相框: 提供3-5个固定样式

---

## 🎯 成功标准

### 核心体验闭环
1. ✅ 用户可以连接钱包
2. ✅ 用户可以输入愿望
3. ✅ 用户可以设计愿景板
4. ✅ 用户可以"投入"时光(模拟)
5. ✅ 用户可以看到显化效果变化
6. ✅ 用户可以查看年度NFT预览

### 演示效果
- 流畅的页面切换
- 炫酷的投币动画
- 明显的显化效果对比
- 温暖治愈的UI风格

---

## 📝 开发检查清单

### 阶段0: 项目准备
- [ ] 创建项目目录结构
- [ ] 复制并重命名HTML文件
- [ ] 提取公共CSS样式
- [ ] 组织静态资源

### 阶段1: 工具类
- [ ] `storage.js` - 数据管理
- [ ] `wallet.js` - 钱包连接
- [ ] `audio.js` - 音频播放
- [ ] `config.js` - 全局配置

### 阶段2: 核心页面
- [ ] `home.html` - 星球首页
- [ ] `meditation.html` - 冥想引导
- [ ] `wishes.html` - 愿望输入
- [ ] `board.html` - 愿景编辑器
- [ ] `focus.html` - 专注时光 ⭐

### 阶段3: 动画效果
- [ ] 投币动画
- [ ] 显化效果(4个等级)
- [ ] 页面过渡动画

### 阶段4: Web3
- [ ] 钱包连接
- [ ] 网络切换
- [ ] NFT预览生成
- [ ] (可选) 合约铸造

### 阶段5: 测试
- [ ] 完整流程测试
- [ ] 数据持久化测试
- [ ] 视觉一致性检查
- [ ] 演示脚本准备

---

## 🎤 5分钟演示脚本

### 演示流程
```
1. 【30秒】介绍理念
   "VisionFocus Hours - 用专注时光,点亮愿望星空"
   
2. 【30秒】连接钱包
   展示MetaMask连接,进入星球宇宙
   
3. 【30秒】冥想引导预览
   快速播放冥想引导片段(或跳过)
   
4. 【1分钟】愿望输入
   现场输入3-5个愿望碎片
   
5. 【1分钟】愿景板编辑
   上传图片,添加贴纸,设计布局
   
6. 【1.5分钟】投入时光 ⭐核心演示!
   - 投入10小时 → 展示星星效果
   - 投入30小时 → 展示微光效果
   - 投入60小时 → 展示流光效果
   - 投入100小时 → 展示七彩效果
   (重点演示显化过程!)
   
7. 【30秒】NFT预览
   展示年度NFT生成效果
   
8. 【30秒】总结与愿景
   "每个人的时间都是公平的,如何投资决定未来"
```

---

## 🛠 技术栈总结

### MVP最终技术栈
```yaml
前端框架: 无 (Vanilla JS)
页面数量: 7个HTML页面
JavaScript:
  - ES6+ 语法
  - 模块化(ES Modules)
  - Ethers.js (Web3)
  - Lottie-web (动画)
样式:
  - CSS3
  - CSS Variables
  - CSS Animations
存储:
  - LocalStorage (主要)
  - SessionStorage (辅助)
Web3:
  - MetaMask
  - Sepolia Testnet
音频:
  - Web Audio API
  - HTMLAudioElement
部署:
  - GitHub Pages / Vercel
  - 纯静态托管
```

---

## 📦 交付物清单

### 最终交付
1. ✅ 完整可运行的静态网站
2. ✅ 7个功能页面
3. ✅ 核心动画效果
4. ✅ 钱包集成
5. ✅ LocalStorage数据持久化
6. ✅ 5分钟演示视频/PPT
7. ✅ README使用说明
8. ✅ (可选) Sepolia测试网合约

---

## 🔥 关键成功因素

1. **复用现有HTML** - 节省80%开发时间
2. **聚焦核心体验** - 投币动画+显化效果
3. **简化技术栈** - 不引入React/Vue
4. **LocalStorage优先** - 跳过后端开发
5. **视觉打磨** - 温暖治愈的手绘风格

---

## 🚨 风险与备选方案

### 潜在风险
1. **音频播放兼容性** → 备选: 提供静音模式
2. **动画性能问题** → 备选: 降级为CSS过渡
3. **MetaMask连接失败** → 备选: 提供演示模式
4. **时间不足** → 备选: 使用最小可行版本(6小时)

---

## ✨ 下一步行动

### 立即开始
```bash
# 1. 创建项目结构
mkdir -p pages js/utils js/animations css assets/{audio,images,animations}

# 2. 复制HTML文件
cp idea/eg/1starthome.html pages/home.html
cp idea/eg/2deepthink.html pages/meditation.html
# ... 依此类推

# 3. 开始开发第一个工具类
# 创建 js/utils/storage.js
```

**开发起点**: 从 `storage.js` 开始,这是所有功能的基础!

---

**预计总开发时间**: 12小时 (核心版本)  
**最小可行版本**: 6小时  
**建议开发时长**: 1-2天完成

🚀 现在可以开始编码了!

