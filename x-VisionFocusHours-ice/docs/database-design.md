# VisionFocus Hours - 数据库设计文档

## 项目概述
VisionFocus Hours 是一个结合冥想引导、愿景可视化与时间投资的Web3 DApp。用户通过专注时间的投入,将愿景逐步显化,最终生成年度NFT纪念。

## 设计原则
1. **用户隔离**: 每个用户拥有独立的数据空间,不支持越权访问
2. **年度独立**: 每年生成独立的星球数据,便于多年度管理
3. **Web3兼容**: 支持钱包地址作为唯一标识
4. **可扩展性**: 为未来功能(社交、团队版)预留扩展空间

---

## 数据库表结构设计

### 1. 用户表 (users)
存储用户基本信息和钱包关联

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| user_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 用户唯一ID |
| wallet_address | VARCHAR(42) | UNIQUE, NOT NULL | 以太坊钱包地址 (0x...) |
| username | VARCHAR(50) | | 用户昵称 |
| avatar_url | VARCHAR(255) | | 用户头像URL |
| email | VARCHAR(100) | | 邮箱(可选) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 注册时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| last_login_at | TIMESTAMP | | 最后登录时间 |
| is_active | BOOLEAN | DEFAULT TRUE | 账户是否激活 |
| preferences | JSON | | 用户偏好设置(语言、主题等) |

**索引**:
- PRIMARY KEY: `user_id`
- UNIQUE INDEX: `wallet_address`
- INDEX: `created_at`

---

### 2. 年度星球表 (planets)
存储每个用户每年的星球数据

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| planet_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 星球唯一ID |
| user_id | BIGINT | FOREIGN KEY → users(user_id), NOT NULL | 所属用户ID |
| year | YEAR | NOT NULL | 星球对应年份(如2026) |
| planet_name | VARCHAR(100) | DEFAULT '2026星球' | 星球名称 |
| planet_color | VARCHAR(20) | DEFAULT '#4ECDC4' | 星球主题色 |
| status | ENUM | NOT NULL | 星球状态: 'creating', 'active', 'completed', 'archived' |
| total_focus_hours | DECIMAL(10,2) | DEFAULT 0 | 累计专注时间(小时) |
| completion_rate | DECIMAL(5,2) | DEFAULT 0 | 完成度百分比(0-100) |
| meditation_completed | BOOLEAN | DEFAULT FALSE | 是否完成冥想引导 |
| meditation_completed_at | TIMESTAMP | | 完成冥想引导的时间 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| nft_minted | BOOLEAN | DEFAULT FALSE | 是否已铸造NFT |
| nft_token_id | VARCHAR(100) | | NFT Token ID |
| nft_contract_address | VARCHAR(42) | | NFT合约地址 |
| nft_token_uri | VARCHAR(500) | | NFT元数据URI |

**索引**:
- PRIMARY KEY: `planet_id`
- UNIQUE INDEX: `user_id, year`
- INDEX: `user_id, status`
- INDEX: `year`

---

### 3. 愿望碎片表 (wishes)
存储用户在冥想后输入的愿望碎片

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| wish_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 愿望唯一ID |
| planet_id | BIGINT | FOREIGN KEY → planets(planet_id), NOT NULL | 所属星球ID |
| user_id | BIGINT | FOREIGN KEY → users(user_id), NOT NULL | 所属用户ID |
| order_index | INT | NOT NULL | 显示顺序(1-12) |
| wish_text | VARCHAR(200) | NOT NULL | 愿望文本内容 |
| wish_type | ENUM | | 愿望类型: 'health', 'learning', 'travel', 'finance', 'relationship', 'creative', 'habit', 'contribution' |
| wish_icon | VARCHAR(50) | | 愿望图标(Font Awesome类名) |
| focus_hours | DECIMAL(10,2) | DEFAULT 0 | 该愿望累计专注时间 |
| display_level | INT | DEFAULT 0 | 显化等级(0-4): 0=初始, 1=星星点点(10h), 2=微光荧光(30h), 3=金色流光(60h), 4=钻石七彩(100h) |
| is_completed | BOOLEAN | DEFAULT FALSE | 是否已完成 |
| completed_at | TIMESTAMP | | 完成时间 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- PRIMARY KEY: `wish_id`
- INDEX: `planet_id, order_index`
- INDEX: `user_id, planet_id`

---

### 4. 愿景板配置表 (vision_boards)
存储愿景板的设计和配置信息

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| board_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 愿景板唯一ID |
| planet_id | BIGINT | FOREIGN KEY → planets(planet_id), NOT NULL, UNIQUE | 所属星球ID(一对一) |
| user_id | BIGINT | FOREIGN KEY → users(user_id), NOT NULL | 所属用户ID |
| layout_type | VARCHAR(50) | DEFAULT 'grid' | 布局类型: 'grid', 'mosaic', 'circle', 'star' |
| background_color | VARCHAR(20) | DEFAULT '#FFF9F0' | 背景色 |
| background_image_url | VARCHAR(500) | | 背景图片URL |
| frame_style | VARCHAR(50) | DEFAULT 'hand-drawn-pink' | 相框风格 |
| stickers | JSON | | 贴纸配置数组 [{id, type, x, y, size, rotation}] |
| text_elements | JSON | | 文字元素配置 [{id, text, x, y, fontSize, color}] |
| board_data | JSON | | 完整愿景板数据(包含所有元素位置、样式等) |
| version | INT | DEFAULT 1 | 版本号 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| last_viewed_at | TIMESTAMP | | 最后查看时间 |

**索引**:
- PRIMARY KEY: `board_id`
- UNIQUE INDEX: `planet_id`
- INDEX: `user_id`

---

### 5. 愿望图片表 (wish_images)
存储与愿望关联的图片

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| image_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 图片唯一ID |
| wish_id | BIGINT | FOREIGN KEY → wishes(wish_id), NOT NULL | 所属愿望ID |
| user_id | BIGINT | FOREIGN KEY → users(user_id), NOT NULL | 上传者用户ID |
| image_url | VARCHAR(500) | NOT NULL | 图片URL |
| image_thumbnail_url | VARCHAR(500) | | 缩略图URL |
| storage_type | ENUM | DEFAULT 'local' | 存储类型: 'local', 'ipfs', 'cloudflare', 'aws_s3' |
| ipfs_hash | VARCHAR(100) | | IPFS哈希值(如使用IPFS存储) |
| file_size | BIGINT | | 文件大小(字节) |
| width | INT | | 图片宽度 |
| height | INT | | 图片高度 |
| uploaded_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 上传时间 |
| is_deleted | BOOLEAN | DEFAULT FALSE | 是否已删除(软删除) |

**索引**:
- PRIMARY KEY: `image_id`
- INDEX: `wish_id`
- INDEX: `user_id, uploaded_at`

---

### 6. 专注时光记录表 (focus_sessions)
记录每次专注时间的投入

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| session_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 会话唯一ID |
| user_id | BIGINT | FOREIGN KEY → users(user_id), NOT NULL | 用户ID |
| planet_id | BIGINT | FOREIGN KEY → planets(planet_id), NOT NULL | 星球ID |
| wish_id | BIGINT | FOREIGN KEY → wishes(wish_id) | 关联的愿望ID(可为空,表示整体专注) |
| session_type | ENUM | NOT NULL | 会话类型: 'manual', 'pomodoro', 'deep_work' |
| duration_minutes | INT | NOT NULL | 持续时长(分钟) |
| focus_hours | DECIMAL(10,2) | NOT NULL | 折算专注时光(小时) |
| start_time | TIMESTAMP | NOT NULL | 开始时间 |
| end_time | TIMESTAMP | | 结束时间 |
| session_note | TEXT | | 会话备注 |
| quality_rating | TINYINT | | 专注质量评分(1-5) |
| interruptions | INT | DEFAULT 0 | 中断次数 |
| is_completed | BOOLEAN | DEFAULT TRUE | 是否完成(未中途放弃) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引**:
- PRIMARY KEY: `session_id`
- INDEX: `user_id, planet_id, start_time`
- INDEX: `wish_id`
- INDEX: `start_time DESC`

---

### 7. 投币动画记录表 (coin_deposits)
记录每次"存入专注时光"的投币动画触发

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| deposit_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 投币记录ID |
| user_id | BIGINT | FOREIGN KEY → users(user_id), NOT NULL | 用户ID |
| planet_id | BIGINT | FOREIGN KEY → planets(planet_id), NOT NULL | 星球ID |
| wish_id | BIGINT | FOREIGN KEY → wishes(wish_id) | 目标愿望ID |
| session_id | BIGINT | FOREIGN KEY → focus_sessions(session_id) | 关联的专注会话ID |
| hours_deposited | DECIMAL(10,2) | NOT NULL | 存入的时光数量(小时) |
| animation_type | VARCHAR(50) | DEFAULT 'coin' | 动画类型: 'coin', 'hourglass', 'light' |
| milestone_reached | VARCHAR(50) | | 触发的里程碑: '10h', '30h', '60h', '100h' |
| reward_given | VARCHAR(100) | | 奖励内容(音效、特效名称) |
| deposited_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 投币时间 |

**索引**:
- PRIMARY KEY: `deposit_id`
- INDEX: `user_id, planet_id`
- INDEX: `wish_id`
- INDEX: `deposited_at DESC`

---

### 8. 显化效果记录表 (manifestation_effects)
记录愿望的显化效果变化历史

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| effect_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 效果记录ID |
| wish_id | BIGINT | FOREIGN KEY → wishes(wish_id), NOT NULL | 愿望ID |
| user_id | BIGINT | FOREIGN KEY → users(user_id), NOT NULL | 用户ID |
| previous_level | INT | NOT NULL | 之前的显化等级(0-4) |
| current_level | INT | NOT NULL | 当前的显化等级(0-4) |
| effect_name | VARCHAR(50) | NOT NULL | 效果名称: 'spark', 'glow', 'golden_flow', 'diamond_rainbow' |
| total_hours_at_change | DECIMAL(10,2) | NOT NULL | 变化时的累计时间 |
| triggered_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 触发时间 |
| celebration_shown | BOOLEAN | DEFAULT TRUE | 是否已展示庆祝动画 |

**索引**:
- PRIMARY KEY: `effect_id`
- INDEX: `wish_id, triggered_at DESC`
- INDEX: `user_id, current_level`

---

### 9. 年度NFT记录表 (yearly_nfts)
记录年终生成的NFT信息

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| nft_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | NFT记录ID |
| user_id | BIGINT | FOREIGN KEY → users(user_id), NOT NULL | 用户ID |
| planet_id | BIGINT | FOREIGN KEY → planets(planet_id), NOT NULL, UNIQUE | 星球ID(一对一) |
| year | YEAR | NOT NULL | 年份 |
| token_id | VARCHAR(100) | UNIQUE | 链上Token ID |
| contract_address | VARCHAR(42) | NOT NULL | 合约地址 |
| network | VARCHAR(50) | DEFAULT 'sepolia' | 网络: 'sepolia', 'mainnet', 'polygon' |
| token_uri | VARCHAR(500) | | Token URI(元数据地址) |
| ipfs_metadata_hash | VARCHAR(100) | | IPFS元数据哈希 |
| ipfs_image_hash | VARCHAR(100) | | IPFS图片哈希 |
| nft_metadata | JSON | | NFT元数据JSON |
| mint_transaction_hash | VARCHAR(66) | | 铸造交易哈希 |
| mint_status | ENUM | NOT NULL | 铸造状态: 'pending', 'minting', 'minted', 'failed' |
| total_focus_hours | DECIMAL(10,2) | NOT NULL | NFT记录的总专注时间 |
| wishes_completed | INT | DEFAULT 0 | 完成的愿望数量 |
| achievement_level | VARCHAR(50) | | 成就等级: 'bronze', 'silver', 'gold', 'platinum', 'diamond' |
| minted_at | TIMESTAMP | | 铸造成功时间 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引**:
- PRIMARY KEY: `nft_id`
- UNIQUE INDEX: `planet_id`
- UNIQUE INDEX: `token_id, contract_address`
- INDEX: `user_id, year DESC`

---

### 10. 时光里程碑表 (focus_milestones)
记录达成的专注时光里程碑

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| milestone_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 里程碑ID |
| user_id | BIGINT | FOREIGN KEY → users(user_id), NOT NULL | 用户ID |
| planet_id | BIGINT | FOREIGN KEY → planets(planet_id), NOT NULL | 星球ID |
| wish_id | BIGINT | FOREIGN KEY → wishes(wish_id) | 愿望ID(可为空,表示全局里程碑) |
| milestone_type | VARCHAR(50) | NOT NULL | 里程碑类型: 'wish_10h', 'wish_30h', 'wish_60h', 'wish_100h', 'planet_100h', 'planet_500h', 'planet_1000h' |
| hours_threshold | DECIMAL(10,2) | NOT NULL | 时间阈值(小时) |
| icon_name | VARCHAR(50) | | 图标: '🌱', '🌿', '🌸', '🍎', '🏆' |
| reward_text | VARCHAR(200) | | 奖励文本描述 |
| achieved_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 达成时间 |
| notification_sent | BOOLEAN | DEFAULT FALSE | 是否已发送通知 |

**索引**:
- PRIMARY KEY: `milestone_id`
- INDEX: `user_id, planet_id`
- INDEX: `wish_id`
- INDEX: `achieved_at DESC`

---

### 11. 番茄钟记录表 (pomodoro_sessions)
记录番茄钟专注计时器的使用

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| pomodoro_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 番茄钟ID |
| session_id | BIGINT | FOREIGN KEY → focus_sessions(session_id) | 关联的专注会话ID |
| user_id | BIGINT | FOREIGN KEY → users(user_id), NOT NULL | 用户ID |
| planet_id | BIGINT | FOREIGN KEY → planets(planet_id), NOT NULL | 星球ID |
| wish_id | BIGINT | FOREIGN KEY → wishes(wish_id) | 关联愿望ID |
| work_duration | INT | DEFAULT 25 | 工作时长(分钟) |
| break_duration | INT | DEFAULT 5 | 休息时长(分钟) |
| completed_rounds | INT | DEFAULT 0 | 完成的轮次 |
| total_rounds | INT | DEFAULT 4 | 计划总轮次 |
| start_time | TIMESTAMP | NOT NULL | 开始时间 |
| end_time | TIMESTAMP | | 结束时间 |
| is_completed | BOOLEAN | DEFAULT FALSE | 是否完成全部轮次 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引**:
- PRIMARY KEY: `pomodoro_id`
- INDEX: `session_id`
- INDEX: `user_id, planet_id`
- INDEX: `start_time DESC`

---

### 12. 用户通知表 (notifications)
存储用户通知和提醒

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| notification_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 通知ID |
| user_id | BIGINT | FOREIGN KEY → users(user_id), NOT NULL | 用户ID |
| notification_type | VARCHAR(50) | NOT NULL | 通知类型: 'milestone', 'reminder', 'achievement', 'system' |
| title | VARCHAR(200) | NOT NULL | 通知标题 |
| content | TEXT | NOT NULL | 通知内容 |
| icon | VARCHAR(50) | | 图标emoji或类名 |
| related_entity_type | VARCHAR(50) | | 关联实体类型: 'planet', 'wish', 'session', 'nft' |
| related_entity_id | BIGINT | | 关联实体ID |
| link_url | VARCHAR(500) | | 点击跳转链接 |
| priority | ENUM | DEFAULT 'normal' | 优先级: 'low', 'normal', 'high', 'urgent' |
| is_read | BOOLEAN | DEFAULT FALSE | 是否已读 |
| read_at | TIMESTAMP | | 阅读时间 |
| is_deleted | BOOLEAN | DEFAULT FALSE | 是否已删除 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引**:
- PRIMARY KEY: `notification_id`
- INDEX: `user_id, is_read, created_at DESC`
- INDEX: `user_id, notification_type`

---

### 13. 用户统计表 (user_statistics)
存储用户的统计数据(用于仪表板展示)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| stat_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 统计ID |
| user_id | BIGINT | FOREIGN KEY → users(user_id), NOT NULL, UNIQUE | 用户ID(一对一) |
| total_planets | INT | DEFAULT 0 | 创建的星球总数 |
| total_wishes | INT | DEFAULT 0 | 创建的愿望总数 |
| total_focus_hours | DECIMAL(10,2) | DEFAULT 0 | 累计专注时间(全部年份) |
| total_sessions | INT | DEFAULT 0 | 累计专注会话数 |
| total_nfts_minted | INT | DEFAULT 0 | 铸造的NFT总数 |
| longest_streak_days | INT | DEFAULT 0 | 最长连续专注天数 |
| current_streak_days | INT | DEFAULT 0 | 当前连续专注天数 |
| last_focus_date | DATE | | 最后专注日期 |
| average_session_duration | INT | | 平均会话时长(分钟) |
| favorite_wish_type | VARCHAR(50) | | 最常投入的愿望类型 |
| most_productive_hour | TINYINT | | 最高效的时段(0-23) |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- PRIMARY KEY: `stat_id`
- UNIQUE INDEX: `user_id`

---

### 14. 系统配置表 (system_configs)
存储系统级配置和参数

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| config_id | INT | PRIMARY KEY, AUTO_INCREMENT | 配置ID |
| config_key | VARCHAR(100) | UNIQUE, NOT NULL | 配置键名 |
| config_value | TEXT | NOT NULL | 配置值(可以是JSON) |
| config_type | VARCHAR(50) | DEFAULT 'string' | 值类型: 'string', 'number', 'boolean', 'json' |
| description | TEXT | | 配置说明 |
| is_public | BOOLEAN | DEFAULT FALSE | 是否公开(客户端可读) |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| updated_by | VARCHAR(100) | | 更新者 |

**索引**:
- PRIMARY KEY: `config_id`
- UNIQUE INDEX: `config_key`

---

### 15. 审计日志表 (audit_logs)
记录重要操作的审计日志

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| log_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 日志ID |
| user_id | BIGINT | FOREIGN KEY → users(user_id) | 操作用户ID |
| action_type | VARCHAR(50) | NOT NULL | 操作类型: 'create', 'update', 'delete', 'mint_nft', 'login' |
| entity_type | VARCHAR(50) | NOT NULL | 实体类型: 'planet', 'wish', 'session', 'nft' |
| entity_id | BIGINT | | 实体ID |
| old_value | JSON | | 修改前的值 |
| new_value | JSON | | 修改后的值 |
| ip_address | VARCHAR(45) | | 操作IP地址 |
| user_agent | VARCHAR(500) | | 浏览器User-Agent |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 操作时间 |

**索引**:
- PRIMARY KEY: `log_id`
- INDEX: `user_id, created_at DESC`
- INDEX: `entity_type, entity_id`
- INDEX: `action_type, created_at DESC`

---

## 关系图总结

```
users (用户)
  │
  ├──< planets (年度星球)
  │     │
  │     ├──< wishes (愿望碎片)
  │     │     │
  │     │     ├──< wish_images (愿望图片)
  │     │     ├──< manifestation_effects (显化效果)
  │     │     └──< focus_sessions (专注会话)
  │     │
  │     ├──< vision_boards (愿景板配置)
  │     ├──< focus_sessions (专注会话)
  │     ├──< coin_deposits (投币记录)
  │     ├──< focus_milestones (里程碑)
  │     ├──< pomodoro_sessions (番茄钟)
  │     └──< yearly_nfts (年度NFT)
  │
  ├──< notifications (用户通知)
  ├──< user_statistics (用户统计)
  └──< audit_logs (审计日志)
```

---

## 数据安全与隔离

### 1. 行级安全策略 (Row-Level Security)
所有用户相关表都应该实施行级安全,确保:
- 用户只能访问 `user_id` 等于当前用户ID的数据
- 通过应用层或数据库视图强制执行

### 2. 敏感数据加密
- 钱包地址: 建议存储哈希值用于索引,原始地址可选择性加密
- NFT私钥: 如果本地生成,必须使用强加密存储
- 用户邮箱: 考虑加密存储

### 3. 软删除策略
关键表(如wishes, vision_boards)使用软删除(`is_deleted`字段),方便数据恢复

---

## 索引优化建议

### 复合索引
```sql
-- 用户专注会话查询优化
CREATE INDEX idx_user_planet_session ON focus_sessions(user_id, planet_id, start_time DESC);

-- 愿望显化效果查询优化
CREATE INDEX idx_wish_effect_time ON manifestation_effects(wish_id, triggered_at DESC);

-- 用户通知未读查询优化
CREATE INDEX idx_user_unread_notif ON notifications(user_id, is_read, created_at DESC);
```

### 全文索引
```sql
-- 愿望文本搜索
CREATE FULLTEXT INDEX idx_wish_text ON wishes(wish_text);

-- 通知内容搜索
CREATE FULLTEXT INDEX idx_notification_content ON notifications(title, content);
```

---

## 分区策略 (针对大数据量场景)

### 按时间分区
对于日志类表,建议按时间分区:

```sql
-- focus_sessions 按年月分区
CREATE TABLE focus_sessions (
  ...
) PARTITION BY RANGE (YEAR(start_time) * 100 + MONTH(start_time)) (
  PARTITION p202601 VALUES LESS THAN (202602),
  PARTITION p202602 VALUES LESS THAN (202603),
  ...
  PARTITION p202612 VALUES LESS THAN (202701)
);
```

---

## 数据备份与归档

### 1. 定期备份
- **每日备份**: 所有活跃数据
- **每周完整备份**: 包含历史数据
- **每月归档**: 将超过1年的旧日志归档到冷存储

### 2. 归档策略
超过2年的以下数据可归档:
- `focus_sessions` (专注会话)
- `coin_deposits` (投币记录)
- `audit_logs` (审计日志)

---

## 缓存策略

### Redis缓存建议
```javascript
// 用户当前星球缓存 (TTL: 1小时)
redis.set(`user:${userId}:current_planet`, planetData, 3600);

// 愿景板配置缓存 (TTL: 30分钟)
redis.set(`planet:${planetId}:vision_board`, boardData, 1800);

// 用户统计缓存 (TTL: 10分钟)
redis.set(`user:${userId}:stats`, statsData, 600);

// 专注时间排行榜 (TTL: 5分钟)
redis.zadd('focus_hours_leaderboard', totalHours, userId);
```

---

## 未来扩展预留

### 社交功能 (P2 阶段)
```sql
-- 好友关系表
CREATE TABLE friendships (
  friendship_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  friend_id BIGINT NOT NULL,
  status ENUM('pending', 'accepted', 'blocked'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (friend_id) REFERENCES users(user_id)
);

-- 愿景分享表
CREATE TABLE vision_shares (
  share_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  planet_id BIGINT NOT NULL,
  share_type ENUM('public', 'friends', 'private'),
  share_url VARCHAR(500) UNIQUE,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (planet_id) REFERENCES planets(planet_id)
);
```

### 团队版功能 (P2 阶段)
```sql
-- 团队表
CREATE TABLE teams (
  team_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  team_name VARCHAR(100) NOT NULL,
  creator_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(user_id)
);

-- 团队成员表
CREATE TABLE team_members (
  member_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  team_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  role ENUM('owner', 'admin', 'member'),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(team_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 团队愿景板表
CREATE TABLE team_vision_boards (
  team_board_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  team_id BIGINT NOT NULL,
  year YEAR NOT NULL,
  board_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
```

---

## SQL示例脚本

### 创建数据库
```sql
CREATE DATABASE visionfocus_hours
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE visionfocus_hours;
```

### 创建核心表 (示例)
```sql
-- 用户表
CREATE TABLE users (
  user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  username VARCHAR(50),
  avatar_url VARCHAR(255),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  preferences JSON,
  INDEX idx_wallet (wallet_address),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 星球表
CREATE TABLE planets (
  planet_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  year YEAR NOT NULL,
  planet_name VARCHAR(100) DEFAULT '2026星球',
  planet_color VARCHAR(20) DEFAULT '#4ECDC4',
  status ENUM('creating', 'active', 'completed', 'archived') NOT NULL DEFAULT 'creating',
  total_focus_hours DECIMAL(10,2) DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  meditation_completed BOOLEAN DEFAULT FALSE,
  meditation_completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  nft_minted BOOLEAN DEFAULT FALSE,
  nft_token_id VARCHAR(100),
  nft_contract_address VARCHAR(42),
  nft_token_uri VARCHAR(500),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_year (user_id, year),
  INDEX idx_user_status (user_id, status),
  INDEX idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 愿望碎片表
CREATE TABLE wishes (
  wish_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  planet_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  order_index INT NOT NULL,
  wish_text VARCHAR(200) NOT NULL,
  wish_type ENUM('health', 'learning', 'travel', 'finance', 'relationship', 'creative', 'habit', 'contribution'),
  wish_icon VARCHAR(50),
  focus_hours DECIMAL(10,2) DEFAULT 0,
  display_level INT DEFAULT 0 COMMENT '0=初始, 1=星星点点(10h), 2=微光荧光(30h), 3=金色流光(60h), 4=钻石七彩(100h)',
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (planet_id) REFERENCES planets(planet_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_planet_order (planet_id, order_index),
  INDEX idx_user_planet (user_id, planet_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 专注会话表
CREATE TABLE focus_sessions (
  session_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  planet_id BIGINT NOT NULL,
  wish_id BIGINT,
  session_type ENUM('manual', 'pomodoro', 'deep_work') NOT NULL,
  duration_minutes INT NOT NULL,
  focus_hours DECIMAL(10,2) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  session_note TEXT,
  quality_rating TINYINT,
  interruptions INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (planet_id) REFERENCES planets(planet_id) ON DELETE CASCADE,
  FOREIGN KEY (wish_id) REFERENCES wishes(wish_id) ON DELETE SET NULL,
  INDEX idx_user_planet_time (user_id, planet_id, start_time DESC),
  INDEX idx_wish (wish_id),
  INDEX idx_start_time (start_time DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 常用查询示例

### 1. 获取用户当前年度星球和愿望
```sql
SELECT 
  p.planet_id, p.year, p.total_focus_hours, p.completion_rate,
  w.wish_id, w.wish_text, w.focus_hours, w.display_level
FROM planets p
LEFT JOIN wishes w ON p.planet_id = w.planet_id
WHERE p.user_id = ? AND p.year = YEAR(CURDATE())
ORDER BY w.order_index;
```

### 2. 计算愿望的显化等级
```sql
UPDATE wishes
SET display_level = CASE
  WHEN focus_hours >= 100 THEN 4  -- 钻石七彩
  WHEN focus_hours >= 60 THEN 3   -- 金色流光
  WHEN focus_hours >= 30 THEN 2   -- 微光荧光
  WHEN focus_hours >= 10 THEN 1   -- 星星点点
  ELSE 0                          -- 初始状态
END
WHERE wish_id = ?;
```

### 3. 获取用户专注时间统计
```sql
SELECT 
  DATE(start_time) as focus_date,
  COUNT(*) as session_count,
  SUM(focus_hours) as daily_hours
FROM focus_sessions
WHERE user_id = ? AND planet_id = ?
  AND start_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(start_time)
ORDER BY focus_date DESC;
```

### 4. 检查连续专注天数
```sql
SELECT COUNT(DISTINCT DATE(start_time)) as streak_days
FROM focus_sessions
WHERE user_id = ?
  AND start_time >= (
    SELECT MIN(break_date)
    FROM (
      SELECT DATE(start_time) as focus_date,
             DATE_ADD(DATE(start_time), INTERVAL 1 DAY) as next_expected,
             LEAD(DATE(start_time)) OVER (ORDER BY start_time) as next_actual,
             CASE 
               WHEN DATE_ADD(DATE(start_time), INTERVAL 1 DAY) != LEAD(DATE(start_time)) OVER (ORDER BY start_time)
               THEN DATE_ADD(DATE(start_time), INTERVAL 1 DAY)
             END as break_date
      FROM focus_sessions
      WHERE user_id = ?
    ) breaks
    WHERE break_date IS NOT NULL
    ORDER BY break_date DESC
    LIMIT 1
  );
```

---

## 数据迁移与版本管理

建议使用数据库迁移工具(如Flyway, Liquibase, Prisma Migrate)管理数据库版本:

```
migrations/
├── V1__initial_schema.sql
├── V2__add_nft_tables.sql
├── V3__add_social_features.sql
└── V4__add_team_features.sql
```

---

## 性能监控指标

### 关键查询性能
- 用户登录查询: < 10ms
- 获取当前星球数据: < 50ms
- 保存专注会话: < 20ms
- 计算显化效果: < 100ms

### 数据库健康指标
- 连接池使用率: < 70%
- 慢查询数量: 每小时 < 10
- 表锁等待时间: < 5s
- 磁盘使用率: < 80%

---

## 总结

这套数据库设计涵盖了 VisionFocus Hours 项目的所有核心功能:
1. ✅ 用户身份与钱包管理
2. ✅ 年度星球与愿景管理
3. ✅ 专注时光记录与投币机制
4. ✅ 显化效果与里程碑系统
5. ✅ 年度NFT铸造与存储
6. ✅ 用户通知与统计
7. ✅ 审计日志与安全
8. ✅ 社交与团队功能扩展预留

设计遵循以下原则:
- **数据隔离**: 每个用户的数据完全独立
- **可扩展性**: 预留了社交和团队版功能的扩展空间
- **性能优化**: 合理的索引和缓存策略
- **数据安全**: 审计日志、软删除、行级安全

可根据实际技术栈(PostgreSQL/MySQL/MongoDB)进行适配调整。

