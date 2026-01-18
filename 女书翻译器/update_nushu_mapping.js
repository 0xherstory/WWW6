// 更新女书字符映射表的脚本
// 用于获取完整的女书Unicode数据集并生成映射表

const fs = require('fs');
const path = require('path');
const https = require('https');

// CSV数据URL
const CSV_URL = 'https://raw.githubusercontent.com/nushu-script/unicode_nushu/master/data.csv';

// 下载CSV数据
const downloadCSV = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
      res.on('error', reject);
    }).on('error', reject);
  });
};

// 解析CSV数据
const parseCSV = (csv) => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      nushuChar: values[0],
      index: parseInt(values[1]),
      chineseChars: values[2],
      pronunciation: values[3]
    };
  }).filter(row => row.nushuChar && row.chineseChars);
};

// 生成汉字到女书字符的映射
const generateMapping = (data) => {
  const mapping = {};
  
  console.log(`开始处理 ${data.length} 行女书数据...`);
  
  data.forEach((row, index) => {
    console.log(`处理行 ${index + 1}/${data.length}: 女书字符=${row.nushuChar}, 对应汉字=${row.chineseChars}`);
    
    // 将每个汉字映射到对应的女书字符
    const chars = row.chineseChars.split('');
    chars.forEach(char => {
      if (char && char !== ' ') {
        // 只在映射不存在时添加，避免后续行覆盖前面的映射
        if (!mapping[char]) {
          mapping[char] = row.nushuChar;
          console.log(`  映射: ${char} -> ${row.nushuChar}`);
        }
      }
    });
  });
  
  return mapping;
};

// 生成JavaScript文件
const generateJSFile = (mapping) => {
  const content = `// 女书字符映射表
// 自动生成自GitHub女书Unicode数据
// 数据来源: https://raw.githubusercontent.com/nushu-script/unicode_nushu/master/data.csv
// 更新时间: ${new Date().toISOString()}

const nushuMapping = ${JSON.stringify(mapping, null, 2)};

export default nushuMapping;`;
  
  const outputPath = path.join(__dirname, 'frontend', 'src', 'utils', 'nushuMapping.js');
  
  // 创建目录（如果不存在）
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  // 写入文件
  fs.writeFileSync(outputPath, content);
  console.log(`\n女书映射表已生成: ${outputPath}`);
};

// 执行更新
const runUpdate = async () => {
  console.log('开始更新女书字符映射表...');
  
  try {
    // 下载CSV数据
    console.log('正在下载女书Unicode数据...');
    const csvData = await downloadCSV(CSV_URL);
    
    // 解析CSV数据
    console.log('正在解析CSV数据...');
    const parsedData = parseCSV(csvData);
    
    console.log(`解析完成，共 ${parsedData.length} 行数据`);
    
    // 生成映射
    const mapping = generateMapping(parsedData);
    
    console.log(`\n映射生成完成，共包含 ${Object.keys(mapping).length} 个汉字映射`);
    
    // 生成JavaScript文件
    generateJSFile(mapping);
    
    console.log('\n女书字符映射表更新完成！');
    
  } catch (error) {
    console.error('更新过程中发生错误:', error.message);
  }
};

runUpdate();
