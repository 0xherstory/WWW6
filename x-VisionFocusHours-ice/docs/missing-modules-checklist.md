# VisionFocus Hours - 完整技术栈清单

## 📋 已完成的设计文档
- ✅ 数据库设计 (database-design.md)
- ✅ 后端接口文档 (api-documentation.md)
- ✅ 智能合约文档 (smart-contract-documentation.md)
- ✅ 前端设计草图 (HTML示例)

---

## 🚨 可能遗漏的关键模块

### 1. 存储与CDN系统 ⭐⭐⭐

#### IPFS集成
**文件**: `docs/ipfs-integration.md`

**需要实现**:
- 图片上传到IPFS
- 元数据上传到IPFS
- IPFS网关选择 (Pinata/Infura/自建)
- 文件固定(Pinning)策略
- 备份方案

```javascript
// services/ipfs.service.js
class IPFSService {
  async uploadImage(file) {
    // 上传图片到IPFS
    const result = await ipfs.add(file);
    return result.path; // QmXxx...
  }
  
  async uploadMetadata(metadata) {
    // 上传NFT元数据
    const result = await ipfs.add(JSON.stringify(metadata));
    return result.path;
  }
  
  async pinFile(hash) {
    // 固定文件(防止被垃圾回收)
    await pinata.pinByHash(hash);
  }
}
```

#### 传统CDN
- 图片压缩与优化
- 缩略图生成
- 多尺寸适配
- CDN缓存策略

---

### 2. 音频系统 ⭐⭐⭐

#### 冥想引导音频
**文件**: `docs/audio-system.md`

**需要实现**:
- 背景音乐播放
- 引导词语音合成(TTS)
- 音效管理(投币、里程碑)
- 音量控制
- 多语言音频

```javascript
// services/audio.service.js
class AudioService {
  constructor() {
    this.bgMusic = new Audio('/assets/audio/meditation-bg.mp3');
    this.coinSound = new Audio('/assets/audio/coin.mp3');
    this.milestoneSound = new Audio('/assets/audio/milestone.mp3');
  }
  
  playBackgroundMusic() {
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.3;
    this.bgMusic.play();
  }
  
  playCoinSound() {
    this.coinSound.currentTime = 0;
    this.coinSound.play();
  }
  
  async textToSpeech(text, lang = 'zh-CN') {
    // 使用 Web Speech API 或第三方服务
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  }
}
```

**音频资源需求**:
- 冥想背景音乐 (5-10分钟循环)
- 投币音效 (1-2秒)
- 里程碑音效 (2-3秒)
- 可选: 女声引导录音

---

### 3. 动画与视觉效果 ⭐⭐⭐

#### Lottie动画
**文件**: `docs/animations.md`

**需要实现**:
- 投币动画 (金币下落)
- 显化效果动画 (星星点点→钻石七彩)
- 里程碑庆祝动画 (烟花、彩带)
- 加载动画
- 过渡动画

```javascript
// components/CoinAnimation.js
import lottie from 'lottie-web';

class CoinAnimation {
  init(container) {
    this.animation = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: '/assets/animations/coin-drop.json'
    });
  }
  
  play() {
    this.animation.play();
  }
}
```

#### CSS动画库
- 显化效果渐变
- 按钮hover效果
- 页面切换过渡
- 星空背景动画

---

### 4. 状态管理 ⭐⭐

#### 前端状态管理
**文件**: `src/store/`

**需要实现**:
```javascript
// store/index.js (使用 Zustand 或 Redux)
import create from 'zustand';

export const useStore = create((set) => ({
  // 用户状态
  user: null,
  walletConnected: false,
  
  // 当前星球
  currentPlanet: null,
  wishes: [],
  
  // 专注状态
  focusSession: null,
  totalHours: 0,
  
  // Actions
  setUser: (user) => set({ user }),
  connectWallet: (address) => set({ walletConnected: true, user: { address } }),
  setPlanet: (planet) => set({ currentPlanet: planet }),
  addWish: (wish) => set((state) => ({ wishes: [...state.wishes, wish] })),
  updateFocusHours: (hours) => set((state) => ({ totalHours: state.totalHours + hours }))
}));
```

---

### 5. 路由管理 ⭐⭐

#### 前端路由
**文件**: `src/router/index.js`

```javascript
// 使用 React Router 或 Vue Router
const routes = [
  { path: '/', component: HomePage },
  { path: '/meditation', component: MeditationPage },
  { path: '/wishes-input', component: WishesInputPage },
  { path: '/vision-board', component: VisionBoardPage },
  { path: '/fullscreen', component: FullscreenPage },
  { path: '/nft', component: NFTPage },
  { path: '/profile', component: ProfilePage },
  { path: '/statistics', component: StatisticsPage }
];
```

---

### 6. 数据持久化 ⭐⭐⭐

#### LocalStorage封装
**文件**: `utils/storage.js` (已在MVP路线图中提到)

#### IndexedDB (大数据存储)
**文件**: `utils/indexedDB.js`

```javascript
// 用于存储图片、音频等大文件
class IndexedDBService {
  async init() {
    this.db = await openDB('VisionFocusHours', 1, {
      upgrade(db) {
        db.createObjectStore('images');
        db.createObjectStore('sessions');
      }
    });
  }
  
  async saveImage(wishId, imageBlob) {
    await this.db.put('images', imageBlob, wishId);
  }
  
  async getImage(wishId) {
    return await this.db.get('images', wishId);
  }
}
```

---

### 7. 数据分析与统计 ⭐⭐

#### 统计图表
**文件**: `components/Statistics/`

**需要实现**:
- 专注时间趋势图 (折线图)
- 愿望完成度饼图
- 时段分布热力图
- 年度对比柱状图

```javascript
// 使用 Chart.js 或 ECharts
import { Line } from 'react-chartjs-2';

function FocusChart({ data }) {
  const chartData = {
    labels: data.dates,
    datasets: [{
      label: '每日专注时间',
      data: data.hours,
      borderColor: '#4ECDC4',
      tension: 0.4
    }]
  };
  
  return <Line data={chartData} />;
}
```

---

### 8. 通知系统 ⭐⭐

#### 浏览器通知
**文件**: `services/notification.service.js`

```javascript
class NotificationService {
  async requestPermission() {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
  }
  
  showNotification(title, options) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: options.body,
        icon: '/icon.png',
        badge: '/badge.png'
      });
    }
  }
  
  // 里程碑达成通知
  milestoneReached(milestone) {
    this.showNotification('🎉 里程碑达成!', {
      body: `恭喜!你已累计 ${milestone.hours} 小时专注时光!`
    });
  }
}
```

#### WebSocket实时通知
```javascript
// services/websocket.service.js
class WebSocketService {
  connect(token) {
    this.ws = new WebSocket(`wss://api.visionfocushours.app/ws`);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch(data.type) {
        case 'milestone':
          this.handleMilestone(data);
          break;
        case 'notification':
          this.handleNotification(data);
          break;
      }
    };
  }
}
```

---

### 9. 错误处理与日志 ⭐⭐

#### 全局错误处理
**文件**: `utils/errorHandler.js`

```javascript
class ErrorHandler {
  static handle(error, context) {
    // 记录错误
    console.error(`[${context}]`, error);
    
    // 发送到监控服务 (Sentry)
    if (window.Sentry) {
      Sentry.captureException(error);
    }
    
    // 用户友好提示
    this.showUserMessage(error);
  }
  
  static showUserMessage(error) {
    const messages = {
      'WALLET_NOT_CONNECTED': '请先连接钱包',
      'INSUFFICIENT_FUNDS': '余额不足',
      'NETWORK_ERROR': '网络错误,请重试'
    };
    
    const message = messages[error.code] || '操作失败,请重试';
    toast.error(message);
  }
}

// 使用
try {
  await mintNFT();
} catch (error) {
  ErrorHandler.handle(error, 'NFT铸造');
}
```

#### 日志服务
```javascript
// services/logger.service.js
class Logger {
  static log(level, message, data) {
    const log = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: navigator.userAgent
    };
    
    // 发送到后端
    api.post('/logs', log);
    
    // 本地保存
    console.log(log);
  }
  
  static info(message, data) {
    this.log('INFO', message, data);
  }
  
  static error(message, data) {
    this.log('ERROR', message, data);
  }
}
```

---

### 10. 安全与认证 ⭐⭐⭐

#### JWT Token管理
**文件**: `utils/auth.js`

```javascript
class AuthService {
  // 保存Token
  setToken(token) {
    localStorage.setItem('token', token);
    this.setAuthHeader(token);
  }
  
  // 获取Token
  getToken() {
    return localStorage.getItem('token');
  }
  
  // 检查Token是否过期
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  }
  
  // 刷新Token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh', { refreshToken });
    this.setToken(response.data.token);
  }
  
  // 设置请求头
  setAuthHeader(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}
```

#### 钱包签名验证
```javascript
// utils/walletAuth.js
class WalletAuth {
  async login(walletAddress) {
    // 1. 获取签名挑战
    const challenge = await api.post('/auth/wallet/challenge', {
      walletAddress
    });
    
    // 2. 用户签名
    const signature = await this.signMessage(challenge.data.challenge);
    
    // 3. 验证签名
    const auth = await api.post('/auth/wallet/verify', {
      walletAddress,
      signature,
      nonce: challenge.data.nonce
    });
    
    // 4. 保存Token
    authService.setToken(auth.data.token);
    
    return auth.data.user;
  }
  
  async signMessage(message) {
    if (!window.ethereum) {
      throw new Error('请安装 MetaMask');
    }
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    return await signer.signMessage(message);
  }
}
```

---

### 11. 国际化(i18n) ⭐

#### 多语言支持
**文件**: `locales/`

```javascript
// locales/zh-CN.json
{
  "common": {
    "connect_wallet": "连接钱包",
    "disconnect": "断开连接",
    "loading": "加载中..."
  },
  "meditation": {
    "title": "冥想引导",
    "start": "开始冥想",
    "complete": "完成"
  },
  "wishes": {
    "add": "添加愿望碎片",
    "placeholder": "写下你的愿望..."
  }
}

// locales/en-US.json
{
  "common": {
    "connect_wallet": "Connect Wallet",
    "disconnect": "Disconnect",
    "loading": "Loading..."
  }
}

// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': { translation: require('./locales/zh-CN.json') },
      'en-US': { translation: require('./locales/en-US.json') }
    },
    lng: 'zh-CN',
    fallbackLng: 'zh-CN'
  });

export default i18n;
```

---

### 12. SEO优化 ⭐

#### Meta标签管理
**文件**: `utils/seo.js`

```javascript
class SEOManager {
  setMetaTags(data) {
    // 基础标签
    document.title = data.title || 'VisionFocus Hours';
    
    // Open Graph (社交分享)
    this.setMetaTag('og:title', data.title);
    this.setMetaTag('og:description', data.description);
    this.setMetaTag('og:image', data.image);
    this.setMetaTag('og:url', window.location.href);
    
    // Twitter Card
    this.setMetaTag('twitter:card', 'summary_large_image');
    this.setMetaTag('twitter:title', data.title);
    this.setMetaTag('twitter:description', data.description);
  }
  
  setMetaTag(property, content) {
    let element = document.querySelector(`meta[property="${property}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('property', property);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }
}
```

---

### 13. 性能优化 ⭐⭐

#### 图片懒加载
```javascript
// components/LazyImage.js
function LazyImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const img = imgRef.current;
        img.src = src;
        img.onload = () => setLoaded(true);
        observer.disconnect();
      }
    });
    
    observer.observe(imgRef.current);
    
    return () => observer.disconnect();
  }, [src]);
  
  return (
    <img
      ref={imgRef}
      alt={alt}
      className={loaded ? 'loaded' : 'loading'}
    />
  );
}
```

#### Service Worker (PWA)
**文件**: `public/sw.js`

```javascript
// 缓存策略
const CACHE_NAME = 'visionfocus-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/audio/meditation-bg.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

---

### 14. 测试框架 ⭐⭐

#### 单元测试
**文件**: `tests/unit/`

```javascript
// tests/unit/storage.test.js
import { VisionFocusStorage } from '@/utils/storage';

describe('VisionFocusStorage', () => {
  let storage;
  
  beforeEach(() => {
    localStorage.clear();
    storage = new VisionFocusStorage();
  });
  
  test('应该初始化数据结构', () => {
    const data = storage.getData();
    expect(data).toHaveProperty('user');
    expect(data).toHaveProperty('planets');
  });
  
  test('应该创建新星球', () => {
    const planet = storage.createPlanet(2026);
    expect(planet.year).toBe(2026);
    expect(planet.totalFocusHours).toBe(0);
  });
});
```

#### E2E测试
**文件**: `tests/e2e/`

```javascript
// tests/e2e/mint-flow.spec.js (使用 Cypress)
describe('NFT铸造流程', () => {
  it('应该完成完整的铸造流程', () => {
    cy.visit('/');
    
    // 连接钱包
    cy.get('#connectWallet').click();
    cy.get('#walletAddress').should('contain', '0x');
    
    // 创建星球
    cy.get('#createPlanet').click();
    
    // 完成冥想
    cy.get('#startMeditation').click();
    cy.wait(5000);
    cy.get('#completeMeditation').click();
    
    // 输入愿望
    cy.get('#addWish').click();
    cy.get('textarea').type('健康有活力的身体');
    cy.get('#nextStep').click();
    
    // 铸造NFT
    cy.get('#mintNFT').click();
    cy.get('#nftStatus').should('contain', '铸造成功');
  });
});
```

---

### 15. DevOps与部署 ⭐⭐

#### CI/CD配置
**文件**: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

#### Docker配置
**文件**: `Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

---

### 16. 监控与分析 ⭐

#### 前端性能监控
```javascript
// services/analytics.service.js
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0
});

// 自定义事件追踪
class Analytics {
  trackEvent(eventName, properties) {
    // Google Analytics
    if (window.gtag) {
      gtag('event', eventName, properties);
    }
    
    // 自定义分析
    api.post('/analytics/events', {
      event: eventName,
      properties,
      timestamp: new Date().toISOString()
    });
  }
  
  // 专注会话追踪
  trackFocusSession(duration, wishId) {
    this.trackEvent('focus_session_complete', {
      duration,
      wishId
    });
  }
  
  // NFT铸造追踪
  trackNFTMint(tokenId, transactionHash) {
    this.trackEvent('nft_minted', {
      tokenId,
      transactionHash
    });
  }
}
```

---

### 17. 文档系统 ⭐

#### API文档生成
**文件**: `swagger.yaml` (已有)

#### 用户帮助文档
**文件**: `docs/user-guide.md`

```markdown
# VisionFocus Hours 用户指南

## 快速开始
1. 连接钱包
2. 创建年度星球
3. 完成冥想引导
4. 输入愿望碎片
5. 开始专注时光

## 常见问题
...
```

---

## 📊 完整技术栈总览

```
┌─────────────────────────────────────────────────────────────┐
│                        前端层                                │
├─────────────────────────────────────────────────────────────┤
│ React/Vue + TypeScript                                      │
│ - 路由管理 (React Router)                                   │
│ - 状态管理 (Zustand/Redux)                                  │
│ - UI组件库 (自定义手绘风格)                                 │
│ - 动画库 (Lottie + CSS Animations)                         │
│ - 图表库 (Chart.js/ECharts)                                │
│ - Web3库 (Ethers.js)                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       服务层                                 │
├─────────────────────────────────────────────────────────────┤
│ - LocalStorage (MVP)                                        │
│ - IndexedDB (大文件)                                        │
│ - Service Worker (PWA)                                      │
│ - WebSocket (实时通知)                                      │
│ - Audio Service (音频播放)                                  │
│ - IPFS Service (去中心化存储)                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       后端层                                 │
├─────────────────────────────────────────────────────────────┤
│ Node.js + Express/NestJS                                    │
│ - RESTful API                                               │
│ - WebSocket Server                                          │
│ - JWT认证                                                   │
│ - 文件上传处理                                              │
│ - IPFS集成                                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       数据层                                 │
├─────────────────────────────────────────────────────────────┤
│ - PostgreSQL (主数据库)                                     │
│ - Redis (缓存)                                              │
│ - IPFS (图片/元数据)                                        │
│ - S3/Cloudflare R2 (备份)                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      区块链层                                │
├─────────────────────────────────────────────────────────────┤
│ - Ethereum Sepolia (测试)                                   │
│ - ERC-721 NFT合约                                           │
│ - 成就合约                                                  │
│ - Ethers.js交互                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ 完整功能检查清单

### 核心功能
- [x] 数据库设计
- [x] 后端接口
- [x] 智能合约
- [x] 前端页面设计
- [ ] **IPFS集成** ⚠️
- [ ] **音频系统** ⚠️
- [ ] **动画效果** ⚠️
- [ ] **状态管理** ⚠️
- [ ] **路由管理** ⚠️

### 支撑系统
- [ ] **LocalStorage封装** ⚠️
- [ ] **错误处理** ⚠️
- [ ] **日志系统** ⚠️
- [ ] **认证系统** ⚠️
- [ ] **通知系统** ⚠️
- [ ] **统计图表** ⚠️

### 增强功能
- [ ] 国际化(i18n)
- [ ] SEO优化
- [ ] PWA支持
- [ ] 性能优化
- [ ] 监控分析

### 测试与部署
- [ ] 单元测试
- [ ] E2E测试
- [ ] CI/CD配置
- [ ] Docker配置
- [ ] 文档完善

---

## 🎯 黑客松MVP优先级

### P0 (必须完成)
1. ✅ 前端5个核心页面
2. ✅ LocalStorage数据管理
3. ⚠️ **音频播放(背景音乐+音效)**
4. ⚠️ **投币动画效果**
5. ⚠️ **显化效果CSS动画**
6. ⚠️ **路由管理**
7. ⚠️ **状态管理(简单版)**

### P1 (时间允许)
8. ⚠️ **IPFS图片上传(模拟)**
9. ⚠️ **智能合约集成**
10. ⚠️ **NFT铸造(模拟)**
11. ⚠️ **统计图表(简单版)**
12. ⚠️ **错误处理**

### P2 (加分项)
13. 通知系统
14. PWA支持
15. 性能监控
16. E2E测试

---

## 📝 建议下一步行动

### 1. 创建项目脚手架
```bash
npm create vite@latest vision-focus-hours -- --template react-ts
cd vision-focus-hours
npm install
```

### 2. 安装核心依赖
```bash
# 状态管理
npm install zustand

# 路由
npm install react-router-dom

# Web3
npm install ethers

# 动画
npm install lottie-web

# 图表
npm install chart.js react-chartjs-2

# 工具
npm install axios dayjs
```

### 3. 按顺序创建模块
1. **LocalStorage工具类** (1小时)
2. **路由配置** (30分钟)
3. **状态管理** (1小时)
4. **音频服务** (1小时)
5. **动画组件** (2小时)
6. **5个核心页面** (8-10小时)

---

## 💡 总结

你已经完成的:
- ✅ 数据库设计
- ✅ 后端接口文档
- ✅ 智能合约文档
- ✅ 前端设计草图

**还需要补充的核心模块**:
1. ⭐⭐⭐ **IPFS存储集成**
2. ⭐⭐⭐ **音频播放系统**
3. ⭐⭐⭐ **动画效果库**
4. ⭐⭐ **状态管理**
5. ⭐⭐ **路由管理**
6. ⭐⭐ **错误处理**
7. ⭐⭐ **通知系统**
8. ⭐ 其他辅助功能

建议优先完成标记⭐⭐⭐的模块,它们对用户体验至关重要!

