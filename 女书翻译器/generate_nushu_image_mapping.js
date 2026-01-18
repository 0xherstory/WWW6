// 生成女书图片映射文件的脚本
// 用于从用户提供的CSV数据生成前端使用的女书图片映射

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// CSV数据内容（用户提供的正确格式）
const CSV_CONTENT = `chinese_char,image_filename,image_url,pronunciation,meaning
女,nu.png,https://nushuscript.org/nsbzzzd/img/569.png,i5,女性
男,nan.png,https://nushuscript.org/nsbzzzd/img/268.png,nan,男性
人,ren.png,https://nushuscript.org/nsbzzzd/img/565.png,ren,人类

`;

// 解析CSV数据（带错误处理）
const parseCSV = (csv) => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // 跳过空行
    
    const values = line.split(',');
    if (values.length >= 3) { // 至少需要chinese_char、image_filename、image_url
      result.push({
        chinese_char: (values[0] || '').trim(),
        image_filename: (values[1] || '').trim(),
        image_url: (values[2] || '').trim(),
        pronunciation: (values[3] || '').trim(),
        meaning: (values[4] || '').trim()
      });
    }
  }
  
  return result.filter(row => row.chinese_char && row.image_url);
};

// 生成前端使用的女书图片映射文件
const generateFrontendMapping = (data) => {
  const mapping = {};
  
  data.forEach(row => {
    mapping[row.chinese_char] = {
      image_url: row.image_url,
      pronunciation: row.pronunciation,
      meaning: row.meaning
    };
  });
  
  const content = `// 女书图片映射表
// 自动生成自用户提供的CSV数据
// 更新时间: ${new Date().toISOString()}

const nushuImageMapping = ${JSON.stringify(mapping, null, 2)};

export default nushuImageMapping;`;
  
  // 使用ES模块兼容的方式获取当前目录
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const outputPath = path.join(__dirname, 'frontend', 'src', 'utils', 'nushuImageMapping.js');
  
  // 创建目录（如果不存在）
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  // 写入文件
  fs.writeFileSync(outputPath, content);
  
  console.log('\n\n✅ 前端映射文件已生成:', outputPath);
  console.log(`✅ 包含 ${Object.keys(mapping).length} 个汉字-图片映射`);
  
  return mapping;
};

// 更新前端翻译组件，显示图片形式的女书结果
const updateFrontendComponent = () => {
  // 使用ES模块兼容的方式获取当前目录
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const componentPath = path.join(__dirname, 'frontend', 'src', 'components', 'FreeTranslation.jsx');
  
  // 更新组件内容，使用图片映射
  const updatedContent = `import React, { useState } from 'react';
// 导入女书图片映射表
import nushuImageMapping from '../utils/nushuImageMapping';

const FreeTranslation = () => {
  const [chineseText, setChineseText] = useState('');
  const [translationResult, setTranslationResult] = useState([]);

  // 转换汉字为女书图片
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
        result.push({
          char,
          image: null,
          pronunciation: '',
          meaning: ''
        });
      }
    }
    
    setTranslationResult(result);
  };

  // 复制结果
  const handleCopy = () => {
    if (translationResult.length === 0) return;
    
    // 复制原文字
    navigator.clipboard.writeText(chineseText)
      .then(() => {
        alert('已复制原文字到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>免费汉字转女书</h2>
      
      <div style={styles.inputSection}>
        <label htmlFor="chineseText" style={styles.label}>
          输入汉字：
        </label>
        <textarea
          id="chineseText"
          value={chineseText}
          onChange={(e) => setChineseText(e.target.value)}
          placeholder="请输入要转换的汉字..."
          style={styles.textarea}
          rows={4}
        />
      </div>
      
      <div style={styles.buttonSection}>
        <button
          onClick={handleTranslate}
          style={styles.translateButton}
        >
          转换为女书
        </button>
      </div>
      
      {translationResult.length > 0 && (
        <div style={styles.resultSection}>
          <label style={styles.label}>转换结果：</label>
          <div style={styles.resultText}>
            {translationResult.map((item, index) => (
              <div key={index} style={styles.nushuCharacter}>
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.char} 
                    style={styles.nushuImage} 
                    title={item.char + ' - ' + (item.meaning || '无含义')}
                  />
                ) : (
                  <span style={styles.unknownChar}>
                    {item.char}
                  </span>
                )}
                <div style={styles.charInfo}>
                  <span style={styles.originalChar}>{item.char}</span>
                  {item.pronunciation && (
                    <span style={styles.pronunciation}>{item.pronunciation}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleCopy}
            style={styles.copyButton}
          >
            复制结果
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem'
  },
  title: {
    marginTop: 0,
    marginBottom: '1.5rem',
    color: '#333',
    fontSize: '1.5rem'
  },
  inputSection: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#555'
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  buttonSection: {
    marginBottom: '1.5rem'
  },
  translateButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s'
  },
  resultSection: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #e9ecef'
  },
  resultText: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '1rem',
    minHeight: '60px',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #dee2e6'
  },
  nushuCharacter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease'
  },
  nushuImage: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    borderRadius: '4px',
    border: '1px solid #dee2e6'
  },
  unknownChar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80px',
    height: '80px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    fontSize: '2rem',
    color: '#6c757d'
  },
  charInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  originalChar: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#333'
  },
  pronunciation: {
    fontSize: '0.8rem',
    color: '#6c757d'
  },
  copyButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s'
  }
};

export default FreeTranslation;
`;
  
  // 写入更新后的组件内容
  fs.writeFileSync(componentPath, updatedContent);
  
  console.log('✅ 前端翻译组件已更新:', componentPath);
  console.log('✅ 现在显示女书图片而不是Unicode字符');
};

// 执行生成
const run = () => {
  console.log('🚀 启动女书图片映射生成流程...');
  
  // 解析CSV数据
  console.log('📄 正在解析CSV数据...');
  const parsedData = parseCSV(CSV_CONTENT);
  console.log(`✅ 解析完成，共 ${parsedData.length} 条数据`);
  
  // 生成前端映射文件
  console.log('📁 正在生成前端映射文件...');
  const mapping = generateFrontendMapping(parsedData);
  
  // 更新前端组件
  console.log('🔧 正在更新前端组件...');
  updateFrontendComponent();
  
  console.log('\n🎉 女书图片映射生成完成！');
  console.log('\n📋 后续建议：');
  console.log('1. 重新构建前端项目');
  console.log('2. 测试中文转女书功能，确认显示图片形式的结果');
  console.log('3. 根据需要扩展CSV文件，添加更多汉字映射');
  console.log('4. 替换示例图片URL为真实的女书图片URL');
  
  return mapping;
};

run();
