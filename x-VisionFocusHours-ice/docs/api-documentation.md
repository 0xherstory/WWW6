# VisionFocus Hours - 后端接口文档

## 📋 目录
- [接口概述](#接口概述)
- [认证机制](#认证机制)
- [通用规范](#通用规范)
- [错误码](#错误码)
- [接口详情](#接口详情)

---

## 接口概述

### 基础信息
- **Base URL**: `https://api.visionfocushours.app/v1`
- **协议**: HTTPS
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: JWT Token + Wallet Signature

### 技术栈建议
- **后端框架**: Node.js + Express / NestJS
- **数据库**: PostgreSQL (主数据库) + Redis (缓存)
- **存储**: IPFS (图片) + AWS S3 (备份)
- **区块链**: Ethers.js (Sepolia 测试网)

---

## 认证机制

### 1. Web3 钱包签名登录

```http
POST /auth/wallet/challenge
```

**请求参数**:
```json
{
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "challenge": "Sign this message to login: nonce-123456789",
    "nonce": "123456789",
    "expiresIn": 300
  }
}
```

---

```http
POST /auth/wallet/verify
```

**请求参数**:
```json
{
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "signature": "0xabcd...",
  "nonce": "123456789"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 86400,
    "user": {
      "userId": 123,
      "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
      "username": null,
      "avatarUrl": null,
      "createdAt": "2026-01-03T10:00:00Z"
    }
  }
}
```

### 2. Token 刷新

```http
POST /auth/refresh
```

**请求头**:
```
Authorization: Bearer {refreshToken}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "new_jwt_token_here",
    "expiresIn": 86400
  }
}
```

---

## 通用规范

### 请求头
```
Authorization: Bearer {token}
Content-Type: application/json
```

### 响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": "2026-01-03T10:00:00Z"
}
```

### 分页格式
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

## 错误码

| 错误码 | 说明 | HTTP状态码 |
|--------|------|-----------|
| 200 | 成功 | 200 |
| 400 | 请求参数错误 | 400 |
| 401 | 未授权/Token失效 | 401 |
| 403 | 无权限访问 | 403 |
| 404 | 资源不存在 | 404 |
| 409 | 资源冲突 | 409 |
| 422 | 验证失败 | 422 |
| 429 | 请求过于频繁 | 429 |
| 500 | 服务器内部错误 | 500 |
| 503 | 服务暂时不可用 | 503 |

### 详细错误码

| 业务错误码 | 说明 |
|-----------|------|
| 1001 | 钱包地址格式错误 |
| 1002 | 签名验证失败 |
| 1003 | Nonce已过期 |
| 2001 | 星球已存在 |
| 2002 | 星球不存在 |
| 2003 | 愿望数量超过限制 |
| 2004 | 愿望不存在 |
| 3001 | 文件上传失败 |
| 3002 | 文件格式不支持 |
| 3003 | 文件大小超过限制 |
| 4001 | NFT铸造失败 |
| 4002 | NFT已存在 |

---

## 接口详情

## 一、用户模块

### 1.1 获取当前用户信息

```http
GET /users/me
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": 123,
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "username": "VisionSeeker",
    "avatarUrl": "https://cdn.example.com/avatar.jpg",
    "email": "user@example.com",
    "createdAt": "2026-01-01T00:00:00Z",
    "lastLoginAt": "2026-01-03T10:00:00Z",
    "preferences": {
      "language": "zh-CN",
      "theme": "dark",
      "notifications": true
    }
  }
}
```

---

### 1.2 更新用户信息

```http
PUT /users/me
```

**请求参数**:
```json
{
  "username": "NewUsername",
  "avatarUrl": "https://cdn.example.com/new-avatar.jpg",
  "email": "new-email@example.com",
  "preferences": {
    "language": "zh-CN",
    "theme": "dark"
  }
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": 123,
    "username": "NewUsername",
    "avatarUrl": "https://cdn.example.com/new-avatar.jpg",
    "updatedAt": "2026-01-03T10:00:00Z"
  }
}
```

---

### 1.3 获取用户统计数据

```http
GET /users/me/statistics
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalPlanets": 3,
    "totalWishes": 24,
    "totalFocusHours": 456.5,
    "totalSessions": 892,
    "totalNftsMinted": 2,
    "longestStreakDays": 45,
    "currentStreakDays": 12,
    "lastFocusDate": "2026-01-03",
    "averageSessionDuration": 32,
    "favoriteWishType": "learning",
    "mostProductiveHour": 9
  }
}
```

---

## 二、星球模块

### 2.1 获取用户所有星球

```http
GET /planets
```

**查询参数**:
- `year` (可选): 筛选特定年份
- `status` (可选): 筛选状态 (creating/active/completed/archived)
- `page` (可选): 页码,默认1
- `pageSize` (可选): 每页数量,默认20

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "planetId": 1,
        "year": 2026,
        "planetName": "2026星球",
        "planetColor": "#4ECDC4",
        "status": "active",
        "totalFocusHours": 156.5,
        "completionRate": 65.5,
        "meditationCompleted": true,
        "meditationCompletedAt": "2026-01-01T10:30:00Z",
        "createdAt": "2026-01-01T10:00:00Z",
        "updatedAt": "2026-01-03T10:00:00Z",
        "nftMinted": false,
        "wishesCount": 8,
        "completedWishesCount": 2
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

### 2.2 获取星球详情

```http
GET /planets/:planetId
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "planetId": 1,
    "year": 2026,
    "planetName": "2026星球",
    "planetColor": "#4ECDC4",
    "status": "active",
    "totalFocusHours": 156.5,
    "completionRate": 65.5,
    "meditationCompleted": true,
    "meditationCompletedAt": "2026-01-01T10:30:00Z",
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-01-03T10:00:00Z",
    "nftMinted": false,
    "nftTokenId": null,
    "wishes": [
      {
        "wishId": 1,
        "orderIndex": 1,
        "wishText": "健康有活力的身体",
        "wishType": "health",
        "wishIcon": "fa-heartbeat",
        "focusHours": 35.5,
        "displayLevel": 2,
        "isCompleted": false,
        "createdAt": "2026-01-01T11:00:00Z"
      }
    ],
    "visionBoard": {
      "boardId": 1,
      "layoutType": "grid",
      "backgroundColor": "#FFF9F0",
      "frameStyle": "hand-drawn-pink",
      "lastViewedAt": "2026-01-03T09:00:00Z"
    }
  }
}
```

---

### 2.3 创建新星球

```http
POST /planets
```

**请求参数**:
```json
{
  "year": 2026,
  "planetName": "2026星球",
  "planetColor": "#4ECDC4"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "planetId": 1,
    "year": 2026,
    "planetName": "2026星球",
    "planetColor": "#4ECDC4",
    "status": "creating",
    "totalFocusHours": 0,
    "meditationCompleted": false,
    "createdAt": "2026-01-03T10:00:00Z"
  }
}
```

---

### 2.4 更新星球信息

```http
PUT /planets/:planetId
```

**请求参数**:
```json
{
  "planetName": "我的2026",
  "planetColor": "#FF6B8B",
  "status": "active"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "planetId": 1,
    "planetName": "我的2026",
    "planetColor": "#FF6B8B",
    "updatedAt": "2026-01-03T10:00:00Z"
  }
}
```

---

### 2.5 标记冥想完成

```http
POST /planets/:planetId/meditation/complete
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "planetId": 1,
    "meditationCompleted": true,
    "meditationCompletedAt": "2026-01-03T10:00:00Z"
  }
}
```

---

### 2.6 删除星球

```http
DELETE /planets/:planetId
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "planetId": 1,
    "deleted": true
  }
}
```

---

## 三、愿望碎片模块

### 3.1 获取星球的所有愿望

```http
GET /planets/:planetId/wishes
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "wishId": 1,
      "planetId": 1,
      "orderIndex": 1,
      "wishText": "健康有活力的身体",
      "wishType": "health",
      "wishIcon": "fa-heartbeat",
      "focusHours": 35.5,
      "displayLevel": 2,
      "isCompleted": false,
      "completedAt": null,
      "createdAt": "2026-01-01T11:00:00Z",
      "updatedAt": "2026-01-03T10:00:00Z",
      "images": [
        {
          "imageId": 1,
          "imageUrl": "https://cdn.example.com/wish1.jpg",
          "thumbnailUrl": "https://cdn.example.com/wish1_thumb.jpg"
        }
      ]
    }
  ]
}
```

---

### 3.2 创建愿望碎片

```http
POST /planets/:planetId/wishes
```

**请求参数**:
```json
{
  "wishText": "健康有活力的身体",
  "wishType": "health",
  "wishIcon": "fa-heartbeat",
  "orderIndex": 1
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "wishId": 1,
    "planetId": 1,
    "orderIndex": 1,
    "wishText": "健康有活力的身体",
    "wishType": "health",
    "wishIcon": "fa-heartbeat",
    "focusHours": 0,
    "displayLevel": 0,
    "createdAt": "2026-01-03T10:00:00Z"
  }
}
```

---

### 3.3 批量创建愿望碎片

```http
POST /planets/:planetId/wishes/batch
```

**请求参数**:
```json
{
  "wishes": [
    {
      "wishText": "健康有活力的身体",
      "wishType": "health",
      "orderIndex": 1
    },
    {
      "wishText": "学会弹吉他",
      "wishType": "learning",
      "orderIndex": 2
    }
  ]
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "created": 2,
    "wishes": [
      {
        "wishId": 1,
        "wishText": "健康有活力的身体"
      },
      {
        "wishId": 2,
        "wishText": "学会弹吉他"
      }
    ]
  }
}
```

---

### 3.4 更新愿望碎片

```http
PUT /wishes/:wishId
```

**请求参数**:
```json
{
  "wishText": "每周运动3次",
  "wishType": "health",
  "orderIndex": 1
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "wishId": 1,
    "wishText": "每周运动3次",
    "updatedAt": "2026-01-03T10:00:00Z"
  }
}
```

---

### 3.5 标记愿望完成

```http
POST /wishes/:wishId/complete
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "wishId": 1,
    "isCompleted": true,
    "completedAt": "2026-01-03T10:00:00Z"
  }
}
```

---

### 3.6 删除愿望碎片

```http
DELETE /wishes/:wishId
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "wishId": 1,
    "deleted": true
  }
}
```

---

## 四、愿望图片模块

### 4.1 上传愿望图片

```http
POST /wishes/:wishId/images
```

**请求头**:
```
Content-Type: multipart/form-data
```

**请求参数**:
```
file: (binary)
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "imageId": 1,
    "wishId": 1,
    "imageUrl": "https://cdn.example.com/images/wish1_abc123.jpg",
    "thumbnailUrl": "https://cdn.example.com/images/wish1_abc123_thumb.jpg",
    "storageType": "ipfs",
    "ipfsHash": "QmXyZ123...",
    "fileSize": 1024000,
    "width": 1920,
    "height": 1080,
    "uploadedAt": "2026-01-03T10:00:00Z"
  }
}
```

---

### 4.2 删除愿望图片

```http
DELETE /images/:imageId
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "imageId": 1,
    "deleted": true
  }
}
```

---

## 五、愿景板模块

### 5.1 获取愿景板配置

```http
GET /planets/:planetId/vision-board
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "boardId": 1,
    "planetId": 1,
    "layoutType": "grid",
    "backgroundColor": "#FFF9F0",
    "backgroundImageUrl": null,
    "frameStyle": "hand-drawn-pink",
    "stickers": [
      {
        "id": "sticker1",
        "type": "star",
        "x": 100,
        "y": 200,
        "size": 50,
        "rotation": 45
      }
    ],
    "textElements": [
      {
        "id": "text1",
        "text": "2026愿景",
        "x": 300,
        "y": 100,
        "fontSize": 24,
        "color": "#333333"
      }
    ],
    "boardData": {},
    "version": 1,
    "lastViewedAt": "2026-01-03T09:00:00Z",
    "createdAt": "2026-01-01T11:00:00Z",
    "updatedAt": "2026-01-03T10:00:00Z"
  }
}
```

---

### 5.2 保存/更新愿景板配置

```http
PUT /planets/:planetId/vision-board
```

**请求参数**:
```json
{
  "layoutType": "grid",
  "backgroundColor": "#FFF9F0",
  "frameStyle": "hand-drawn-pink",
  "stickers": [
    {
      "id": "sticker1",
      "type": "star",
      "x": 100,
      "y": 200,
      "size": 50,
      "rotation": 45
    }
  ],
  "textElements": [
    {
      "id": "text1",
      "text": "2026愿景",
      "x": 300,
      "y": 100,
      "fontSize": 24,
      "color": "#333333"
    }
  ],
  "boardData": {}
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "boardId": 1,
    "version": 2,
    "updatedAt": "2026-01-03T10:00:00Z"
  }
}
```

---

## 六、专注时光模块

### 6.1 记录专注会话

```http
POST /focus-sessions
```

**请求参数**:
```json
{
  "planetId": 1,
  "wishId": 1,
  "sessionType": "manual",
  "durationMinutes": 60,
  "focusHours": 1.0,
  "startTime": "2026-01-03T10:00:00Z",
  "endTime": "2026-01-03T11:00:00Z",
  "sessionNote": "完成了30分钟深度学习",
  "qualityRating": 5,
  "interruptions": 0,
  "isCompleted": true
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "sessionId": 123,
    "planetId": 1,
    "wishId": 1,
    "focusHours": 1.0,
    "createdAt": "2026-01-03T11:00:00Z",
    "milestoneReached": {
      "reached": true,
      "type": "wish_30h",
      "message": "🌿 恭喜!该愿望已累计30小时,进入微光荧光阶段!"
    },
    "wishUpdated": {
      "wishId": 1,
      "totalFocusHours": 30.0,
      "displayLevel": 2
    },
    "planetUpdated": {
      "planetId": 1,
      "totalFocusHours": 156.5
    }
  }
}
```

---

### 6.2 获取专注会话列表

```http
GET /focus-sessions
```

**查询参数**:
- `planetId` (可选): 筛选特定星球
- `wishId` (可选): 筛选特定愿望
- `startDate` (可选): 开始日期 (YYYY-MM-DD)
- `endDate` (可选): 结束日期 (YYYY-MM-DD)
- `page` (可选): 页码,默认1
- `pageSize` (可选): 每页数量,默认20

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "sessionId": 123,
        "planetId": 1,
        "wishId": 1,
        "wishText": "健康有活力的身体",
        "sessionType": "manual",
        "durationMinutes": 60,
        "focusHours": 1.0,
        "startTime": "2026-01-03T10:00:00Z",
        "endTime": "2026-01-03T11:00:00Z",
        "qualityRating": 5,
        "isCompleted": true,
        "createdAt": "2026-01-03T11:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 50,
      "totalPages": 3
    },
    "summary": {
      "totalHours": 50.0,
      "totalSessions": 50,
      "averageDuration": 60
    }
  }
}
```

---

### 6.3 获取专注统计数据

```http
GET /planets/:planetId/focus-statistics
```

**查询参数**:
- `period` (可选): 统计周期 (day/week/month/year),默认 month
- `startDate` (可选): 开始日期
- `endDate` (可选): 结束日期

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalHours": 156.5,
    "totalSessions": 200,
    "averageSessionDuration": 47,
    "currentStreak": 12,
    "longestStreak": 45,
    "dailyStats": [
      {
        "date": "2026-01-03",
        "hours": 5.5,
        "sessions": 8
      },
      {
        "date": "2026-01-02",
        "hours": 4.0,
        "sessions": 6
      }
    ],
    "wishDistribution": [
      {
        "wishId": 1,
        "wishText": "健康有活力的身体",
        "hours": 35.5,
        "percentage": 22.7
      }
    ],
    "hourlyDistribution": [
      {
        "hour": 9,
        "hours": 25.0,
        "percentage": 16.0
      }
    ]
  }
}
```

---

## 七、里程碑模块

### 7.1 获取里程碑列表

```http
GET /milestones
```

**查询参数**:
- `planetId` (可选): 筛选特定星球
- `wishId` (可选): 筛选特定愿望
- `milestoneType` (可选): 里程碑类型

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "milestoneId": 1,
      "planetId": 1,
      "wishId": 1,
      "milestoneType": "wish_30h",
      "hoursThreshold": 30.0,
      "iconName": "🌿",
      "rewardText": "愿望进入微光荧光阶段",
      "achievedAt": "2026-01-03T10:00:00Z",
      "notificationSent": true
    }
  ]
}
```

---

## 八、投币记录模块

### 8.1 记录投币动画

```http
POST /coin-deposits
```

**请求参数**:
```json
{
  "planetId": 1,
  "wishId": 1,
  "sessionId": 123,
  "hoursDeposited": 1.0,
  "animationType": "coin",
  "milestoneReached": "30h"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "depositId": 456,
    "planetId": 1,
    "wishId": 1,
    "hoursDeposited": 1.0,
    "depositedAt": "2026-01-03T10:00:00Z"
  }
}
```

---

### 8.2 获取投币历史

```http
GET /coin-deposits
```

**查询参数**:
- `planetId` (可选): 筛选特定星球
- `wishId` (可选): 筛选特定愿望
- `page` (可选): 页码
- `pageSize` (可选): 每页数量

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "depositId": 456,
        "planetId": 1,
        "wishId": 1,
        "hoursDeposited": 1.0,
        "animationType": "coin",
        "milestoneReached": "30h",
        "depositedAt": "2026-01-03T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

## 九、NFT 模块

### 9.1 生成 NFT 元数据

```http
POST /planets/:planetId/nft/generate-metadata
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "name": "VisionFocus Hours - 2026",
    "description": "2026年度专注时光记录",
    "image": "ipfs://QmXyZ123.../vision-board.png",
    "external_url": "https://visionfocushours.app/planets/1",
    "attributes": [
      {
        "trait_type": "年份",
        "value": 2026
      },
      {
        "trait_type": "总专注时间",
        "value": 156.5,
        "display_type": "number",
        "unit": "小时"
      },
      {
        "trait_type": "愿望数量",
        "value": 8
      },
      {
        "trait_type": "完成的愿望",
        "value": 2
      },
      {
        "trait_type": "成就等级",
        "value": "Silver"
      },
      {
        "trait_type": "连续专注天数",
        "value": 45
      }
    ],
    "properties": {
      "created_at": "2026-01-01T10:00:00Z",
      "planet_id": 1,
      "user_wallet": "0x1234567890abcdef1234567890abcdef12345678"
    }
  }
}
```

---

### 9.2 上传元数据到 IPFS

```http
POST /planets/:planetId/nft/upload-metadata
```

**请求参数**:
```json
{
  "metadata": {
    "name": "VisionFocus Hours - 2026",
    "description": "2026年度专注时光记录",
    "image": "ipfs://QmXyZ123.../vision-board.png",
    "attributes": []
  },
  "imageBase64": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "metadataIpfsHash": "QmAbc456...",
    "metadataUri": "ipfs://QmAbc456.../metadata.json",
    "imageIpfsHash": "QmXyZ123...",
    "imageUri": "ipfs://QmXyZ123.../vision-board.png"
  }
}
```

---

### 9.3 铸造 NFT

```http
POST /planets/:planetId/nft/mint
```

**请求参数**:
```json
{
  "tokenUri": "ipfs://QmAbc456.../metadata.json",
  "network": "sepolia"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "nftId": 1,
    "planetId": 1,
    "tokenId": "1",
    "contractAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
    "network": "sepolia",
    "tokenUri": "ipfs://QmAbc456.../metadata.json",
    "mintStatus": "pending",
    "mintTransactionHash": null,
    "estimatedMintTime": 60,
    "createdAt": "2026-01-03T10:00:00Z"
  }
}
```

---

### 9.4 查询 NFT 铸造状态

```http
GET /nft/:nftId/status
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "nftId": 1,
    "mintStatus": "minted",
    "mintTransactionHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "mintedAt": "2026-01-03T10:05:00Z",
    "blockNumber": 12345678,
    "gasUsed": "0.001",
    "explorerUrl": "https://sepolia.etherscan.io/tx/0x1234..."
  }
}
```

---

### 9.5 获取用户的 NFT 列表

```http
GET /users/me/nfts
```

**查询参数**:
- `network` (可选): 筛选网络 (sepolia/mainnet)
- `page` (可选): 页码
- `pageSize` (可选): 每页数量

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "nftId": 1,
        "planetId": 1,
        "year": 2026,
        "tokenId": "1",
        "contractAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
        "network": "sepolia",
        "tokenUri": "ipfs://QmAbc456.../metadata.json",
        "imageUrl": "ipfs://QmXyZ123.../vision-board.png",
        "mintStatus": "minted",
        "totalFocusHours": 156.5,
        "achievementLevel": "Silver",
        "mintedAt": "2026-01-03T10:05:00Z",
        "metadata": {
          "name": "VisionFocus Hours - 2026",
          "attributes": []
        }
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

---

## 十、通知模块

### 10.1 获取通知列表

```http
GET /notifications
```

**查询参数**:
- `isRead` (可选): 筛选已读/未读 (true/false)
- `notificationType` (可选): 筛选类型
- `page` (可选): 页码
- `pageSize` (可选): 每页数量

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "notificationId": 1,
        "notificationType": "milestone",
        "title": "里程碑达成!",
        "content": "恭喜!你的愿望"健康有活力的身体"已累计30小时专注时光!",
        "icon": "🌿",
        "relatedEntityType": "wish",
        "relatedEntityId": 1,
        "linkUrl": "/planets/1/wishes/1",
        "priority": "high",
        "isRead": false,
        "readAt": null,
        "createdAt": "2026-01-03T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 10,
      "totalPages": 1
    },
    "unreadCount": 5
  }
}
```

---

### 10.2 标记通知为已读

```http
PUT /notifications/:notificationId/read
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "notificationId": 1,
    "isRead": true,
    "readAt": "2026-01-03T10:00:00Z"
  }
}
```

---

### 10.3 批量标记已读

```http
PUT /notifications/read-all
```

**请求参数**:
```json
{
  "notificationIds": [1, 2, 3]
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "updated": 3
  }
}
```

---

### 10.4 删除通知

```http
DELETE /notifications/:notificationId
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "notificationId": 1,
    "deleted": true
  }
}
```

---

## 十一、系统模块

### 11.1 获取系统配置

```http
GET /system/configs
```

**查询参数**:
- `keys` (可选): 逗号分隔的配置键名列表

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "nft_contract_address_sepolia": "0xabcdef1234567890abcdef1234567890abcdef12",
    "max_wishes_per_planet": 12,
    "min_focus_session_minutes": 5,
    "milestone_thresholds": [10, 30, 60, 100],
    "supported_image_formats": ["jpg", "jpeg", "png", "webp"],
    "max_image_size_mb": 10
  }
}
```

---

### 11.2 健康检查

```http
GET /health
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "status": "ok",
    "timestamp": "2026-01-03T10:00:00Z",
    "services": {
      "database": "ok",
      "redis": "ok",
      "ipfs": "ok",
      "blockchain": "ok"
    },
    "version": "1.0.0"
  }
}
```

---

## 十二、数据导出模块

### 12.1 导出用户数据

```http
GET /users/me/export
```

**查询参数**:
- `format` (可选): 导出格式 (json/csv),默认 json
- `includeImages` (可选): 是否包含图片 (true/false),默认 false

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "exportId": "export_123456789",
    "status": "processing",
    "estimatedTime": 60,
    "downloadUrl": null
  }
}
```

---

### 12.2 查询导出状态

```http
GET /exports/:exportId
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "exportId": "export_123456789",
    "status": "completed",
    "downloadUrl": "https://cdn.example.com/exports/export_123456789.zip",
    "fileSize": 10240000,
    "expiresAt": "2026-01-10T10:00:00Z",
    "createdAt": "2026-01-03T10:00:00Z"
  }
}
```

---

## WebSocket 接口

### 连接 WebSocket

```
wss://api.visionfocushours.app/v1/ws
```

### 认证

连接后发送:
```json
{
  "type": "auth",
  "token": "jwt_token_here"
}
```

### 订阅事件

```json
{
  "type": "subscribe",
  "events": ["milestone", "notification", "nft_status"]
}
```

### 服务端推送事件

#### 里程碑达成
```json
{
  "type": "milestone",
  "data": {
    "milestoneId": 1,
    "milestoneType": "wish_30h",
    "wishId": 1,
    "message": "恭喜!该愿望已累计30小时!",
    "timestamp": "2026-01-03T10:00:00Z"
  }
}
```

#### 新通知
```json
{
  "type": "notification",
  "data": {
    "notificationId": 1,
    "title": "里程碑达成!",
    "content": "恭喜!你的愿望已累计30小时专注时光!",
    "timestamp": "2026-01-03T10:00:00Z"
  }
}
```

#### NFT 铸造状态更新
```json
{
  "type": "nft_status",
  "data": {
    "nftId": 1,
    "status": "minted",
    "transactionHash": "0x1234...",
    "timestamp": "2026-01-03T10:05:00Z"
  }
}
```

---

## 限流策略

### 全局限流
- 每个 IP: 1000 请求/小时
- 每个用户: 5000 请求/小时

### 特殊限流
- 文件上传: 10 次/小时
- NFT 铸造: 5 次/天
- 数据导出: 3 次/天

---

## 缓存策略

### Redis 缓存
- 用户信息: 1小时
- 星球列表: 30分钟
- 愿景板配置: 15分钟
- 统计数据: 10分钟
- 系统配置: 24小时

---

## 安全建议

### 1. HTTPS
所有接口必须使用 HTTPS

### 2. CORS
配置适当的 CORS 策略

### 3. 请求签名
敏感操作(如 NFT 铸造)需要额外的请求签名验证

### 4. 数据加密
敏感数据(如钱包私钥)必须加密存储

### 5. 审计日志
所有重要操作记录审计日志

---

## 版本管理

### API 版本
当前版本: v1

### 版本策略
- 向后兼容的更改: 不增加版本号
- 破坏性更改: 增加大版本号
- 保留旧版本至少 6 个月

---

## 示例代码

### JavaScript/Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.visionfocushours.app/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器(自动添加 Token)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 使用示例
async function createPlanet(year) {
  try {
    const response = await api.post('/planets', {
      year: year,
      planetName: `${year}星球`
    });
    return response.data.data;
  } catch (error) {
    console.error('创建星球失败:', error.response.data);
    throw error;
  }
}

async function depositFocusHours(wishId, hours) {
  try {
    const response = await api.post('/focus-sessions', {
      planetId: 1,
      wishId: wishId,
      sessionType: 'manual',
      durationMinutes: hours * 60,
      focusHours: hours,
      startTime: new Date().toISOString(),
      isCompleted: true
    });
    return response.data.data;
  } catch (error) {
    console.error('记录专注失败:', error);
    throw error;
  }
}
```

---

## 总结

这套 API 设计涵盖了 VisionFocus Hours 项目的所有核心功能:

✅ 用户认证与管理  
✅ 星球创建与管理  
✅ 愿望碎片 CRUD  
✅ 愿景板配置  
✅ 专注时光记录  
✅ 显化效果与里程碑  
✅ NFT 生成与铸造  
✅ 通知系统  
✅ 数据统计与导出  
✅ WebSocket 实时推送  

建议使用 Swagger/OpenAPI 生成交互式 API 文档!

