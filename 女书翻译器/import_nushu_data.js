// 导入女书数据到数据库的脚本
// 用于将GitHub女书Unicode数据导入到PostgreSQL数据库

import { query } from './backend/database.js';
import fs from 'fs';
import https from 'https';

// CSV数据URL
const CSV_URL = 'https://raw.githubusercontent.com/nushu-script/unicode_nushu/master/data.csv';

// 下载CSV数据
const downloadCSV = async (url) => {
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

// 导入女书字符数据
const importNushuCharacters = async (data) => {
  try {
    // 开始事务
    await query('BEGIN');
    
    // 清空现有数据
    await query('DELETE FROM nushu_images');
    await query('DELETE FROM nushu_characters');
    
    console.log('开始导入女书字符数据...');
    
    let importedCount = 0;
    for (const row of data) {
      // 插入女书字符
      await query(
        `INSERT INTO nushu_characters 
         (chinese_char, nushu_char, pronunciation, meaning, unicode, source)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['', row.nushuChar, row.pronunciation, '', row.nushuChar.codePointAt(0).toString(16), 'unicode_nushu']
      );
      
      // 解析汉字，为每个汉字创建映射
      const chars = row.chineseChars.split('');
      for (const char of chars) {
        if (char && char !== ' ') {
          await query(
            `INSERT INTO nushu_images 
             (chinese_char, image_filename, image_url, source)
             VALUES ($1, $2, $3, $4)`,
            [char, `${char}_${row.nushuChar}.png`, `https://nushu-unicode.org/images/${row.nushuChar}.png`, 'unicode_nushu']
          );
        }
      }
      
      importedCount++;
      if (importedCount % 10 === 0) {
        console.log(`已导入 ${importedCount} 条女书数据...`);
      }
    }
    
    // 提交事务
    await query('COMMIT');
    
    console.log(`女书数据导入完成！共导入 ${importedCount} 条记录，覆盖 ${data.length} 个女书字符`);
    
  } catch (error) {
    // 回滚事务
    await query('ROLLBACK');
    console.error('导入女书数据失败:', error.message);
    console.error('事务已回滚，数据库状态未改变');
  }
};

// 执行导入
const runImport = async () => {
  console.log('开始导入女书数据到数据库...');
  
  try {
    // 下载CSV数据
    console.log('正在下载女书Unicode数据...');
    const csvData = await downloadCSV(CSV_URL);
    
    // 解析CSV数据
    console.log('正在解析CSV数据...');
    const parsedData = parseCSV(csvData);
    
    // 导入到数据库
    await importNushuCharacters(parsedData);
    
    console.log('\n导入完成！');
    console.log('数据已成功导入到以下表中：');
    console.log('1. nushu_characters - 女书字符基本信息');
    console.log('2. nushu_images - 汉字与女书图片的映射关系');
    
  } catch (error) {
    console.error('导入过程中发生错误:', error.message);
  }
};

runImport();
