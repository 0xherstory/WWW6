import { query } from './database.js';
import { processOCR } from './ocrProcessor.js';
import nushuImageToChineseMapping from './nushuImageToChineseMapping.js';

// 设置路由
const setupRoutes = (app) => {
  // 健康检查
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Nushu Protocol Backend is running' });
  });

  // 创建翻译请求
  app.post('/api/translation/request', async (req, res) => {
    try {
      const { userWallet, imageUrl } = req.body;
      
      if (!userWallet || !imageUrl) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // 插入数据库记录
      const result = await query(
        'INSERT INTO translation_requests (user_wallet, image_url, status) VALUES ($1, $2, $3) RETURNING request_id',
        [userWallet, imageUrl, 'pending']
      );
      
      const requestId = result.rows[0].request_id;
      
      res.status(201).json({
        success: true,
        requestId,
        message: 'Translation request created successfully'
      });
    } catch (error) {
      console.error('Error creating translation request:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // 更新交易哈希
  app.post('/api/translation/update-tx', async (req, res) => {
    try {
      const { requestId, txHash } = req.body;
      
      if (!requestId || !txHash) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // 更新数据库记录
      await query(
        'UPDATE translation_requests SET tx_hash = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE request_id = $3',
        [txHash, 'processing', requestId]
      );
      
      res.status(200).json({
        success: true,
        message: 'Transaction hash updated successfully'
      });
    } catch (error) {
      console.error('Error updating transaction hash:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // 获取翻译结果
  app.get('/api/translation/result/:requestId', async (req, res) => {
    try {
      const { requestId } = req.params;
      
      const result = await query(
        'SELECT * FROM translation_requests WHERE request_id = $1',
        [requestId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Translation request not found' });
      }
      
      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error getting translation result:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // 获取用户翻译历史
  app.get('/api/translation/history/:userWallet', async (req, res) => {
    try {
      const { userWallet } = req.params;
      
      const result = await query(
        'SELECT * FROM translation_requests WHERE user_wallet = $1 ORDER BY created_at DESC',
        [userWallet]
      );
      
      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error getting translation history:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // 手动触发OCR处理（用于测试）
  app.post('/api/ocr/test', async (req, res) => {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ error: 'Missing imageUrl' });
      }
      
      const ocrResult = await processOCR(imageUrl, query);
      
      res.status(200).json({
        success: true,
        result: ocrResult
      });
    } catch (error) {
      console.error('Error processing OCR test:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // 获取女书图片列表
  app.get('/api/nushu/images', async (req, res) => {
    try {
      const { chineseChar } = req.query;
      let result;
      
      if (chineseChar) {
        // 根据汉字查询对应的女书图片
        result = await query(
          'SELECT * FROM nushu_images WHERE chinese_char = $1',
          [chineseChar]
        );
      } else {
        // 查询所有女书图片（分页）
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        result = await query(
          'SELECT * FROM nushu_images ORDER BY id LIMIT $1 OFFSET $2',
          [limit, offset]
        );
      }
      
      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error getting nushu images:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // 通过图片识别汉字（模拟实现）
  app.post('/api/ocr/image-to-chinese', async (req, res) => {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ error: 'Missing imageUrl' });
      }
      
      console.log(`Processing image-to-chinese for: ${imageUrl}`);
      
      // 模拟OCR处理延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟图片识别结果（实际项目中应调用真实的OCR服务）
      // 这里随机返回一个常用汉字
      const commonCharacters = ['女', '书', '文', '化', '保', '护', '平', '台', '中', '国'];
      const recognizedChinese = commonCharacters[Math.floor(Math.random() * commonCharacters.length)];
      
      // 查询对应的女书字符
      const charResult = await query(
        'SELECT nushu_char FROM nushu_characters WHERE chinese_char = $1',
        [recognizedChinese]
      );
      
      const nushuChar = charResult.rows.length > 0 ? charResult.rows[0].nushu_char : recognizedChinese;
      
      // 模拟OCR结果
      const ocrResult = {
        imageUrl,
        recognizedChinese,
        nushuChar,
        confidence: 0.92,
        processingTime: 1.5
      };
      
      res.status(200).json({
        success: true,
        data: ocrResult
      });
    } catch (error) {
      console.error('Error processing image-to-chinese:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // OCR处理路由
  app.post('/api/ocr/process', async (req, res) => {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ error: 'Missing imageUrl' });
      }
      
      console.log(`Processing OCR for image: ${imageUrl}`);
      
      // 调用OCR处理器
      const ocrResult = await processOCR(imageUrl, query);
      
      res.status(200).json({
        success: true,
        data: ocrResult
      });
    } catch (error) {
      console.error('Error processing OCR:', error.message);
      res.status(500).json({ 
        success: false,
        error: 'Internal server error' 
      });
    }
  });
  
  // 新增OCR上传路由
  app.post('/api/ocr/upload', async (req, res) => {
    try {
      // 模拟图片上传处理
      // 实际项目中应使用multer等库处理文件上传
      
      // 这里简化处理，直接返回模拟的图片URL
      const mockImageUrl = `https://example.com/uploaded-image-${Date.now()}.jpg`;
      
      res.status(200).json({
        success: true,
        imageUrl: mockImageUrl
      });
    } catch (error) {
      console.error('Error uploading image:', error.message);
      res.status(500).json({ 
        success: false,
        error: 'Internal server error' 
      });
    }
  });
  
  // 新增获取女书字符映射表
  app.get('/api/nushu/mapping', async (req, res) => {
    try {
      // 使用已导入的映射表（在文件顶部导入）
      res.status(200).json({
        success: true,
        data: nushuImageToChineseMapping
      });
    } catch (error) {
      console.error('Error getting nushu mapping:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // 获取女书字符列表
  app.get('/api/nushu/characters', async (req, res) => {
    try {
      const { chineseChar } = req.query;
      let result;
      
      if (chineseChar) {
        // 根据汉字查询对应的女书字符
        result = await query(
          'SELECT * FROM nushu_characters WHERE chinese_char = $1',
          [chineseChar]
        );
      } else {
        // 查询所有女书字符（分页）
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        result = await query(
          'SELECT * FROM nushu_characters ORDER BY id LIMIT $1 OFFSET $2',
          [limit, offset]
        );
      }
      
      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error getting nushu characters:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

};

export { setupRoutes };
