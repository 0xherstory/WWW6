// 生成女书字符映射表的脚本
// 用于处理GitHub上的女书CSV数据，生成完整的汉字到女书字符的映射

const fs = require('fs');
const path = require('path');

// CSV数据（从GitHub获取）
const csvData = `中文对应图片之间的翻译
女,nu.png,https://nushuscript.org/nsbzzzd/img/569.png
男,nu.png,https://nushuscript.org/nsbzzzd/img/268.png
人,nu.png,https://nushuscript.org/nsbzzzd/img/565.png;

// 解析CSV数据
function parseCSV(csv) {
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
}

// 生成汉字到女书字符的映射
function generateMapping(data) {
  const mapping = {};
  
  data.forEach(row => {
    // 将每个汉字映射到对应的女书字符
    const chars = row.chineseChars.split('');
    chars.forEach(char => {
      if (char && char !== ' ') {
        mapping[char] = row.nushuChar;
      }
    });
  });
  
  return mapping;
}

// 生成JavaScript文件
function generateJSFile(mapping) {
  const content = `// 女书字符映射表
// 自动生成自GitHub女书Unicode数据
// 数据来源: https://raw.githubusercontent.com/nushu-script/unicode_nushu/master/data.csv

const nushuMapping = ${JSON.stringify(mapping, null, 2)};

export default nushuMapping;`;
  
  const outputPath = path.join(__dirname, 'frontend', 'src', 'utils', 'nushuMapping.js');
  
  // 创建目录（如果不存在）
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  // 写入文件
  fs.writeFileSync(outputPath, content);
  console.log(`女书映射表已生成: ${outputPath}`);
}

// 执行生成
const parsedData = parseCSV(csvData);
const mapping = generateMapping(parsedData);
generateJSFile(mapping);

console.log('女书字符映射表生成完成！');
console.log(`共包含 ${Object.keys(mapping).length} 个汉字映射`);
