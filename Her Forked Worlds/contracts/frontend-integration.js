/**
 * 前端集成示例 - 分叉叙事宇宙智能合约
 *
 * 使用方法：
 * 1. 安装依赖：npm install ethers crypto-js
 * 2. 导入这个文件到你的前端项目
 * 3. 修改合约地址为实际部署的地址
 */

import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

// ========== 配置 ==========
const CONFIG = {
  // 替换为实际部署的合约地址
  contracts: {
    StoryChapterNFT: "0x...",
    CopyrightRegistry: "0x...",
    RevenueSharing: "0x..."
  },

  // ABI（从编译后的artifacts文件夹获取）
  abis: {
    StoryChapterNFT: [], // 导入实际的ABI
    CopyrightRegistry: [],
    RevenueSharing: []
  }
};

// ========== 初始化 ==========
let provider;
let signer;
let contracts = {};

/**
 * 连接钱包
 */
async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('请安装MetaMask钱包!');
  }

  // 请求连接
  await window.ethereum.request({ method: 'eth_requestAccounts' });

  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();

  // 初始化合约实例
  contracts.chapterNFT = new ethers.Contract(
    CONFIG.contracts.StoryChapterNFT,
    CONFIG.abis.StoryChapterNFT,
    signer
  );

  contracts.copyright = new ethers.Contract(
    CONFIG.contracts.CopyrightRegistry,
    CONFIG.abis.CopyrightRegistry,
    signer
  );

  contracts.revenue = new ethers.Contract(
    CONFIG.contracts.RevenueSharing,
    CONFIG.abis.RevenueSharing,
    signer
  );

  const address = await signer.getAddress();
  console.log('钱包已连接:', address);

  return address;
}

// ========== 加密与解密工具 ==========

/**
 * 生成随机AES密钥
 */
function generateRandomKey() {
  return CryptoJS.lib.WordArray.random(256 / 8).toString();
}

/**
 * 加密内容
 */
function encryptContent(content, key) {
  return CryptoJS.AES.encrypt(content, key).toString();
}

/**
 * 解密内容
 */
function decryptContent(encrypted, key) {
  const bytes = CryptoJS.AES.decrypt(encrypted, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * 计算内容哈希
 */
function calculateContentHash(content) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(content));
}

// ========== IPFS 工具（需要配置IPFS节点）==========

/**
 * 上传到IPFS
 */
async function uploadToIPFS(data) {
  // 方式1：使用 Infura IPFS
  const INFURA_PROJECT_ID = 'YOUR_PROJECT_ID';
  const INFURA_PROJECT_SECRET = 'YOUR_PROJECT_SECRET';
  const auth = 'Basic ' + btoa(INFURA_PROJECT_ID + ':' + INFURA_PROJECT_SECRET);

  const formData = new FormData();
  formData.append('file', new Blob([data]));

  const response = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'POST',
    headers: {
      'Authorization': auth
    },
    body: formData
  });

  const result = await response.json();
  return result.Hash;
}

/**
 * 从IPFS下载
 */
async function fetchFromIPFS(hash) {
  const response = await fetch(`https://ipfs.io/ipfs/${hash}`);
  return await response.text();
}

// ========== 章节NFT功能 ==========

/**
 * 发布章节
 */
async function publishChapter(chapterData) {
  try {
    console.log('开始发布章节...');

    // 1. 生成加密密钥
    const key = generateRandomKey();
    console.log('✓ 密钥已生成');

    // 2. 加密内容
    const encrypted = encryptContent(chapterData.content, key);
    console.log('✓ 内容已加密');

    // 3. 上传到IPFS
    const ipfsHash = await uploadToIPFS(encrypted);
    console.log('✓ 已上传到IPFS:', ipfsHash);

    // 4. 计算内容哈希（版权证明）
    const contentHash = calculateContentHash(chapterData.content);
    console.log('✓ 内容哈希:', contentHash);

    // 5. 加密密钥（简化版，实际应该用公钥加密）
    const encryptedKey = ethers.utils.hexlify(
      ethers.utils.toUtf8Bytes(key)
    );

    // 6. 准备元数据
    const metadata = {
      name: chapterData.title,
      description: chapterData.description || '',
      image: chapterData.coverImage || '',
      attributes: [
        { trait_type: 'Story ID', value: chapterData.storyId },
        { trait_type: 'Chapter Number', value: chapterData.chapterNumber }
      ]
    };

    const metadataHash = await uploadToIPFS(JSON.stringify(metadata));
    const tokenURI = `ipfs://${metadataHash}`;

    // 7. 调用智能合约
    const tx = await contracts.chapterNFT.publishChapter(
      chapterData.storyId,
      chapterData.title,
      contentHash,
      ipfsHash,
      encryptedKey,
      ethers.utils.parseEther(chapterData.price || "0.001"), // 默认0.001 ETH
      Math.floor(Date.now() / 1000) + (48 * 3600), // 48小时后免费
      1000, // 10% 版税
      tokenURI
    );

    console.log('交易已发送:', tx.hash);
    const receipt = await tx.wait();
    console.log('✅ 章节发布成功!', receipt);

    // 从事件中获取tokenId
    const event = receipt.events?.find(e => e.event === 'ChapterPublished');
    const tokenId = event?.args?.tokenId;

    return {
      success: true,
      tokenId: tokenId.toString(),
      txHash: receipt.transactionHash
    };
  } catch (error) {
    console.error('发布失败:', error);
    throw error;
  }
}

/**
 * 购买章节NFT
 */
async function buyChapter(tokenId) {
  try {
    const chapterInfo = await contracts.chapterNFT.getChapterInfo(tokenId);
    const price = chapterInfo.price;

    console.log(`购买章节 #${tokenId}, 价格: ${ethers.utils.formatEther(price)} ETH`);

    const tx = await contracts.chapterNFT.purchaseChapter(tokenId, {
      value: price
    });

    console.log('交易已发送:', tx.hash);
    const receipt = await tx.wait();
    console.log('✅ 购买成功!', receipt);

    return {
      success: true,
      txHash: receipt.transactionHash
    };
  } catch (error) {
    console.error('购买失败:', error);
    throw error;
  }
}

/**
 * 阅读章节
 */
async function readChapter(tokenId) {
  try {
    // 1. 检查访问权限
    const address = await signer.getAddress();
    const hasAccess = await contracts.chapterNFT.hasAccessToChapter(tokenId, address);

    if (!hasAccess) {
      const chapterInfo = await contracts.chapterNFT.getChapterInfo(tokenId);

      // 检查是否可以免费解锁
      const now = Math.floor(Date.now() / 1000);
      if (chapterInfo.unlockTime > 0 && now >= chapterInfo.unlockTime) {
        console.log('章节已免费解锁！');
      } else {
        throw new Error('需要购买NFT才能阅读此章节');
      }
    }

    console.log('✓ 访问权限验证通过');

    // 2. 获取加密的密钥
    const encryptedKey = await contracts.chapterNFT.getDecryptionKey(tokenId);
    const key = ethers.utils.toUtf8String(encryptedKey);
    console.log('✓ 密钥已获取');

    // 3. 获取章节信息
    const chapterInfo = await contracts.chapterNFT.getChapterInfo(tokenId);

    // 4. 从IPFS下载加密内容
    const encrypted = await fetchFromIPFS(chapterInfo.encryptedContentIPFS);
    console.log('✓ 内容已下载');

    // 5. 解密内容
    const content = decryptContent(encrypted, key);
    console.log('✓ 内容已解密');

    return {
      title: chapterInfo.title,
      content: content,
      creator: chapterInfo.creator,
      isCanon: chapterInfo.isCanon
    };
  } catch (error) {
    console.error('阅读失败:', error);
    throw error;
  }
}

/**
 * 打赏章节
 */
async function tipChapter(tokenId, amount) {
  try {
    const tx = await contracts.chapterNFT.tipChapter(tokenId, {
      value: ethers.utils.parseEther(amount.toString())
    });

    console.log('交易已发送:', tx.hash);
    const receipt = await tx.wait();
    console.log('✅ 打赏成功!', receipt);

    return {
      success: true,
      txHash: receipt.transactionHash
    };
  } catch (error) {
    console.error('打赏失败:', error);
    throw error;
  }
}

/**
 * 检查用户的章节访问权限
 */
async function checkAccess(tokenId) {
  const address = await signer.getAddress();
  return await contracts.chapterNFT.hasAccessToChapter(tokenId, address);
}

/**
 * 获取故事的所有章节
 */
async function getStoryChapters(storyId) {
  return await contracts.chapterNFT.getStoryChapters(storyId);
}

// ========== 版权功能 ==========

/**
 * 注册版权
 */
async function registerCopyright(content, title, licenseType = "All Rights Reserved") {
  try {
    // 1. 计算内容哈希
    const contentHash = calculateContentHash(content);

    // 2. 加密并上传到IPFS
    const key = generateRandomKey();
    const encrypted = encryptContent(content, key);
    const ipfsHash = await uploadToIPFS(encrypted);

    // 3. 调用合约注册版权
    const tx = await contracts.copyright.registerCopyright(
      contentHash,
      title,
      ipfsHash,
      licenseType
    );

    console.log('交易已发送:', tx.hash);
    const receipt = await tx.wait();
    console.log('✅ 版权注册成功!', receipt);

    return {
      success: true,
      contentHash: contentHash,
      txHash: receipt.transactionHash
    };
  } catch (error) {
    console.error('版权注册失败:', error);
    throw error;
  }
}

/**
 * 验证版权归属
 */
async function verifyCopyright(content, claimedOwner) {
  const contentHash = calculateContentHash(content);
  return await contracts.copyright.verifyCopyrightOwnership(contentHash, claimedOwner);
}

// ========== 导出API ==========
export default {
  // 初始化
  connectWallet,

  // 章节NFT
  publishChapter,
  buyChapter,
  readChapter,
  tipChapter,
  checkAccess,
  getStoryChapters,

  // 版权
  registerCopyright,
  verifyCopyright,

  // 工具函数
  calculateContentHash,

  // 合约实例（高级用法）
  contracts
};

// ========== 使用示例 ==========
/*
// 1. 连接钱包
await connectWallet();

// 2. 发布章节
const result = await publishChapter({
  storyId: 1,
  title: "第一章：开端",
  content: "很久很久以前...",
  price: "0.001", // ETH
  chapterNumber: 1
});

// 3. 购买章节
await buyChapter(result.tokenId);

// 4. 阅读章节
const chapter = await readChapter(result.tokenId);
console.log(chapter.content);

// 5. 打赏章节
await tipChapter(result.tokenId, "0.01"); // 0.01 ETH
*/
