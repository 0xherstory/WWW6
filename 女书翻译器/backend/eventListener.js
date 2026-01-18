import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { query } from './database.js';
import { processOCR, updateTranslationResult } from './ocrProcessor.js';

dotenv.config();

// 智能合约ABI（简化版，实际使用时需要完整ABI）
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "imageUrl",
        "type": "string"
      }
    ],
    "name": "TranslationRequested",
    "type": "event"
  }
];

// 启动事件监听器
const startEventListener = () => {
  try {
    // 检查环境变量
    if (!process.env.SEPOLIA_RPC_URL || !process.env.CONTRACT_ADDRESS) {
      console.error('Missing required environment variables: SEPOLIA_RPC_URL or CONTRACT_ADDRESS');
      return;
    }
    
    // 创建提供者和合约实例
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, provider);
    
    console.log(`Listening to TranslationRequested events from contract: ${process.env.CONTRACT_ADDRESS}`);
    
    // 监听TranslationRequested事件
    contract.on('TranslationRequested', async (user, requestId, imageUrl, event) => {
      console.log(`\nNew TranslationRequested event:`);
      console.log(`- User: ${user}`);
      console.log(`- Request ID: ${requestId.toString()}`);
      console.log(`- Image URL: ${imageUrl}`);
      console.log(`- Transaction Hash: ${event.log.transactionHash}`);
      
      try {
        // 处理OCR，传递query参数
        const ocrResult = await processOCR(imageUrl, query);
        
        // 更新数据库
        await updateTranslationResult(requestId.toString(), ocrResult, query);
        
        console.log(`Successfully processed translation request ${requestId}`);
      } catch (error) {
        console.error(`Error processing translation request ${requestId}:`, error.message);
      }
    });
    
  } catch (error) {
    console.error('Error starting event listener:', error.message);
    // 5秒后重试
    setTimeout(startEventListener, 5000);
  }
};

export { startEventListener };
