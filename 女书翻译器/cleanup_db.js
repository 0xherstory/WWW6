// 清理数据库中所有女书相关数据的脚本
// 用于重置数据库，准备重新导入正确的女书数据

import { query } from './backend/database.js';

// 清理所有女书相关数据
const cleanupDatabase = async () => {
  try {
    // 开始事务
    await query('BEGIN');
    
    console.log('开始清理数据库中的女书相关数据...');
    
    // 1. 清理翻译请求表
    await query('DELETE FROM translation_requests');
    console.log('✅ 翻译请求表已清空');
    
    // 2. 清理女书图片表
    await query('DELETE FROM nushu_images');
    console.log('✅ 女书图片表已清空');
    
    // 3. 清理女书字符表
    await query('DELETE FROM nushu_characters');
    console.log('✅ 女书字符表已清空');
    
    // 提交事务
    await query('COMMIT');
    
    console.log('\n✅ 数据库清理完成！所有女书相关数据已被删除');
    console.log('\n📋 后续改进建议：');
    console.log('1. 提供更准确的汉字-女书字符映射表');
    console.log('2. 确保每个汉字对应正确的女书字符');
    console.log('3. 考虑使用更权威的女书数据源');
    console.log('4. 添加人工验证环节，确保翻译结果正确性');
    
  } catch (error) {
    // 回滚事务
    await query('ROLLBACK');
    console.error('❌ 清理数据库失败:', error.message);
    console.error('❌ 事务已回滚，数据库状态未改变');
  }
};

// 执行清理
const runCleanup = async () => {
  console.log('🚀 启动数据库清理流程...');
  await cleanupDatabase();
};

runCleanup();
