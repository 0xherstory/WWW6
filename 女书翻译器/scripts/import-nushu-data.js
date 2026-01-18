// 女书数据导入脚本
// 从 GitHub 仓库导入女书字典数据到 PostgreSQL 数据库

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
// 女书字符仓库
const NUSHU_CHAR_REPO = 'https://github.com/nushu-script/nushu-script.github.io.git';
// 女书图片仓库
const NUSHU_IMAGE_REPO = 'https://github.com/nushu-script/nushu-nsgfzsfzt.git';
const CLONE_DIR = path.join(__dirname, '../temp/nushu-repo');
const IMAGE_CLONE_DIR = path.join(__dirname, '../temp/nushu-image-repo');
const DB_CONFIG = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'nushu_protocol',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
};

// 图片存储配置
const IMAGE_STORAGE_PATH = path.join(__dirname, '../public/nushu-images');
const IMAGE_BASE_URL = '/nushu-images';

// 创建数据库连接池
const pool = new Pool(DB_CONFIG);

// 主函数
async function main() {
  try {
    console.log('开始导入女书数据...');
    
    // 第一部分：导入女书字符数据
    console.log('\n=== 导入女书字符数据 ===');
    // 1. 克隆女书字符 GitHub 仓库
    await cloneRepository(NUSHU_CHAR_REPO, CLONE_DIR);
    
    // 2. 分析字符仓库结构
    const charRepoStructure = analyzeRepository(CLONE_DIR);
    console.log('字符仓库结构分析完成:', charRepoStructure);
    
    // 3. 创建女书字符表
    await createNushuTables();
    
    // 4. 导入女书字符数据
    await importNushuCharacters(CLONE_DIR);
    
    // 第二部分：导入女书图片数据
    console.log('\n=== 导入女书图片数据 ===');
    // 5. 克隆女书图片 GitHub 仓库
    await cloneRepository(NUSHU_IMAGE_REPO, IMAGE_CLONE_DIR);
    
    // 6. 分析图片仓库结构
    const imageRepoStructure = analyzeRepository(IMAGE_CLONE_DIR);
    console.log('图片仓库结构分析完成:', imageRepoStructure);
    
    // 7. 确保图片存储目录存在
    ensureImageStorage();
    
    // 8. 创建女书图片表
    await createNushuImageTable();
    
    // 9. 导入女书图片数据
    await importNushuImages(IMAGE_CLONE_DIR);
    
    // 10. 清理临时文件
    cleanup();
    
    console.log('\n女书数据导入完成！');
    
  } catch (error) {
    console.error('导入失败:', error.message);
    process.exit(1);
  } finally {
    // 关闭数据库连接
    await pool.end();
  }
}

// 克隆 GitHub 仓库
function cloneRepository(repoUrl, targetDir) {
  console.log(`正在克隆 GitHub 仓库: ${repoUrl}`);
  
  // 删除旧的克隆目录
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  
  // 创建临时目录
  fs.mkdirSync(targetDir, { recursive: true });
  
  // 克隆仓库
  execSync(`git clone ${repoUrl} ${targetDir}`, {
    stdio: 'inherit'
  });
  
  console.log(`仓库克隆完成，存储在: ${targetDir}`);
}

// 分析仓库结构
function analyzeRepository(repoDir) {
  console.log(`正在分析仓库结构: ${repoDir}`);
  
  const structure = {
    directories: [],
    files: [],
    nushuResources: [],
    imageFiles: []
  };
  
  // 遍历仓库目录
  function traverse(dir, level = 0) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        structure.directories.push(filePath.replace(repoDir, ''));
        traverse(filePath, level + 1);
      } else {
        const relativePath = filePath.replace(repoDir, '');
        structure.files.push(relativePath);
        
        // 识别女书字符相关资源
        if (file.match(/\.(json|csv|txt)$/i) || 
            file.match(/nushu|女书/i) || 
            relativePath.includes('nsbzz') || 
            relativePath.includes('unicode')) {
          structure.nushuResources.push(relativePath);
        }
        
        // 识别图片文件
        if (file.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
          structure.imageFiles.push(relativePath);
        }
      }
    }
  }
  
  traverse(repoDir);
  
  return structure;
}

// 创建女书字符表
async function createNushuTables() {
  console.log('正在创建女书字符表...');
  
  const client = await pool.connect();
  
  try {
    // 创建女书字符表
    await client.query(`
      CREATE TABLE IF NOT EXISTS nushu_characters (
        id SERIAL PRIMARY KEY,
        chinese_char VARCHAR(10) NOT NULL,
        nushu_char VARCHAR(20) NOT NULL,
        pronunciation VARCHAR(50),
        meaning TEXT,
        unicode VARCHAR(20),
        source VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- 创建索引
      CREATE INDEX IF NOT EXISTS idx_chinese_char ON nushu_characters(chinese_char);
      CREATE INDEX IF NOT EXISTS idx_nushu_char ON nushu_characters(nushu_char);
      CREATE INDEX IF NOT EXISTS idx_unicode ON nushu_characters(unicode);
    `);
    
    console.log('女书字符表创建完成');
    
  } finally {
    client.release();
  }
}

// 确保图片存储目录存在
function ensureImageStorage() {
  console.log(`正在准备图片存储目录: ${IMAGE_STORAGE_PATH}`);
  
  // 创建图片存储目录（如果不存在）
  if (!fs.existsSync(IMAGE_STORAGE_PATH)) {
    fs.mkdirSync(IMAGE_STORAGE_PATH, { recursive: true });
  }
  
  console.log('图片存储目录准备完成');
}

// 创建女书图片表
async function createNushuImageTable() {
  console.log('正在创建女书图片表...');
  
  const client = await pool.connect();
  
  try {
    // 创建女书图片表
    await client.query(`
      CREATE TABLE IF NOT EXISTS nushu_images (
        id SERIAL PRIMARY KEY,
        chinese_char VARCHAR(10) NOT NULL,
        image_filename VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        source VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chinese_char) REFERENCES nushu_characters(chinese_char) ON DELETE CASCADE
      );
      
      -- 创建索引
      CREATE INDEX IF NOT EXISTS idx_image_chinese_char ON nushu_images(chinese_char);
      CREATE INDEX IF NOT EXISTS idx_image_filename ON nushu_images(image_filename);
    `);
    
    console.log('女书图片表创建完成');
    
  } finally {
    client.release();
  }
}

// 导入女书字符数据
async function importNushuCharacters(repoDir) {
  console.log('正在导入女书字符数据...');
  
  // 从仓库中查找女书字典数据文件
  const nushuFiles = [];
  
  // 搜索女书相关的 JSON、CSV、TXT 文件
  function searchNushuFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        searchNushuFiles(filePath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if ([ '.json', '.csv', '.txt' ].includes(ext)) {
          nushuFiles.push(filePath);
        }
      }
    }
  }
  
  searchNushuFiles(repoDir);
  
  console.log(`找到 ${nushuFiles.length} 个可能包含女书数据的文件`);
  
  // 处理每个文件
  for (const file of nushuFiles) {
    console.log(`正在处理文件: ${file}`);
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // 根据文件类型处理
      const ext = path.extname(file).toLowerCase();
      
      if (ext === '.json') {
        // 处理 JSON 文件
        await processJsonFile(content, file);
      } else if (ext === '.csv') {
        // 处理 CSV 文件
        await processCsvFile(content, file);
      } else if (ext === '.txt') {
        // 处理 TXT 文件
        await processTxtFile(content, file);
      }
      
    } catch (error) {
      console.error(`处理文件 ${file} 失败:`, error.message);
      continue;
    }
  }
  
  console.log('女书字符数据导入完成');
}

// 导入女书图片数据
async function importNushuImages(repoDir) {
  console.log('正在导入女书图片数据...');
  
  // 搜索所有图片文件
  const imageFiles = [];
  
  function searchImageFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        searchImageFiles(filePath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if ([ '.jpg', '.jpeg', '.png', '.gif', '.bmp' ].includes(ext)) {
          imageFiles.push(filePath);
        }
      }
    }
  }
  
  searchImageFiles(repoDir);
  
  console.log(`找到 ${imageFiles.length} 个女书图片文件`);
  
  const client = await pool.connect();
  
  try {
    // 处理每个图片文件
    for (const imageFile of imageFiles) {
      console.log(`正在处理图片: ${imageFile}`);
      
      // 从文件名提取汉字（假设文件名格式为：汉字_xxx.jpg）
      const filename = path.basename(imageFile);
      const chineseChar = filename.split('_')[0];
      
      // 复制图片到存储目录
      const targetFilename = `${Date.now()}_${filename}`;
      const targetPath = path.join(IMAGE_STORAGE_PATH, targetFilename);
      
      // 创建图片URL
      const imageUrl = `${IMAGE_BASE_URL}/${targetFilename}`;
      
      // 复制图片文件
      fs.copyFileSync(imageFile, targetPath);
      
      // 插入数据库
      await client.query(`
        INSERT INTO nushu_images (chinese_char, image_filename, image_url, source)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [chineseChar, targetFilename, imageUrl, repoDir]);
      
      console.log(`图片 ${filename} 处理完成，对应汉字：${chineseChar}`);
    }
    
    console.log('女书图片数据导入完成');
    
  } finally {
    client.release();
  }
}

// 处理 JSON 文件
async function processJsonFile(content, filePath) {
  try {
    const data = JSON.parse(content);
    
    // 这里需要根据实际的 JSON 结构进行调整
    // 假设 JSON 结构为 { "characters": [{ "chinese": "女", "nushu": "ꓮ", ... }] }
    
    if (Array.isArray(data)) {
      // 直接是字符数组
      await insertCharacters(data, filePath);
    } else if (data.characters && Array.isArray(data.characters)) {
      // 包含 characters 字段
      await insertCharacters(data.characters, filePath);
    } else {
      console.log(`JSON 文件 ${filePath} 结构不符合预期`);
    }
    
  } catch (error) {
    console.error(`解析 JSON 文件 ${filePath} 失败:`, error.message);
  }
}

// 处理 CSV 文件
async function processCsvFile(content, filePath) {
  try {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(header => header.trim());
    
    const characters = [];
    
    // 处理每一行数据
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim());
      const charData = {};
      
      // 映射表头到值
      for (let j = 0; j < headers.length; j++) {
        charData[headers[j]] = values[j];
      }
      
      characters.push(charData);
    }
    
    await insertCharacters(characters, filePath);
    
  } catch (error) {
    console.error(`解析 CSV 文件 ${filePath} 失败:`, error.message);
  }
}

// 处理 TXT 文件
async function processTxtFile(content, filePath) {
  try {
    const lines = content.split('\n').filter(line => line.trim());
    const characters = [];
    
    // 假设 TXT 文件每行格式为：汉字 女书字符 [发音] [含义]
    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        characters.push({
          chinese: parts[0],
          nushu: parts[1],
          pronunciation: parts[2] || '',
          meaning: parts.slice(3).join(' ') || ''
        });
      }
    }
    
    await insertCharacters(characters, filePath);
    
  } catch (error) {
    console.error(`解析 TXT 文件 ${filePath} 失败:`, error.message);
  }
}

// 插入字符数据到数据库
async function insertCharacters(characters, source) {
  const client = await pool.connect();
  
  try {
    for (const char of characters) {
      // 映射字段名
      const chineseChar = char.chinese || char.chinese_char || char.汉字 || '';
      const nushuChar = char.nushu || char.nushu_char || char.女书 || char.char || '';
      const pronunciation = char.pronunciation || char.pronounce || char.发音 || '';
      const meaning = char.meaning || char.含义 || '';
      const unicode = char.unicode || char.Unicode || '';
      
      // 只插入有汉字和女书字符的数据
      if (chineseChar && nushuChar) {
        await client.query(`
          INSERT INTO nushu_characters (chinese_char, nushu_char, pronunciation, meaning, unicode, source)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, [chineseChar, nushuChar, pronunciation, meaning, unicode, source]);
      }
    }
    
  } finally {
    client.release();
  }
}

// 清理临时文件
function cleanup() {
  console.log('正在清理临时文件...');
  
  // 清理字符仓库临时目录
  if (fs.existsSync(CLONE_DIR)) {
    fs.rmSync(CLONE_DIR, { recursive: true, force: true });
  }
  
  // 清理图片仓库临时目录
  if (fs.existsSync(IMAGE_CLONE_DIR)) {
    fs.rmSync(IMAGE_CLONE_DIR, { recursive: true, force: true });
  }
  
  console.log('临时文件清理完成');
}

// 运行主函数
main();
