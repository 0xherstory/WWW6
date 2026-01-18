// 清理数据库中所有女书内容的脚本
// 用于重置女书数据库，准备重新导入图片形式的女书数据

import { query } from './backend/database.js';

// 清理翻译请求表
const cleanTranslationRequests = async () => {
  try {
    await query('DELETE FROM translation_requests');
    console.log('翻译请求表已清空');
  } catch (error) {
    console.error('清空翻译请求表失败:', error.message);
  }
};

// 清理女书图片表
const cleanNushuImages = async () => {
  try {
    await query('DELETE FROM nushu_images');
    console.log('女书图片表已清空');
  } catch (error) {
    console.error('清空女书图片表失败:', error.message);
  }
};

// 清理女书字符表
const cleanNushuCharacters = async () => {
  try {
    await query('DELETE FROM nushu_characters');
    console.log('女书字符表已清空');
  } catch (error) {
    console.error('清空女书字符表失败:', error.message);
  }
};

// 执行清理
const runCleanup = async () => {
  console.log('开始清理数据库中的女书内容...');
  
  // 按照依赖顺序清理（先清理子表，再清理父表）
  await cleanTranslationRequests();
  await cleanNushuImages();
  await cleanNushuCharacters();
  
  console.log('数据库清理完成！');
  console.log('\n需要您提供的资源：');
  console.log('1. 汉字与女书图片的对应关系表（CSV格式）');
  console.log('   - 格式示例：chinese_char,image_filename,image_url,pronunciation,meaning');
  console.log('   - 例如：女,nu.png,https://example.com/nu.png,i5,女性');
  console.log('   - 每一行代表一个汉字对应的女书图片信息');
  console.log('\n2. 女书图片资源');
  console.log('   - 每个汉字对应一张女书图片');
  console.log('   - 建议使用PNG或JPG格式，分辨率适中（如100x100像素）');
  console.log('   - 图片应清晰展示女书字符');
  console.log('\n3. 女书字符的发音和含义信息（可选）');
  console.log('   - 江永方言发音');
  console.log('   - 字符含义说明');
  console.log('\n4. 女书图片的存储方式选择');
  console.log('   - 本地存储：需要提供图片文件，我会帮您设置本地存储服务');
  console.log('   - 云存储：需要提供图片URL，我会直接使用这些URL');
};

runCleanup();
