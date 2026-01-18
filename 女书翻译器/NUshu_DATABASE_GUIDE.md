# 女书数据库完善指南

## 一、当前女书数据库结构

### 1. 女书字符表 (nushu_characters)
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

### 2. 女书图片表 (nushu_images)
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | SERIAL | 主键ID |
| chinese_char | VARCHAR(10) | 对应的汉字 |
| image_filename | VARCHAR(255) | 图片文件名 |
| image_url | TEXT | 图片URL |
| source | VARCHAR(100) | 图片来源 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 二、当前汉字转女书的实现

当前前端使用简化的映射表进行汉字转女书，位于 `/frontend/src/components/FreeTranslation.jsx` 中的 `nushuMapping` 对象。这个映射表只包含了25个常用汉字的女书对应关系，因此会出现翻译错误。

## 三、如何完善女书数据库

### 1. 收集女书字符数据

需要收集以下类型的数据：

#### 基本字符映射数据
- 汉字：如 "女"、"书"、"文" 等
- 女书字符：对应的女书符号（可以是Unicode或自定义编码）
- 发音：女书的发音
- 含义：字符的含义
-  Unicode编码：如果女书字符已被收录到Unicode中

#### 图片数据
- 汉字：对应的汉字
- 女书图片：清晰的女书字符图片
- 图片来源：说明图片的出处

### 2. 验证数据正确性

- **参考权威资料**：确保女书字符的正确性，建议参考权威的女书研究资料
- **专家验证**：如有可能，请女书研究专家验证数据
- **交叉验证**：使用多个来源的数据进行交叉验证

### 3. 数据格式

#### 字符映射数据格式
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

#### 图片数据格式
```json
{
  "chinese_char": "女",
  "image_filename": "nushu_nyu.png",
  "image_url": "https://example.com/nushu_nyu.png",
  "source": "女书文化博物馆"
}
```

### 4. 导入数据到数据库

#### 方式一：直接使用SQL插入
```sql
-- 插入女书字符
INSERT INTO nushu_characters (chinese_char, nushu_char, pronunciation, meaning, unicode, source) 
VALUES ('女', 'ꓮ', 'nyu', '女性', 'U+A4EE', '《女书字典》');

-- 插入女书图片
INSERT INTO nushu_images (chinese_char, image_filename, image_url, source) 
VALUES ('女', 'nushu_nyu.png', 'https://example.com/nushu_nyu.png', '女书文化博物馆');
```

#### 方式二：使用导入脚本
可以扩展现有的 `scripts/import-nushu-data.js` 脚本，支持从CSV或JSON文件导入数据。

### 5. 更新前端映射表

当数据库中的女书字符数据足够完善后，可以修改前端代码，从后端API获取女书字符映射，而不是使用硬编码的简化映射表。

## 四、提高汉字转女书准确性的建议

1. **建立完整的字符映射库**：至少包含常用的3000个汉字对应的女书字符
2. **支持多音字**：为同一个汉字的不同发音提供不同的女书字符
3. **添加上下文支持**：考虑汉字在不同语境下的不同含义，提供更准确的女书对应
4. **定期更新数据**：随着女书研究的深入，不断更新和完善数据库
5. **提供反馈机制**：允许用户报告翻译错误，以便持续改进

## 五、当前简化映射表的位置

当前前端使用的简化映射表位于 `/frontend/src/components/FreeTranslation.jsx` 中的 `nushuMapping` 对象。如果需要临时添加新的字符映射，可以直接修改这个对象。

## 六、示例：添加新的女书字符映射

1. **在数据库中添加记录**：
   ```sql
   INSERT INTO nushu_characters (chinese_char, nushu_char, pronunciation, meaning, unicode, source) 
   VALUES ('爱', 'ꔃ', 'ai', '爱情', 'U+A503', '《女书字典》');
   ```

2. **更新前端映射表**：
   ```javascript
   const nushuMapping = {
     // 现有映射
     '女': 'ꓮ',
     '书': 'ꓲ',
     // 添加新映射
     '爱': 'ꔃ'
   };
   ```

## 七、数据来源建议

1. 女书研究书籍和字典
2. 女书文化博物馆资料
3. 学术论文和研究报告
4. 女书传承人提供的资料
5. 经过验证的女书数据库（如Unicode女书字符集）

## 八、验证数据准确性的方法

1. **与权威字典对比**：将映射结果与权威女书字典进行对比
2. **请女书专家验证**：邀请女书研究专家或传承人验证数据
3. **交叉验证**：使用多个来源的数据进行交叉验证
4. **测试常见短语**：使用常见的汉语短语进行测试，检查翻译结果是否合理

通过以上方法，可以逐步完善女书数据库，提高汉字转女书的准确性。