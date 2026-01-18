// 模拟OCR处理（实际项目中可替换为真实的OCR服务）
// 这里使用简单的模拟实现，实际项目中可以集成腾讯云OCR、百度OCR等服务

// 导入女书图片到汉字的映射表
import nushuImageToChineseMapping from './nushuImageToChineseMapping.js';

// 处理OCR请求
const processOCR = async (imageUrl, query) => {
  console.log(`Processing OCR for image: ${imageUrl}`);
  
  // 模拟OCR处理延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 图片URL特征到汉字的映射表（与前端保持一致）
  const imageFeatureToChineseMapping = {
    '565': '人', // 人 - https://nushuscript.org/nsbzzzd/img/565.png
    '569': '女', // 女 - https://nushuscript.org/nsbzzzd/img/569.png
    '593': '书', // 书 - https://nushuscript.org/nsbzzzd/img/593.png
    '164': '文', // 文 - https://nushuscript.org/nsbzzzd/img/164.png
    '140': '化', // 化 - https://nushuscript.org/nsbzzzd/img/140.png
    '17': '保', // 保 - https://nushuscript.org/nsbzzzd/img/17.png
    '151': '护', // 护 - https://nushuscript.org/nsbzzzd/img/151.png
    '40': '平', // 平 - https://nushuscript.org/nsbzzzd/img/40.png
    '830': '台', // 台 - https://nushuscript.org/nsbzzzd/img/830.png
    '490': '中', // 中 - https://nushuscript.org/nsbzzzd/img/490.png
    '383': '国', // 国 - https://nushuscript.org/nsbzzzd/img/383.png
    '821': '爱', // 爱 - https://nushuscript.org/nsbzzzd/img/821.png
    '696': '情', // 情 - https://nushuscript.org/nsbzzzd/img/696.png
    '358': '界', // 界 - https://nushuscript.org/nsbzzzd/img/358.png
    '154': '和', // 和 - https://nushuscript.org/nsbzzzd/img/154.png
    '460': '谐', // 谐 - https://nushuscript.org/nsbzzzd/img/460.png
  };
  
  // 提取图片特征：从URL中提取图片ID（数字部分）
  const urlParts = imageUrl.split('/');
  const lastPart = urlParts[urlParts.length - 1];
  const imageId = lastPart.match(/\d+/);
  const imageFeature = imageId ? imageId[0] : null;
  
  console.log('提取的图片特征:', imageFeature);
  
  // 根据图片特征映射到汉字
  let recognizedChinese;
  
  if (imageFeature && imageFeatureToChineseMapping[imageFeature]) {
    // 使用预定义的映射
    recognizedChinese = imageFeatureToChineseMapping[imageFeature];
    console.log('使用预定义映射:', { imageFeature, recognizedChinese });
  } else {
    // 如果没有预定义映射，默认返回女字
    recognizedChinese = '女';
    console.log('没有预定义映射，使用默认女字');
  }
  
  // 根据汉字查找对应的女书字符
  let recognizedNushu = '未知';
  for (const [nushuChar, chineseChar] of Object.entries(nushuImageToChineseMapping)) {
    if (chineseChar === recognizedChinese) {
      recognizedNushu = nushuChar;
      break;
    }
  }
  
  // 随机生成可信度（0.85-0.99之间）
  const confidence = 0.85 + (Math.random() * 0.14);
  
  // 模拟OCR结果（女书图片转汉字）
  const ocrResult = {
    chineseText: recognizedChinese,
    nushuText: recognizedNushu, // 识别出的女书字符
    confidence: parseFloat(confidence.toFixed(2)),
    processingTime: 2.0 + (Math.random() * 1.0)
  };
  
  console.log('OCR processing completed:', ocrResult);
  return ocrResult;
};

// 更新翻译结果到数据库
const updateTranslationResult = async (requestId, ocrResult, query) => {
  try {
    await query(
      'UPDATE translation_requests SET result_text = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE request_id = $3',
      [JSON.stringify(ocrResult), 'success', requestId]
    );
    console.log(`Updated translation result for request ${requestId}`);
  } catch (error) {
    console.error(`Error updating translation result for request ${requestId}:`, error.message);
    // 更新为失败状态
    await query(
      'UPDATE translation_requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE request_id = $2',
      ['failed', requestId]
    );
  }
};

export { processOCR, updateTranslationResult };
