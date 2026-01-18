# 女书数据导入指南

## 简介

本脚本用于从 GitHub 仓库导入女书字典数据和图片数据到 PostgreSQL 数据库。支持导入 JSON、CSV、TXT 格式的字符数据和 JPG、PNG 等格式的图片数据。

## 功能

1. 自动克隆女书字符 GitHub 仓库
2. 分析仓库结构，识别女书字符相关资源
3. 创建女书字符表
4. 导入女书字符数据
5. 自动克隆女书图片 GitHub 仓库
6. 分析图片仓库结构，识别女书图片资源
7. 创建女书图片表
8. 导入女书图片数据（包含图片文件复制和数据库记录）
9. 清理临时文件

## 前提条件

- Node.js 18+
- Git
- PostgreSQL 14+

## 配置

### 环境变量

脚本支持通过环境变量配置数据库连接：

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| DB_USER | postgres | 数据库用户名 |
| DB_HOST | localhost | 数据库主机 |
| DB_NAME | nushu_protocol | 数据库名称 |
| DB_PASSWORD | 空字符串 | 数据库密码 |
| DB_PORT | 5432 | 数据库端口 |

### 脚本配置

在 `import-nushu-data.js` 文件中可以修改以下配置：

```javascript
// 女书字符仓库
const NUSHU_CHAR_REPO = 'https://github.com/nushu-script/nushu-script.github.io.git';
// 女书图片仓库
const NUSHU_IMAGE_REPO = 'https://github.com/nushu-script/nushu-nsgfzsfzt.git';

// 临时克隆目录
const CLONE_DIR = path.join(__dirname, '../temp/nushu-repo');
const IMAGE_CLONE_DIR = path.join(__dirname, '../temp/nushu-image-repo');

// 图片存储配置
const IMAGE_STORAGE_PATH = path.join(__dirname, '../public/nushu-images');
const IMAGE_BASE_URL = '/nushu-images';
```

## 使用方法

### 1. 安装依赖

在项目根目录执行：

```bash
npm install pg
```

### 2. 运行导入脚本

在 `scripts` 目录下执行：

```bash
node import-nushu-data.js
```

或者在项目根目录执行：

```bash
node scripts/import-nushu-data.js
```

### 3. 验证导入结果

导入完成后，可以通过以下 SQL 查询验证数据：

### 验证字符数据

```sql
-- 查询导入的女书字符数量
SELECT COUNT(*) FROM nushu_characters;

-- 查询导入的女书字符示例
SELECT * FROM nushu_characters LIMIT 10;

-- 查询特定汉字的女书字符
SELECT * FROM nushu_characters WHERE chinese_char = '女';
```

### 验证图片数据

```sql
-- 查询导入的女书图片数量
SELECT COUNT(*) FROM nushu_images;

-- 查询导入的女书图片示例
SELECT * FROM nushu_images LIMIT 10;

-- 查询特定汉字对应的女书图片
SELECT * FROM nushu_images WHERE chinese_char = '女';

-- 查询女书图片和对应的字符信息（联合查询）
SELECT ni.*, nc.nushu_char FROM nushu_images ni
JOIN nushu_characters nc ON ni.chinese_char = nc.chinese_char
LIMIT 10;
```

### API 验证

```bash
# 获取女书图片列表
curl http://localhost:3001/api/nushu/images

# 获取特定汉字的女书图片
curl http://localhost:3001/api/nushu/images?chineseChar=女

# 测试图片识别汉字功能
curl -X POST http://localhost:3001/api/ocr/image-to-chinese -H "Content-Type: application/json" -d '{"imageUrl": "https://example.com/nushu-image.jpg"}'

# 测试图片上传功能
curl -X POST http://localhost:3001/api/ocr/upload -F "image=@path/to/local/image.jpg" -H "Content-Type: multipart/form-data"

## 数据格式支持

### JSON 格式

支持以下 JSON 结构：

1. 直接字符数组：
```json
[
  { "chinese": "女", "nushu": "ꓮ", "pronunciation": "nǚ", "meaning": "女性" },
  { "chinese": "书", "nushu": "ꓲ", "pronunciation": "shū", "meaning": "书籍" }
]
```

2. 包含 characters 字段：
```json
{
  "characters": [
    { "chinese": "女", "nushu": "ꓮ" },
    { "chinese": "书", "nushu": "ꓲ" }
  ]
}
```

### CSV 格式

支持包含表头的 CSV 文件：

```csv
chinese,nushu,pronunciation,meaning
女,ꓮ,nǚ,女性
书,ꓲ,shū,书籍
```

### TXT 格式

支持每行一个字符映射，格式为：
```
女 ꓮ nǚ 女性
书 ꓲ shū 书籍
```

## 仓库结构

脚本会搜索仓库中所有 `.json`、`.csv` 和 `.txt` 文件，并尝试从中提取女书字符数据。

特别关注以下目录：
- `/nsbzz`：《女书标准字字典》转换器
- `/unicode`：《女书规范字书法字帖》转换器

## 数据字段映射

脚本会自动映射以下字段：

| 数据库字段 | 支持的输入字段名 |
|------------|------------------|
| chinese_char | chinese, chinese_char, 汉字 |
| nushu_char | nushu, nushu_char, 女书, char |
| pronunciation | pronunciation, pronounce, 发音 |
| meaning | meaning, 含义 |
| unicode | unicode, Unicode |

## 注意事项

1. 脚本会自动创建 `nushu_characters` 表，如果表已存在则跳过创建
2. 脚本使用 `INSERT ... ON CONFLICT DO NOTHING`，避免重复导入
3. 导入过程中会显示详细日志
4. 导入完成后会清理临时文件

## 排错

### 连接数据库失败

- 检查数据库服务是否运行
- 检查数据库连接参数是否正确
- 检查数据库用户权限

### 克隆仓库失败

- 检查网络连接
- 检查 GitHub 仓库地址是否正确
- 检查 Git 是否安装

### 导入数据为空

- 检查仓库中是否有支持格式的数据文件
- 检查数据文件格式是否符合要求
- 检查数据字段名是否正确

## 后续操作

导入完成后，后端服务会自动使用数据库中的女书字符数据。可以通过以下方式验证：

1. 启动后端服务：`cd backend && npm run dev`
2. 发送测试请求：
   ```bash
   curl -X POST http://localhost:3001/api/ocr/test -H "Content-Type: application/json" -d '{"imageUrl": "test.jpg"}'
   ```
3. 检查响应中的女书字符是否正确

## 定期更新

可以定期运行本脚本，从 GitHub 仓库获取最新的女书数据：

```bash
node scripts/import-nushu-data.js
```
