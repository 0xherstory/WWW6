# Following 页面交互动效说明

## 🎯 整体设计目标
实现类似小红书顶部关注切换的温柔、轻盈交互体验，米白背景 + 淡粉强调色，营造温暖的故事追更氛围。

## 📱 页面结构

### 1. 类别 Chip 行（64px 高度，sticky）
```
[关注的作者] [关注的作品]
```
- **位置**：页面标题下方，sticky 固定
- **样式**：圆角胶囊设计，无强描边
- **颜色**：米白背景 (#FAF7F3)，淡粉强调色 (#E8B4A0)

### 2. 内嵌展开列表区域
- **展开方式**：在 Chip 下方直接展开，不遮挡 Feed
- **高度**：自适应内容，最大 140px
- **内容**：横向滚动的卡片行

## 🎬 核心动效规范

### Chip 选中态动效
```css
transition: all 0.25s ease;

/* 默认态 */
background: rgba(232, 180, 160, 0.08);
border: 1px solid rgba(232, 180, 160, 0.12);

/* 悬停态 */
background: rgba(232, 180, 160, 0.12);
transform: translateY(-1px);

/* 激活态 */
background: rgba(232, 180, 160, 0.18);
color: #E8B4A0;
font-weight: 600;
```

### 列表展开/收起动效
```css
/* 收起态 */
.expanded-list {
    max-height: 0;
    opacity: 0;
    transition: all 0.3s ease;
}

/* 展开态 */
.expanded-list.active {
    max-height: 140px;
    opacity: 1;
    padding: 20px 0;
}
```

### 列表项悬停动效
```css
.list-item {
    transition: all 0.25s ease;
}

.list-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(232, 180, 160, 0.1);
}
```

## 🔄 交互流程

### 初始状态
- **Chip 状态**：两个 Chip 均为未选中态
- **列表状态**：无展开列表
- **Feed 状态**：显示混合动态流

### 点击"关注的作者" Chip
1. **Chip 变化**：
   - 当前 Chip 进入激活态（0.25s 过渡）
   - 另一个 Chip 保持默认态
   
2. **列表展开**：
   - 作者列表从 0 高度展开到 140px（0.3s 过渡）
   - 透明度从 0 到 1
   - 显示横向滚动的作者卡片

3. **Feed 保持**：
   - Feed 内容不变，仍显示混合动态

### 点击"关注的作品" Chip
1. **切换动效**：
   - 作者 Chip 退出激活态
   - 作品 Chip 进入激活态
   - 作者列表收起（0.3s）
   - 作品列表展开（0.3s）

### 再次点击已选中 Chip
1. **收起动效**：
   - Chip 退出激活态
   - 列表收起到 0 高度
   - 恢复初始状态

### 点击列表项
1. **点击反馈**：
   - 轻微缩放动画（scale 0.96 → 1.0）
   - 150ms 快速反馈

2. **页面跳转**：
   - 跳转到对应的作者主页或作品主页
   - 不在当前页展开详情

## 🎨 视觉细节

### 颜色系统
```css
/* 背景色 */
--bg-primary: #FAF7F3;
--bg-card: rgba(255, 255, 255, 0.8);

/* 强调色 */
--accent-primary: #E8B4A0;
--accent-secondary: #D4A574;

/* 文字色 */
--text-primary: #4a4a4a;
--text-secondary: #6a6a6a;
--text-muted: #aaa;
```

### 圆角规范
```css
--radius-chip: 24px;      /* Chip 圆角 */
--radius-card: 16px;      /* 列表卡片圆角 */
--radius-avatar: 12px;    /* 头像圆角 */
--radius-cover: 8px;      /* 作品封面圆角 */
```

### 阴影系统
```css
/* 悬停阴影 */
box-shadow: 0 4px 12px rgba(232, 180, 160, 0.1);

/* 卡片阴影 */
box-shadow: 0 8px 30px rgba(232, 180, 160, 0.12);
```

## 📱 响应式适配

### 移动端调整
- **Chip 高度**：64px → 56px
- **列表高度**：140px → 120px
- **卡片尺寸**：头像 48px → 40px
- **间距调整**：gap 16px → 12px

### 横向滚动优化
- **滚动条隐藏**：`scrollbar-width: none`
- **滑动流畅性**：`scroll-behavior: smooth`
- **边界处理**：左右 padding 确保内容不贴边

## 🌸 气质特征

### 温柔轻盈
- **过渡时长**：0.25-0.3s，避免过快或过慢
- **缓动函数**：ease，自然的加速减速
- **颜色饱和度**：低饱和度，避免刺眼

### 小红书风格
- **Chip 设计**：胶囊形状，无强描边
- **列表布局**：横向滚动，紧凑排列
- **交互反馈**：轻微上浮，柔和阴影

### 故事追更感
- **文案温柔**：避免功能性描述
- **视觉层次**：通过留白而非颜色区分
- **情感连接**：陪伴式而非工具式体验

## 🔧 技术实现要点

### CSS 关键属性
```css
/* Sticky 定位 */
position: sticky;
top: 0;
z-index: 100;

/* 高度过渡 */
transition: max-height 0.3s ease, opacity 0.3s ease;

/* 横向滚动 */
overflow-x: auto;
scrollbar-width: none;
```

### JavaScript 核心逻辑
```javascript
// 状态管理
let currentCategory = null; // 'authors' | 'works' | null

// 展开/收起控制
function openList(category) {
    const listElement = document.getElementById(listId);
    listElement.classList.add('active');
}

function closeAllLists() {
    document.querySelectorAll('.expanded-list').forEach(list => {
        list.classList.remove('active');
    });
}
```

这套交互设计完全符合你的要求：两个类别 Chip + 内嵌展开列表，温柔的小红书风格，专注于故事追更的情感体验。