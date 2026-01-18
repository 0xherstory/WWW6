import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './database.js';
import { setupRoutes } from './routes.js';
import { startEventListener } from './eventListener.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 连接数据库
connectDB();

// 设置路由
setupRoutes(app);

// 启动事件监听器
startEventListener();

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
