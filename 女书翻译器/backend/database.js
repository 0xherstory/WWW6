import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// 创建数据库连接池
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'nushu_protocol',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

// 连接数据库
const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Database connected successfully');
    
    // 创建翻译请求表（如果不存在）
    await createTranslationRequestsTable();
    
    // 创建女书字符表（如果不存在）
    await createNushuCharactersTable();
    
    // 创建女书图片表（如果不存在）
    await createNushuImagesTable();
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('Server will continue running without database connection');
  }
};

// 创建翻译请求表
const createTranslationRequestsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS translation_requests (
      request_id SERIAL PRIMARY KEY,
      user_wallet VARCHAR(255) NOT NULL,
      tx_hash VARCHAR(255),
      image_url TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      result_text TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- 创建索引
    CREATE INDEX IF NOT EXISTS idx_user_wallet ON translation_requests(user_wallet);
    CREATE INDEX IF NOT EXISTS idx_status ON translation_requests(status);
    CREATE INDEX IF NOT EXISTS idx_tx_hash ON translation_requests(tx_hash);
  `;
  
  try {
    await pool.query(query);
    console.log('Translation requests table created successfully');
  } catch (error) {
    console.error('Error creating translation requests table:', error.message);
  }
};

// 创建女书字符表
const createNushuCharactersTable = async () => {
  const query = `
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
  `;
  
  try {
    await pool.query(query);
    console.log('Nushu characters table created successfully');
  } catch (error) {
    console.error('Error creating nushu characters table:', error.message);
  }
};

// 创建女书图片表
const createNushuImagesTable = async () => {
  const query = `
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
  `;
  
  try {
    await pool.query(query);
    console.log('Nushu images table created successfully');
  } catch (error) {
    console.error('Error creating nushu images table:', error.message);
  }
};

// 执行查询
const query = async (text, params) => {
  return pool.query(text, params);
};

export { connectDB, query };
