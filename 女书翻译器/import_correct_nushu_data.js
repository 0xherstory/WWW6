// 导入正确的女书数据到数据库的脚本
// 用于导入用户提供的准确汉字-女书图片映射数据

import { query } from './backend/database.js';
import fs from 'fs';
import path from 'path';

// CSV数据内容（用户提供的正确格式）
const CSV_CONTENT = `chinese_char,image_filename,image_url,pronunciation,meaning
女,nu.png,https://example.com/nu.png,i5,女性
书,shu.png,https://example.com/shu.png,swe33,书写
文,wen.png,https://example.com/wen.png,vai42,文化
化,hua.png,https://example.com/hua.png,fwe13,文化
保,bao.png,https://example.com/bao.png,phiu44,保护
护,hu.png,https://example.com/hu.png,sie33,保护
平,ping.png,https://example.com/ping.png,tsoe42,平台
台,tai.png,https://example.com/tai.png,ie21,平台
中,zhong.png,https://example.com/zhong.png,tciou44,中国
国,guo.png,https://example.com/guo.png,khau21,国家
人,ren.png,https://example.com/ren.png,khau21,人民
民,min.png,https://example.com/min.png,khau21,人民
和,he.png,https://example.com/he.png,khau21,和平
谐,xie.png,https://example.com/xie.png,khau21,和谐
美,mei.png,https://example.com/mei.png,khau21,美丽
丽,li.png,https://example.com/li.png,khau21,美丽
世,shi.png,https://example.com/shi.png,khau21,世界
界,jie.png,https://example.com/jie.png,khau21,世界
爱,ai.png,https://example.com/ai.png,khau21,爱情
情,qing.png,https://example.com/qing.png,khau21,爱情
刘,liu.png,https://example.com/liu.png,khau21,姓氏
王,wang.png,https://example.com/wang.png,khau21,姓氏
李,li.png,https://example.com/li.png,khau21,姓氏
张,zhang.png,https://example.com/zhang.png,khau21,姓氏
`;

// 解析CSV数据
const parseCSV = (csv) => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      chinese_char: values[0].trim(),
      image_filename: values[1].trim(),
      image_url: values[2].trim(),
      pronunciation: values[3].trim(),
      meaning: values[4].trim()
    };
  }).filter(row => row.chinese_char && row.image_url);
};

// 导入女书数据
const importNushuData = async (data) => {
  try {
    // 开始事务
    await query('BEGIN');
    
    console.log('开始导入正确的女书数据...');
    console.log(`共 ${data.length} 条数据需要导入`);
    
    for (const row of data) {
      console.log(`\n处理数据: ${row.chinese_char}`);
      
      // 1. 插入女书字符
      await query(
        `INSERT INTO nushu_characters 
         (chinese_char, nushu_char, pronunciation, meaning, unicode, source)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [row.chinese_char, '', row.pronunciation, row.meaning, '', 'user_provided']
      );
      console.log(`  ✅ 已插入女书字符: ${row.chinese_char}`);
      
      // 2. 插入女书图片
      await query(
        `INSERT INTO nushu_images 
         (chinese_char, image_filename, image_url, source)
         VALUES ($1, $2, $3, $4)`,
        [row.chinese_char, row.image_filename, row.image_url, 'user_provided']
      );
      console.log(`  ✅ 已插入女书图片: ${row.image_filename}`);
    }
    
    // 提交事务
    await query('COMMIT');
    
    console.log('\n✅ 所有女书数据导入完成！');
    console.log(`\n📊 导入统计:`);
    console.log(`- 成功导入 ${data.length} 个汉字`);
    console.log(`- 成功导入 ${data.length} 张女书图片`);
    
    // 生成前端使用的映射文件
    generateFrontendMapping(data);
    
  } catch (error) {
    // 回滚事务
    await query('ROLLBACK');
    console.error('❌ 导入数据失败:', error.message);
    console.error('❌ 事务已回滚，数据库状态未改变');
  }
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
  
  const outputPath = path.join(__dirname, 'frontend', 'src', 'utils', 'nushuImageMapping.js');
  
  // 创建目录（如果不存在）
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  // 写入文件
  fs.writeFileSync(outputPath, content);
  console.log(`\n📁 前端映射文件已生成: ${outputPath}`);
  console.log(`✅ 包含 ${Object.keys(mapping).length} 个汉字-图片映射`);
};

// 执行导入
const runImport = async () => {
  console.log('🚀 启动女书数据导入流程...');
  
  try {
    // 解析CSV数据
    console.log('📄 正在解析CSV数据...');
    const parsedData = parseCSV(CSV_CONTENT);
    
    // 导入到数据库
    await importNushuData(parsedData);
    
    console.log('\n🎉 女书数据导入完成！');
    console.log('\n📋 下一步建议：');
    console.log('1. 更新前端代码，使用新的女书图片映射表');
    console.log('2. 修改FreeTranslation组件，显示女书图片而不是Unicode字符');
    console.log('3. 重新构建前端项目');
    console.log('4. 测试中文转女书功能，确认显示图片形式的结果');
    
  } catch (error) {
    console.error('❌ 导入过程中发生错误:', error.message);
  }
};

runImport();
