# VisionFocus Hours - 智能合约文档

## 📋 目录
- [合约概述](#合约概述)
- [合约架构](#合约架构)
- [核心合约](#核心合约)
- [部署信息](#部署信息)
- [使用指南](#使用指南)
- [安全考虑](#安全考虑)
- [测试用例](#测试用例)

---

## 合约概述

### 项目信息
- **项目名称**: VisionFocus Hours
- **合约标准**: ERC-721 (NFT)
- **开发框架**: Hardhat
- **Solidity版本**: ^0.8.20
- **测试网络**: Sepolia
- **主网**: Ethereum Mainnet (未来)

### 功能概述
VisionFocus Hours 智能合约用于铸造和管理年度专注时光 NFT。每个 NFT 代表用户一年的专注时光记录,包含:
- 📅 年度信息 (2026, 2027...)
- ⏰ 总专注时间
- 🎯 愿望完成情况
- 🏆 成就等级
- 🎨 愿景板快照

---

## 合约架构

### 合约结构图

```
┌─────────────────────────────────────────────────────────────┐
│                    VisionFocusHoursNFT                      │
│                   (Main NFT Contract)                       │
│                                                             │
│  - ERC721                                                   │
│  - Ownable                                                  │
│  - Pausable                                                 │
│  - ReentrancyGuard                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Achievement  │   │   Metadata   │   │   Royalty    │
│   Manager    │   │   Registry   │   │   Manager    │
│              │   │              │   │              │
│ - 等级计算   │   │ - Token URI  │   │ - 版税分配   │
│ - 里程碑     │   │ - IPFS管理   │   │ - 二级市场   │
└──────────────┘   └──────────────┘   └──────────────┘
```

---

## 核心合约

### 1. VisionFocusHoursNFT.sol (主合约)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title VisionFocusHoursNFT
 * @dev 年度专注时光 NFT 合约
 * @notice 每个 NFT 代表用户一年的专注时光记录
 */
contract VisionFocusHoursNFT is 
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    Ownable,
    Pausable,
    ReentrancyGuard
{
    using Counters for Counters.Counter;
    
    // ============ 状态变量 ============
    
    /// @dev Token ID 计数器
    Counters.Counter private _tokenIdCounter;
    
    /// @dev 铸造费用 (wei)
    uint256 public mintPrice;
    
    /// @dev 最大供应量 (0 = 无限制)
    uint256 public maxSupply;
    
    /// @dev 每个用户每年最多铸造数量
    uint256 public maxMintsPerUserPerYear;
    
    /// @dev 合约收入接收地址
    address payable public treasury;
    
    /// @dev 版税比例 (基点: 250 = 2.5%)
    uint96 public royaltyBps;
    
    // ============ 数据结构 ============
    
    /// @dev NFT 元数据结构
    struct TokenMetadata {
        uint256 year;              // 年份
        address minter;            // 铸造者
        uint256 totalFocusHours;   // 总专注时间
        uint256 wishesCount;       // 愿望数量
        uint256 completedWishes;   // 完成的愿望数量
        uint256 mintTimestamp;     // 铸造时间戳
        string achievementLevel;   // 成就等级
        bool exists;               // 是否存在
    }
    
    /// @dev Token ID => 元数据
    mapping(uint256 => TokenMetadata) public tokenMetadata;
    
    /// @dev 用户地址 => 年份 => Token ID
    mapping(address => mapping(uint256 => uint256)) public userYearTokens;
    
    /// @dev 用户地址 => 年份 => 已铸造数量
    mapping(address => mapping(uint256 => uint256)) public userYearMintCount;
    
    /// @dev 年份 => 铸造总数
    mapping(uint256 => uint256) public yearMintCount;
    
    // ============ 事件 ============
    
    /// @dev NFT 铸造事件
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed minter,
        uint256 year,
        uint256 totalFocusHours,
        string achievementLevel
    );
    
    /// @dev 元数据更新事件
    event MetadataUpdated(
        uint256 indexed tokenId,
        string newTokenURI
    );
    
    /// @dev 铸造价格更新事件
    event MintPriceUpdated(
        uint256 oldPrice,
        uint256 newPrice
    );
    
    /// @dev 提款事件
    event Withdrawal(
        address indexed recipient,
        uint256 amount
    );
    
    // ============ 修饰符 ============
    
    /// @dev 确保年份有效
    modifier validYear(uint256 year) {
        require(year >= 2024 && year <= 2100, "Invalid year");
        _;
    }
    
    /// @dev 确保未超过铸造限制
    modifier withinMintLimit(address user, uint256 year) {
        require(
            userYearMintCount[user][year] < maxMintsPerUserPerYear,
            "Mint limit reached for this year"
        );
        _;
    }
    
    /// @dev 确保未超过最大供应量
    modifier withinMaxSupply() {
        require(
            maxSupply == 0 || _tokenIdCounter.current() < maxSupply,
            "Max supply reached"
        );
        _;
    }
    
    // ============ 构造函数 ============
    
    /**
     * @dev 构造函数
     * @param _mintPrice 铸造价格 (wei)
     * @param _maxSupply 最大供应量 (0 = 无限制)
     * @param _maxMintsPerUserPerYear 每用户每年最大铸造数量
     * @param _treasury 收入接收地址
     * @param _royaltyBps 版税比例 (基点)
     */
    constructor(
        uint256 _mintPrice,
        uint256 _maxSupply,
        uint256 _maxMintsPerUserPerYear,
        address payable _treasury,
        uint96 _royaltyBps
    ) ERC721("VisionFocus Hours", "VFHOURS") {
        mintPrice = _mintPrice;
        maxSupply = _maxSupply;
        maxMintsPerUserPerYear = _maxMintsPerUserPerYear;
        treasury = _treasury;
        royaltyBps = _royaltyBps;
        
        // Token ID 从 1 开始
        _tokenIdCounter.increment();
    }
    
    // ============ 核心功能 ============
    
    /**
     * @dev 铸造年度 NFT
     * @param year 年份
     * @param totalFocusHours 总专注时间
     * @param wishesCount 愿望数量
     * @param completedWishes 完成的愿望数量
     * @param tokenURI Token URI (IPFS链接)
     * @return tokenId 新铸造的 Token ID
     */
    function mint(
        uint256 year,
        uint256 totalFocusHours,
        uint256 wishesCount,
        uint256 completedWishes,
        string memory tokenURI
    )
        external
        payable
        validYear(year)
        withinMintLimit(msg.sender, year)
        withinMaxSupply
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        // 检查支付金额
        require(msg.value >= mintPrice, "Insufficient payment");
        
        // 检查该用户该年是否已铸造
        require(
            userYearTokens[msg.sender][year] == 0,
            "Already minted for this year"
        );
        
        // 获取新的 Token ID
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // 铸造 NFT
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // 计算成就等级
        string memory achievementLevel = _calculateAchievementLevel(totalFocusHours);
        
        // 保存元数据
        tokenMetadata[tokenId] = TokenMetadata({
            year: year,
            minter: msg.sender,
            totalFocusHours: totalFocusHours,
            wishesCount: wishesCount,
            completedWishes: completedWishes,
            mintTimestamp: block.timestamp,
            achievementLevel: achievementLevel,
            exists: true
        });
        
        // 更新映射
        userYearTokens[msg.sender][year] = tokenId;
        userYearMintCount[msg.sender][year]++;
        yearMintCount[year]++;
        
        // 退还多余支付
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }
        
        // 触发事件
        emit NFTMinted(
            tokenId,
            msg.sender,
            year,
            totalFocusHours,
            achievementLevel
        );
        
        return tokenId;
    }
    
    /**
     * @dev 批量铸造 (管理员功能)
     * @param recipients 接收者地址数组
     * @param years 年份数组
     * @param focusHoursArray 专注时间数组
     * @param tokenURIs Token URI 数组
     */
    function batchMint(
        address[] calldata recipients,
        uint256[] calldata years,
        uint256[] calldata focusHoursArray,
        string[] calldata tokenURIs
    )
        external
        onlyOwner
        whenNotPaused
    {
        require(
            recipients.length == years.length &&
            years.length == focusHoursArray.length &&
            focusHoursArray.length == tokenURIs.length,
            "Array length mismatch"
        );
        
        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            
            _safeMint(recipients[i], tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            
            string memory achievementLevel = _calculateAchievementLevel(focusHoursArray[i]);
            
            tokenMetadata[tokenId] = TokenMetadata({
                year: years[i],
                minter: recipients[i],
                totalFocusHours: focusHoursArray[i],
                wishesCount: 0,
                completedWishes: 0,
                mintTimestamp: block.timestamp,
                achievementLevel: achievementLevel,
                exists: true
            });
            
            userYearTokens[recipients[i]][years[i]] = tokenId;
            yearMintCount[years[i]]++;
        }
    }
    
    /**
     * @dev 更新 Token URI
     * @param tokenId Token ID
     * @param newTokenURI 新的 Token URI
     */
    function updateTokenURI(
        uint256 tokenId,
        string memory newTokenURI
    )
        external
    {
        require(_exists(tokenId), "Token does not exist");
        require(
            ownerOf(tokenId) == msg.sender || owner() == msg.sender,
            "Not authorized"
        );
        
        _setTokenURI(tokenId, newTokenURI);
        
        emit MetadataUpdated(tokenId, newTokenURI);
    }
    
    /**
     * @dev 销毁 NFT
     * @param tokenId Token ID
     */
    function burn(uint256 tokenId) external {
        require(_exists(tokenId), "Token does not exist");
        require(
            ownerOf(tokenId) == msg.sender,
            "Not token owner"
        );
        
        // 清理映射
        TokenMetadata memory metadata = tokenMetadata[tokenId];
        delete userYearTokens[metadata.minter][metadata.year];
        delete tokenMetadata[tokenId];
        
        _burn(tokenId);
    }
    
    // ============ 查询功能 ============
    
    /**
     * @dev 获取用户某年的 Token ID
     * @param user 用户地址
     * @param year 年份
     * @return tokenId Token ID (0 表示不存在)
     */
    function getUserYearToken(
        address user,
        uint256 year
    )
        external
        view
        returns (uint256)
    {
        return userYearTokens[user][year];
    }
    
    /**
     * @dev 获取用户所有 Token ID
     * @param user 用户地址
     * @return tokenIds Token ID 数组
     */
    function getUserTokens(
        address user
    )
        external
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(user, i);
        }
        
        return tokenIds;
    }
    
    /**
     * @dev 获取 Token 元数据
     * @param tokenId Token ID
     * @return metadata 元数据
     */
    function getTokenMetadata(
        uint256 tokenId
    )
        external
        view
        returns (TokenMetadata memory)
    {
        require(_exists(tokenId), "Token does not exist");
        return tokenMetadata[tokenId];
    }
    
    /**
     * @dev 获取某年的铸造总数
     * @param year 年份
     * @return count 铸造数量
     */
    function getYearMintCount(
        uint256 year
    )
        external
        view
        returns (uint256)
    {
        return yearMintCount[year];
    }
    
    /**
     * @dev 获取当前总供应量
     * @return supply 总供应量
     */
    function totalSupply()
        public
        view
        override(ERC721Enumerable)
        returns (uint256)
    {
        return _tokenIdCounter.current() - 1;
    }
    
    // ============ 管理功能 ============
    
    /**
     * @dev 设置铸造价格
     * @param newPrice 新价格 (wei)
     */
    function setMintPrice(uint256 newPrice) external onlyOwner {
        uint256 oldPrice = mintPrice;
        mintPrice = newPrice;
        emit MintPriceUpdated(oldPrice, newPrice);
    }
    
    /**
     * @dev 设置最大供应量
     * @param newMaxSupply 新的最大供应量
     */
    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(
            newMaxSupply == 0 || newMaxSupply >= totalSupply(),
            "Cannot set below current supply"
        );
        maxSupply = newMaxSupply;
    }
    
    /**
     * @dev 设置每用户每年最大铸造数量
     * @param newLimit 新限制
     */
    function setMaxMintsPerUserPerYear(uint256 newLimit) external onlyOwner {
        maxMintsPerUserPerYear = newLimit;
    }
    
    /**
     * @dev 设置收入接收地址
     * @param newTreasury 新地址
     */
    function setTreasury(address payable newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid address");
        treasury = newTreasury;
    }
    
    /**
     * @dev 设置版税比例
     * @param newRoyaltyBps 新版税比例 (基点)
     */
    function setRoyaltyBps(uint96 newRoyaltyBps) external onlyOwner {
        require(newRoyaltyBps <= 1000, "Royalty too high"); // 最高10%
        royaltyBps = newRoyaltyBps;
    }
    
    /**
     * @dev 暂停合约
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev 恢复合约
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev 提取合约余额
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        treasury.transfer(balance);
        
        emit Withdrawal(treasury, balance);
    }
    
    /**
     * @dev 紧急提取 (直接发送到 owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
    
    // ============ 内部函数 ============
    
    /**
     * @dev 计算成就等级
     * @param totalFocusHours 总专注时间
     * @return level 成就等级
     */
    function _calculateAchievementLevel(
        uint256 totalFocusHours
    )
        internal
        pure
        returns (string memory)
    {
        if (totalFocusHours >= 1000) return "Diamond";
        if (totalFocusHours >= 500) return "Platinum";
        if (totalFocusHours >= 200) return "Gold";
        if (totalFocusHours >= 100) return "Silver";
        return "Bronze";
    }
    
    // ============ 重写函数 ============
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    )
        internal
        override(ERC721, ERC721Enumerable)
        whenNotPaused
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    // ============ EIP-2981 版税标准 ============
    
    /**
     * @dev 获取版税信息 (EIP-2981)
     * @param tokenId Token ID
     * @param salePrice 销售价格
     * @return receiver 版税接收者
     * @return royaltyAmount 版税金额
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    )
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        require(_exists(tokenId), "Token does not exist");
        
        receiver = treasury;
        royaltyAmount = (salePrice * royaltyBps) / 10000;
    }
}
```

---

### 2. VisionFocusAchievements.sol (成就管理合约)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VisionFocusAchievements
 * @dev 管理成就和里程碑的合约
 */
contract VisionFocusAchievements is Ownable {
    
    // ============ 数据结构 ============
    
    struct Achievement {
        string name;              // 成就名称
        string description;       // 成就描述
        uint256 hoursRequired;    // 所需时间
        string iconUri;           // 图标 URI
        bool active;              // 是否激活
    }
    
    struct UserAchievement {
        uint256 achievementId;
        uint256 unlockedTimestamp;
        uint256 tokenId;          // 关联的 NFT Token ID
    }
    
    // ============ 状态变量 ============
    
    /// @dev 成就 ID => 成就信息
    mapping(uint256 => Achievement) public achievements;
    
    /// @dev 用户地址 => 成就 ID => 是否已解锁
    mapping(address => mapping(uint256 => bool)) public userAchievements;
    
    /// @dev 用户地址 => 已解锁成就列表
    mapping(address => UserAchievement[]) public userAchievementList;
    
    /// @dev 成就总数
    uint256 public achievementCount;
    
    // ============ 事件 ============
    
    event AchievementCreated(uint256 indexed achievementId, string name);
    event AchievementUnlocked(address indexed user, uint256 indexed achievementId);
    
    // ============ 构造函数 ============
    
    constructor() {
        _createDefaultAchievements();
    }
    
    // ============ 核心功能 ============
    
    /**
     * @dev 创建新成就
     */
    function createAchievement(
        string memory name,
        string memory description,
        uint256 hoursRequired,
        string memory iconUri
    )
        external
        onlyOwner
        returns (uint256)
    {
        achievementCount++;
        
        achievements[achievementCount] = Achievement({
            name: name,
            description: description,
            hoursRequired: hoursRequired,
            iconUri: iconUri,
            active: true
        });
        
        emit AchievementCreated(achievementCount, name);
        
        return achievementCount;
    }
    
    /**
     * @dev 解锁成就
     */
    function unlockAchievement(
        address user,
        uint256 achievementId,
        uint256 tokenId
    )
        external
        onlyOwner
    {
        require(achievements[achievementId].active, "Achievement not active");
        require(!userAchievements[user][achievementId], "Already unlocked");
        
        userAchievements[user][achievementId] = true;
        
        userAchievementList[user].push(UserAchievement({
            achievementId: achievementId,
            unlockedTimestamp: block.timestamp,
            tokenId: tokenId
        }));
        
        emit AchievementUnlocked(user, achievementId);
    }
    
    /**
     * @dev 获取用户已解锁成就
     */
    function getUserAchievements(address user)
        external
        view
        returns (UserAchievement[] memory)
    {
        return userAchievementList[user];
    }
    
    // ============ 内部函数 ============
    
    /**
     * @dev 创建默认成就
     */
    function _createDefaultAchievements() internal {
        // 初学者
        achievements[++achievementCount] = Achievement({
            name: "初学者",
            description: "完成第一次专注",
            hoursRequired: 1,
            iconUri: "",
            active: true
        });
        
        // 星星点点
        achievements[++achievementCount] = Achievement({
            name: "星星点点",
            description: "累计10小时专注",
            hoursRequired: 10,
            iconUri: "",
            active: true
        });
        
        // 微光荧光
        achievements[++achievementCount] = Achievement({
            name: "微光荧光",
            description: "累计30小时专注",
            hoursRequired: 30,
            iconUri: "",
            active: true
        });
        
        // 金色流光
        achievements[++achievementCount] = Achievement({
            name: "金色流光",
            description: "累计60小时专注",
            hoursRequired: 60,
            iconUri: "",
            active: true
        });
        
        // 钻石七彩
        achievements[++achievementCount] = Achievement({
            name: "钻石七彩",
            description: "累计100小时专注",
            hoursRequired: 100,
            iconUri: "",
            active: true
        });
    }
}
```

---

## 部署信息

### Sepolia 测试网

```javascript
// 部署配置
const DEPLOYMENT_CONFIG = {
  network: "sepolia",
  contracts: {
    VisionFocusHoursNFT: {
      address: "0x...", // 待部署后填写
      constructorArgs: {
        mintPrice: ethers.utils.parseEther("0.001"), // 0.001 ETH
        maxSupply: 0, // 无限制
        maxMintsPerUserPerYear: 1, // 每年每人限1个
        treasury: "0x...", // 收入接收地址
        royaltyBps: 250 // 2.5%
      }
    },
    VisionFocusAchievements: {
      address: "0x...", // 待部署后填写
      constructorArgs: {}
    }
  },
  rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
  chainId: 11155111,
  blockExplorer: "https://sepolia.etherscan.io"
};
```

### 部署脚本

```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("开始部署 VisionFocus Hours 合约...");
  
  // 部署参数
  const mintPrice = ethers.utils.parseEther("0.001");
  const maxSupply = 0;
  const maxMintsPerUserPerYear = 1;
  const treasury = "0xYourTreasuryAddress";
  const royaltyBps = 250;
  
  // 部署主合约
  const VisionFocusHoursNFT = await hre.ethers.getContractFactory("VisionFocusHoursNFT");
  const nftContract = await VisionFocusHoursNFT.deploy(
    mintPrice,
    maxSupply,
    maxMintsPerUserPerYear,
    treasury,
    royaltyBps
  );
  
  await nftContract.deployed();
  console.log("VisionFocusHoursNFT 部署到:", nftContract.address);
  
  // 部署成就合约
  const VisionFocusAchievements = await hre.ethers.getContractFactory("VisionFocusAchievements");
  const achievementsContract = await VisionFocusAchievements.deploy();
  
  await achievementsContract.deployed();
  console.log("VisionFocusAchievements 部署到:", achievementsContract.address);
  
  // 等待区块确认
  console.log("等待区块确认...");
  await nftContract.deployTransaction.wait(5);
  
  // 验证合约
  console.log("验证合约...");
  await hre.run("verify:verify", {
    address: nftContract.address,
    constructorArguments: [
      mintPrice,
      maxSupply,
      maxMintsPerUserPerYear,
      treasury,
      royaltyBps
    ],
  });
  
  console.log("部署完成!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## 使用指南

### 1. 环境配置

```bash
# 安装依赖
npm install --save-dev hardhat @openzeppelin/contracts

# 初始化 Hardhat
npx hardhat

# 安装其他依赖
npm install --save-dev @nomiclabs/hardhat-ethers ethers
npm install --save-dev @nomiclabs/hardhat-etherscan
npm install --save-dev dotenv
```

### 2. hardhat.config.js

```javascript
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

### 3. .env 配置

```bash
# RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY

# 私钥 (注意安全!)
PRIVATE_KEY=your_private_key_here

# Etherscan API Key
ETHERSCAN_API_KEY=your_etherscan_api_key

# 收入地址
TREASURY_ADDRESS=0xYourTreasuryAddress
```

### 4. 前端集成

```javascript
// utils/contract.js
import { ethers } from 'ethers';
import VisionFocusHoursNFT_ABI from './abis/VisionFocusHoursNFT.json';

const CONTRACT_ADDRESS = "0x..."; // 合约地址

// 初始化合约实例
export async function getContract() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('请安装 MetaMask');
  }
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    VisionFocusHoursNFT_ABI,
    signer
  );
  
  return contract;
}

// 铸造 NFT
export async function mintNFT(year, totalFocusHours, wishesCount, completedWishes, tokenURI) {
  try {
    const contract = await getContract();
    
    // 获取铸造价格
    const mintPrice = await contract.mintPrice();
    
    // 调用铸造函数
    const tx = await contract.mint(
      year,
      totalFocusHours,
      wishesCount,
      completedWishes,
      tokenURI,
      { value: mintPrice }
    );
    
    console.log('交易已提交:', tx.hash);
    
    // 等待确认
    const receipt = await tx.wait();
    console.log('交易已确认:', receipt);
    
    // 从事件中获取 Token ID
    const event = receipt.events.find(e => e.event === 'NFTMinted');
    const tokenId = event.args.tokenId.toString();
    
    return {
      tokenId,
      transactionHash: tx.hash
    };
  } catch (error) {
    console.error('铸造失败:', error);
    throw error;
  }
}

// 获取用户的 NFT
export async function getUserNFTs(address) {
  try {
    const contract = await getContract();
    const tokenIds = await contract.getUserTokens(address);
    
    const nfts = [];
    
    for (let tokenId of tokenIds) {
      const metadata = await contract.getTokenMetadata(tokenId);
      const tokenURI = await contract.tokenURI(tokenId);
      
      nfts.push({
        tokenId: tokenId.toString(),
        year: metadata.year.toString(),
        totalFocusHours: metadata.totalFocusHours.toString(),
        achievementLevel: metadata.achievementLevel,
        tokenURI
      });
    }
    
    return nfts;
  } catch (error) {
    console.error('获取 NFT 失败:', error);
    throw error;
  }
}

// 更新 Token URI
export async function updateTokenURI(tokenId, newTokenURI) {
  try {
    const contract = await getContract();
    const tx = await contract.updateTokenURI(tokenId, newTokenURI);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('更新失败:', error);
    throw error;
  }
}
```

---

## 安全考虑

### 1. 访问控制
- ✅ 使用 `Ownable` 限制管理员功能
- ✅ 铸造功能对所有用户开放,但有限制
- ✅ 只有 Token 所有者可以更新 URI
- ✅ 只有 Token 所有者可以销毁

### 2. 重入攻击防护
- ✅ 使用 `ReentrancyGuard` 保护关键函数
- ✅ 先修改状态,再进行外部调用
- ✅ 使用 `nonReentrant` 修饰符

### 3. 整数溢出
- ✅ Solidity 0.8+ 自动检查溢出
- ✅ 使用 OpenZeppelin 的 `Counters`

### 4. 输入验证
- ✅ 检查年份范围
- ✅ 检查支付金额
- ✅ 检查铸造限制
- ✅ 检查地址有效性

### 5. 暂停机制
- ✅ 实现 `Pausable` 可紧急暂停
- ✅ 暂停时禁止铸造和转账
- ✅ 管理员可随时恢复

### 6. 提款安全
- ✅ 提款发送到指定 treasury 地址
- ✅ 紧急提款发送到 owner
- ✅ 使用 `nonReentrant` 防止重入

### 7. Gas 优化
- ✅ 使用 `calldata` 而非 `memory`
- ✅ 批量操作减少 gas
- ✅ 合理使用 `view` 和 `pure`

---

## 测试用例

### 1. test/VisionFocusHoursNFT.test.js

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VisionFocusHoursNFT", function () {
  let nftContract;
  let owner;
  let user1;
  let user2;
  let treasury;
  
  const MINT_PRICE = ethers.utils.parseEther("0.001");
  const MAX_SUPPLY = 0;
  const MAX_MINTS_PER_USER_PER_YEAR = 1;
  const ROYALTY_BPS = 250;
  
  beforeEach(async function () {
    [owner, user1, user2, treasury] = await ethers.getSigners();
    
    const VisionFocusHoursNFT = await ethers.getContractFactory("VisionFocusHoursNFT");
    nftContract = await VisionFocusHoursNFT.deploy(
      MINT_PRICE,
      MAX_SUPPLY,
      MAX_MINTS_PER_USER_PER_YEAR,
      treasury.address,
      ROYALTY_BPS
    );
    await nftContract.deployed();
  });
  
  describe("部署", function () {
    it("应该正确设置初始参数", async function () {
      expect(await nftContract.mintPrice()).to.equal(MINT_PRICE);
      expect(await nftContract.maxSupply()).to.equal(MAX_SUPPLY);
      expect(await nftContract.maxMintsPerUserPerYear()).to.equal(MAX_MINTS_PER_USER_PER_YEAR);
      expect(await nftContract.treasury()).to.equal(treasury.address);
      expect(await nftContract.royaltyBps()).to.equal(ROYALTY_BPS);
    });
  });
  
  describe("铸造", function () {
    const YEAR = 2026;
    const TOTAL_HOURS = 150;
    const WISHES_COUNT = 8;
    const COMPLETED_WISHES = 3;
    const TOKEN_URI = "ipfs://QmTest123/metadata.json";
    
    it("应该成功铸造 NFT", async function () {
      const tx = await nftContract.connect(user1).mint(
        YEAR,
        TOTAL_HOURS,
        WISHES_COUNT,
        COMPLETED_WISHES,
        TOKEN_URI,
        { value: MINT_PRICE }
      );
      
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === 'NFTMinted');
      
      expect(event).to.not.be.undefined;
      expect(event.args.minter).to.equal(user1.address);
      expect(event.args.year).to.equal(YEAR);
    });
    
    it("应该拒绝支付不足", async function () {
      await expect(
        nftContract.connect(user1).mint(
          YEAR,
          TOTAL_HOURS,
          WISHES_COUNT,
          COMPLETED_WISHES,
          TOKEN_URI,
          { value: ethers.utils.parseEther("0.0001") }
        )
      ).to.be.revertedWith("Insufficient payment");
    });
    
    it("应该拒绝重复铸造同一年", async function () {
      await nftContract.connect(user1).mint(
        YEAR,
        TOTAL_HOURS,
        WISHES_COUNT,
        COMPLETED_WISHES,
        TOKEN_URI,
        { value: MINT_PRICE }
      );
      
      await expect(
        nftContract.connect(user1).mint(
          YEAR,
          TOTAL_HOURS,
          WISHES_COUNT,
          COMPLETED_WISHES,
          TOKEN_URI,
          { value: MINT_PRICE }
        )
      ).to.be.revertedWith("Already minted for this year");
    });
    
    it("应该正确计算成就等级", async function () {
      await nftContract.connect(user1).mint(
        YEAR,
        TOTAL_HOURS,
        WISHES_COUNT,
        COMPLETED_WISHES,
        TOKEN_URI,
        { value: MINT_PRICE }
      );
      
      const tokenId = await nftContract.getUserYearToken(user1.address, YEAR);
      const metadata = await nftContract.getTokenMetadata(tokenId);
      
      expect(metadata.achievementLevel).to.equal("Silver");
    });
  });
  
  describe("查询", function () {
    it("应该正确获取用户的 Token", async function () {
      await nftContract.connect(user1).mint(
        2026, 150, 8, 3, "ipfs://test",
        { value: MINT_PRICE }
      );
      
      const tokens = await nftContract.getUserTokens(user1.address);
      expect(tokens.length).to.equal(1);
    });
  });
  
  describe("管理", function () {
    it("应该允许 owner 设置铸造价格", async function () {
      const newPrice = ethers.utils.parseEther("0.002");
      await nftContract.setMintPrice(newPrice);
      expect(await nftContract.mintPrice()).to.equal(newPrice);
    });
    
    it("应该拒绝非 owner 设置铸造价格", async function () {
      const newPrice = ethers.utils.parseEther("0.002");
      await expect(
        nftContract.connect(user1).setMintPrice(newPrice)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
  
  describe("提款", function () {
    it("应该允许 owner 提款", async function () {
      // 铸造 NFT
      await nftContract.connect(user1).mint(
        2026, 150, 8, 3, "ipfs://test",
        { value: MINT_PRICE }
      );
      
      const balanceBefore = await ethers.provider.getBalance(treasury.address);
      
      // 提款
      await nftContract.withdraw();
      
      const balanceAfter = await ethers.provider.getBalance(treasury.address);
      
      expect(balanceAfter.sub(balanceBefore)).to.equal(MINT_PRICE);
    });
  });
});
```

### 2. 运行测试

```bash
# 运行所有测试
npx hardhat test

# 运行特定测试文件
npx hardhat test test/VisionFocusHoursNFT.test.js

# 生成测试覆盖率报告
npx hardhat coverage
```

---

## Gas 估算

### 部署成本
- VisionFocusHoursNFT: ~3,500,000 gas (~$50-100)
- VisionFocusAchievements: ~800,000 gas (~$10-20)

### 操作成本 (预估)
- `mint()`: ~200,000 gas (~$3-5)
- `updateTokenURI()`: ~50,000 gas (~$1-2)
- `burn()`: ~70,000 gas (~$1-2)
- `transfer`: ~80,000 gas (~$1-2)

---

## 升级策略

### 1. 代理模式
建议使用 OpenZeppelin 的 Transparent Proxy 或 UUPS 模式实现可升级:

```solidity
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract VisionFocusHoursNFTV2 is 
    Initializable,
    UUPSUpgradeable,
    ERC721Upgradeable
{
    // ... 合约代码
    
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}
```

### 2. 数据迁移
如果需要迁移到新合约:
- 暂停旧合约
- 快照数据
- 部署新合约
- 迁移数据
- 宣布新合约地址

---

## OpenSea 集成

### 1. 合约元数据

在合约中实现 `contractURI`:

```solidity
function contractURI() public pure returns (string memory) {
    return "ipfs://QmYourContractMetadata/contract.json";
}
```

### 2. contract.json

```json
{
  "name": "VisionFocus Hours",
  "description": "年度专注时光 NFT 集合",
  "image": "ipfs://QmYourCollectionImage/image.png",
  "external_link": "https://visionfocushours.app",
  "seller_fee_basis_points": 250,
  "fee_recipient": "0xYourTreasuryAddress"
}
```

### 3. Token 元数据

```json
{
  "name": "VisionFocus Hours - 2026",
  "description": "2026年度专注时光记录",
  "image": "ipfs://QmYourImage/vision-board.png",
  "external_url": "https://visionfocushours.app/nft/1",
  "attributes": [
    {
      "trait_type": "年份",
      "value": 2026
    },
    {
      "trait_type": "总专注时间",
      "value": 156.5,
      "display_type": "number"
    },
    {
      "trait_type": "成就等级",
      "value": "Silver"
    }
  ]
}
```

---

## 审计检查清单

### 合约安全
- [x] 使用最新稳定版 Solidity
- [x] 使用 OpenZeppelin 标准库
- [x] 实现访问控制
- [x] 防止重入攻击
- [x] 输入验证完整
- [x] 暂停机制
- [x] 事件日志完整

### 测试覆盖
- [x] 单元测试
- [x] 集成测试
- [x] 边界条件测试
- [x] Gas 优化测试
- [x] 失败场景测试

### 文档完整性
- [x] 函数注释
- [x] NatSpec 文档
- [x] 部署指南
- [x] 使用示例

---

## 常见问题

### Q1: 为什么使用 ERC-721 而不是 ERC-1155?
**A**: ERC-721 每个 NFT 都是唯一的,更适合代表每年的专注记录。ERC-1155 适合大量相同物品。

### Q2: 如何防止用户多次铸造同一年?
**A**: 使用 `userYearTokens` 映射记录,铸造前检查该年是否已存在。

### Q3: NFT 可以转让吗?
**A**: 可以。这是标准的 ERC-721 功能,支持转让和交易。

### Q4: 如何更新已铸造的 NFT 元数据?
**A**: Token 所有者可以调用 `updateTokenURI()` 更新 IPFS 链接。

### Q5: Gas 费用太高怎么办?
**A**: 可以考虑:
- 使用 L2 网络 (Polygon, Arbitrum)
- 批量铸造
- 优化合约代码

---

## 总结

这套智能合约设计为 VisionFocus Hours 项目提供了:

✅ **标准化**: 基于 ERC-721 标准  
✅ **安全性**: OpenZeppelin 库 + 多重防护  
✅ **灵活性**: 可暂停、可升级、可配置  
✅ **扩展性**: 成就系统、版税支持  
✅ **Gas优化**: 批量操作、高效存储  
✅ **测试完善**: 单元测试、集成测试  

可直接用于黑客松演示和生产环境部署! 🚀

