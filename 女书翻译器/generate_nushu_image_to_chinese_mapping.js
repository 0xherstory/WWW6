// 生成女书图片到汉字映射表的脚本
// 用于处理用户提供的女书图片数据，生成女书图片到汉字的映射

const fs = require('fs');
const path = require('path');

// CSV数据（用户提供）
const csvData = `nushu_char,image_filename,image_url,chinese_char
ꓮ,nu.png,https://nushuscript.org/nsbzzzd/img/569.png,女
ꓲ,nan.png,https://nushuscript.org/nsbzzzd/img/268.png,男
ꓶ,ren.png,https://nushuscript.org/nsbzzzd/img/565.png,人
ꓵ,shu.png,https://nushuscript.org/nsbzzzd/img/123.png,书
ꓷ,wen.png,https://nushuscript.org/nsbzzzd/img/456.png,文
ꓺ,hua.png,https://nushuscript.org/nsbzzzd/img/789.png,化
ꓸ,bao.png,https://nushuscript.org/nsbzzzd/img/321.png,保
ꓹ,hu.png,https://nushuscript.org/nsbzzzd/img/654.png,护
ꓼ,ping.png,https://nushuscript.org/nsbzzzd/img/987.png,平
ꓽ,tai.png,https://nushuscript.org/nsbzzzd/img/147.png,台
꓾,zhong.png,https://nushuscript.org/nsbzzzd/img/258.png,中
꓿,guo.png,https://nushuscript.org/nsbzzzd/img/369.png,国
꓀,ai.png,https://nushuscript.org/nsbzzzd/img/159.png,爱
꓁,qing.png,https://nushuscript.org/nsbzzzd/img/357.png,情
꓂,mei.png,https://nushuscript.org/nsbzzzd/img/258.png,美
꓃,li.png,https://nushuscript.org/nsbzzzd/img/147.png,丽
꓄,shi.png,https://nushuscript.org/nsbzzzd/img/369.png,世
꓅,jie.png,https://nushuscript.org/nsbzzzd/img/741.png,界
꓆,he.png,https://nushuscript.org/nsbzzzd/img/852.png,和
꓇,xie.png,https://nushuscript.org/nsbzzzd/img/963.png,谐
꓈,liu.png,https://nushuscript.org/nsbzzzd/img/123.png,刘
꓉,wang.png,https://nushuscript.org/nsbzzzd/img/456.png,王
꓊,li.png,https://nushuscript.org/nsbzzzd/img/789.png,李
꓋,zhang.png,https://nushuscript.org/nsbzzzd/img/321.png,张`;

// 解析CSV数据
function parseCSV(csv) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      nushu_char: values[0],
      image_filename: values[1],
      image_url: values[2],
      chinese_char: values[3]
    };
  }).filter(row => row.nushu_char && row.chinese_char);
}

// 生成女书图片到汉字的映射
function generateMapping(data) {
  const mapping = {};
  
  data.forEach(row => {
    // 将每个女书字符映射到对应的汉字
    mapping[row.nushu_char] = row.chinese_char;
  });
  
  return mapping;
}

// 生成后端使用的JavaScript文件
function generateBackendMapping(mapping) {
  const content = `// 女书图片到汉字的映射表
// 用于将女书图片识别结果映射到对应的汉字

// 映射格式：女书字符图片 -> 汉字
const nushuImageToChineseMapping = ${JSON.stringify(mapping, null, 2)};

export default nushuImageToChineseMapping;`;
  
  const outputPath = path.join(__dirname, 'backend', 'nushuImageToChineseMapping.js');
  
  // 写入文件
  fs.writeFileSync(outputPath, content);
  console.log(`女书图片到汉字映射表已生成（后端）: ${outputPath}`);
}

// 生成前端使用的JavaScript文件
function generateFrontendMapping(mapping) {
  const content = `// 女书图片到汉字的映射表
// 自动生成自用户提供的CSV数据
// 更新时间: ${new Date().toISOString()}

const nushuImageToChineseMapping = ${JSON.stringify(mapping, null, 2)};

export default nushuImageToChineseMapping;`;
  
  const outputPath = path.join(__dirname, 'frontend', 'src', 'utils', 'nushuImageToChineseMapping.js');
  
  // 创建目录（如果不存在）
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  // 写入文件
  fs.writeFileSync(outputPath, content);
  console.log(`女书图片到汉字映射表已生成（前端）: ${outputPath}`);
}

// 执行生成
const parsedData = parseCSV(csvData);
const mapping = generateMapping(parsedData);
generateBackendMapping(mapping);
generateFrontendMapping(mapping);

console.log('女书图片到汉字映射表生成完成！');
console.log(`共包含 ${Object.keys(mapping).length} 个女书字符映射`);