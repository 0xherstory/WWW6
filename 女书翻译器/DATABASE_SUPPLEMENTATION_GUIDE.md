# 女书数据库完善指南

## 一、项目概述

当前女书项目采用**链上结算 + 链下存储**的混合架构，前端使用预生成的映射表进行汉字到女书的翻译，后端使用 PostgreSQL 数据库存储女书字符和图片数据。

## 二、当前数据库结构

### 1. 主要数据表

#### `nushu_characters` 表
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | SERIAL | 主键ID |
| chinese_char | VARCHAR(10) | 对应的汉字 |
| nushu_char | VARCHAR(20) | 女书字符（Unicode或自定义编码） |
| pronunciation | VARCHAR(50) | 发音 |
| meaning | TEXT | 含义 |
| unicode | VARCHAR(20) | Unicode编码（如果有） |
| source | VARCHAR(100) | 数据源 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

#### `nushu_images` 表
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | SERIAL | 主键ID |
| chinese_char | VARCHAR(10) | 对应的汉字 |
| image_filename | VARCHAR(255) | 图片文件名 |
| image_url | TEXT | 图片URL |
| source | VARCHAR(100) | 图片来源 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

#### `translation_requests` 表
| 字段名 | 类型 | 描述 |
|--------|------|------|
| request_id | SERIAL | 主键ID |
| user_wallet | VARCHAR(255) | 用户钱包地址 |
| tx_hash | VARCHAR(255) | 交易哈希 |
| image_url | TEXT | 图片URL |
| status | VARCHAR(50) | 状态 |
| result_text | TEXT | 翻译结果 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 三、当前前端实现

当前前端使用 `/frontend/src/utils/nushuMapping.js` 文件，包含从GitHub获取的1760个汉字到女书Unicode字符的映射。

## 四、数据库完善方案

### 1. 数据收集

#### 1.1 字符数据收集

**收集内容**：
- 汉字：如 "女"、"书"、"文" 等
- 女书字符：对应的女书符号（Unicode或自定义编码）
- 发音：女书的发音
- 含义：字符的含义
- Unicode编码：如果女书字符已被收录到Unicode中
- 数据源：数据来源说明

**数据格式**：
```json
{
  "chinese_char": "女",
  "nushu_char": "ꓮ",
  "pronunciation": "nyu",
  "meaning": "女性",
  "unicode": "U+A4EE",
  "source": "《女书字典》"
}
```

#### 1.2 图片数据收集

**收集内容**：
- 汉字：对应的汉字
- 女书图片：清晰的女书字符图片
- 图片来源：说明图片的出处

**数据格式**：
```json
{
  "chinese_char": "女",
  "image_filename": "nushu_nyu.png",
  "image_url": "https://example.com/nushu_nyu.png",
  "source": "女书文化博物馆"
}
```

### 2. 数据验证

#### 2.1 验证方法

1. **参考权威资料**：确保女书字符的正确性，建议参考权威的女书研究资料
2. **专家验证**：如有可能，请女书研究专家验证数据
3. **交叉验证**：使用多个来源的数据进行交叉验证
4. **测试常见短语**：使用常见的汉语短语进行测试，检查翻译结果是否合理

#### 2.2 验证标准

- 每个汉字至少对应一个女书字符
- 每个女书字符应有明确的发音和含义
- 图片应清晰可辨，与对应的女书字符一致
- 所有数据应有明确的来源

### 3. 数据导入

#### 3.1 使用现有脚本导入

项目已提供 `/scripts/import-nushu-data.js` 脚本，可以从GitHub仓库导入女书数据。

**使用方法**：
```bash
cd /Users/maixiaonuo/Documents/NuShu
node scripts/import-nushu-data.js
```

该脚本会：
1. 克隆GitHub女书字符仓库
2. 导入字符数据到 `nushu_characters` 表
3. 克隆GitHub女书图片仓库
4. 导入图片数据到 `nushu_images` 表

#### 3.2 手动导入数据

**插入字符数据**：
```sql
INSERT INTO nushu_characters (chinese_char, nushu_char, pronunciation, meaning, unicode, source)
VALUES ('女', 'ꓮ', 'nyu', '女性', 'U+A4EE', '《女书字典》');
```

**插入图片数据**：
```sql
INSERT INTO nushu_images (chinese_char, image_filename, image_url, source)
VALUES ('女', 'nushu_nyu.png', 'https://example.com/nushu_nyu.png', '女书文化博物馆');
```

#### 3.3 从CSV文件导入

**创建CSV文件**（characters.csv）：
```csv
chinese_char,nushu_char,pronunciation,meaning,unicode,source
女,ꓮ,nyu,女性,U+A4EE,《女书字典》
书,ꓲ,shu,书籍,U+A4F2,《女书字典》
文,ꓶ,wen,文字,U+A4F6,《女书字典》
```

**导入CSV文件**：
```bash
# 使用psql命令导入
psql -h localhost -U postgres -d nushu_protocol -c "\copy nushu_characters(chinese_char,nushu_char,pronunciation,meaning,unicode,source) FROM 'characters.csv' DELIMITER ',' CSV HEADER;"
```

### 4. 更新前端映射

#### 4.1 更新字符映射

当前前端使用 `/frontend/src/utils/nushuMapping.js` 文件，该文件是从GitHub数据自动生成的。

**更新方法**：
```bash
cd /Users/maixiaonuo/Documents/NuShu
node update_nushu_mapping.js
```

#### 4.2 生成图片映射

**步骤1**：准备包含汉字和图片URL的CSV文件（nushu_images.csv）：
```csv
chinese_char,image_url
女,https://example.com/nushu_nyu.png
书,https://example.com/nushu_shu.png
文,https://example.com/nushu_wen.png
```

**步骤2**：运行生成脚本：
```bash
cd /Users/maixiaonuo/Documents/NuShu
node generate_nushu_image_mapping.js
```

**步骤3**：在前端组件中使用图片映射：

```javascript
// 在FreeTranslation.jsx中导入图片映射
import nushuImageMapping from '../utils/nushuImageMapping.js';

// 使用图片映射代替Unicode字符
const handleTranslate = () => {
  if (!chineseText.trim()) {
    setTranslationResult([]);
    return;
  }

  const result = [];
  for (let char of chineseText) {
    if (nushuImageMapping[char]) {
      result.push({
        char,
        image: nushuImageMapping[char].image_url,
        pronunciation: nushuImageMapping[char].pronunciation,
        meaning: nushuImageMapping[char].meaning
      });
    } else {
      // 处理未找到映射的字符
      result.push({ char, image: null });
    }
  }
  
  setTranslationResult(result);
};
```

#### 4.3 更新前端组件

**修改 `/frontend/src/components/FreeTranslation.jsx`**：

```javascript
// 渲染翻译结果时使用图片
{translationResult.map((item, index) => (
  <div key={index} className="translation-item">
    <div className="chinese-char">{item.char}</div>
    {item.image ? (
      <img 
        src={item.image} 
        alt={`女书字符 ${item.char}`} 
        className="nushu-image" 
        style={{ width: '50px', height: '50px' }}
      />
    ) : (
      <div className="nushu-char">{item.nushu || '?'}</div>
    )}
    {item.pronunciation && <div className="pronunciation">{item.pronunciation}</div>}
    {item.meaning && <div className="meaning">{item.meaning}</div>}
  </div>
))}
```

### 5. 本地测试

#### 5.1 启动所有服务

```bash
# 启动Hardhat本地节点
cd /Users/maixiaonuo/Documents/NuShu
echo "y" | npx hardhat node --port 9545

# 启动后端服务
cd /Users/maixiaonuo/Documents/NuShu/backend
npm run dev

# 启动前端开发服务器
cd /Users/maixiaonuo/Documents/NuShu/frontend
npm run dev
```

#### 5.2 测试翻译功能

1. 打开浏览器访问 `http://localhost:5173/`
2. 连接MetaMask钱包
3. 输入汉字进行翻译测试
4. 检查翻译结果是否正确显示图片

### 6. 部署到生产环境

#### 6.1 编译智能合约

```bash
cd /Users/maixiaonuo/Documents/NuShu
npx hardhat compile
```

#### 6.2 部署智能合约到Sepolia测试网

```bash
cd /Users/maixiaonuo/Documents/NuShu
npx hardhat run scripts/deploy.js --network sepolia
```

#### 6.3 构建前端

```bash
cd /Users/maixiaonuo/Documents/NuShu/frontend
npm run build
```

## 五、数据来源建议

1. **女书研究书籍和字典**：《女书字典》、《女书通》等
2. **女书文化博物馆资料**：湖南江永女书生态博物馆
3. **学术论文和研究报告**：相关大学和研究机构的女书研究成果
4. **女书传承人提供的资料**：直接从女书传承人处获取的一手资料
5. **GitHub开源仓库**：
   - https://github.com/nushu-script/unicode_nushu
   - https://github.com/nushu-script/nushu-script.github.io
6. **Unicode女书字符集**：Unicode 13.0及以上版本包含的女书字符

## 六、常见问题及解决方案

### 1. 数据库连接失败

**问题**：后端无法连接到数据库

**解决方案**：
- 检查PostgreSQL服务是否正常运行
- 检查数据库配置（用户名、密码、数据库名）是否正确
- 检查防火墙设置，确保PostgreSQL端口（默认5432）允许访问

### 2. 翻译结果显示错误

**问题**：汉字翻译为女书后显示错误或为问号

**解决方案**：
- 检查 `nushuMapping.js` 文件是否包含该汉字的映射
- 检查数据库中是否存在该汉字的记录
- 检查图片映射 `nushuImageMapping.js` 是否包含该汉字的图片URL

### 3. 前端无法加载图片

**问题**：女书图片无法正常显示

**解决方案**：
- 检查图片URL是否正确
- 检查图片服务器是否正常运行
- 检查CORS设置，确保前端可以访问图片资源

## 七、后续维护

### 1. 定期更新数据

建议每季度更新一次女书数据，确保数据的准确性和完整性。

### 2. 监控翻译质量

建立反馈机制，允许用户报告翻译错误，及时修正数据库中的错误数据。

### 3. 扩展字符集

逐步扩展女书字符集，覆盖更多的汉字和词语。

## 八、结论

通过以上步骤，可以逐步完善女书数据库，提高汉字转女书的准确性，为用户提供更好的翻译服务。建议按照"数据收集→数据验证→数据导入→前端更新→测试部署"的流程进行，确保每一步都经过严格的验证和测试。