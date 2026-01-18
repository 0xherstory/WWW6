// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title StoryChapterNFT
 * @dev 分叉叙事宇宙 - 章节NFT合约
 *
 * 功能：
 * 1. 章节铸造为NFT（访问凭证）
 * 2. 加密内容存储与访问控制
 * 3. 版权保护（内容哈希上链）
 * 4. 创作者版税（二次销售分成）
 * 5. 时间锁定机制（早鸟优惠）
 */
contract StoryChapterNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // ============ 状态变量 ============

    Counters.Counter private _tokenIdCounter;

    // 章节信息结构体
    struct Chapter {
        uint256 storyId;              // 所属故事ID
        string title;                 // 章节标题
        bytes32 contentHash;          // 原始内容哈希（版权证明）
        string encryptedContentIPFS;  // 加密内容的IPFS哈希
        address creator;              // 创作者地址
        uint256 price;                // NFT价格
        uint256 createdAt;            // 创建时间
        uint256 unlockTime;           // 免费解锁时间（0表示永不免费）
        uint256 totalSales;           // 总销售数量
        uint256 royaltyPercent;       // 版税百分比（basis points, 1000 = 10%）
        bool isCanon;                 // 是否为正史
    }

    // Token ID -> 章节信息
    mapping(uint256 => Chapter) public chapters;

    // Token ID -> 加密的解密密钥
    mapping(uint256 => bytes) private encryptedKeys;

    // 故事ID -> 章节ID列表
    mapping(uint256 => uint256[]) public storyChapters;

    // 创作者地址 -> 创作的章节列表
    mapping(address => uint256[]) public creatorChapters;

    // 用户地址 -> Token ID -> 是否已打赏
    mapping(address => mapping(uint256 => bool)) public hasTipped;

    // Token ID -> 打赏总额
    mapping(uint256 => uint256) public totalTips;

    // 平台手续费百分比（basis points, 250 = 2.5%）
    uint256 public platformFeePercent = 250;

    // 平台钱包地址
    address public platformWallet;

    // ============ 事件 ============

    event ChapterPublished(
        uint256 indexed tokenId,
        uint256 indexed storyId,
        address indexed creator,
        string title,
        bytes32 contentHash
    );

    event ChapterPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );

    event ChapterTipped(
        uint256 indexed tokenId,
        address indexed tipper,
        uint256 amount
    );

    event ChapterUnlocked(
        uint256 indexed tokenId,
        uint256 unlockTime
    );

    event RoyaltyPaid(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 amount
    );

    // ============ 构造函数 ============

    constructor(address _platformWallet)
        ERC721("Story Chapter NFT", "CHAPTER")
        Ownable(msg.sender)
    {
        require(_platformWallet != address(0), "Invalid platform wallet");
        platformWallet = _platformWallet;
    }

    // ============ 核心功能 ============

    /**
     * @dev 发布章节（铸造NFT）
     * @param storyId 故事ID
     * @param title 章节标题
     * @param contentHash 原始内容的哈希（版权证明）
     * @param encryptedContentIPFS 加密内容的IPFS地址
     * @param encryptedKey 加密的解密密钥
     * @param price NFT价格（wei）
     * @param unlockTime 免费解锁时间（0表示永不免费）
     * @param royaltyPercent 版税百分比（1000 = 10%）
     * @param tokenURI NFT元数据URI
     */
    function publishChapter(
        uint256 storyId,
        string memory title,
        bytes32 contentHash,
        string memory encryptedContentIPFS,
        bytes memory encryptedKey,
        uint256 price,
        uint256 unlockTime,
        uint256 royaltyPercent,
        string memory tokenURI
    ) public returns (uint256) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(contentHash != bytes32(0), "Invalid content hash");
        require(royaltyPercent <= 2000, "Royalty too high (max 20%)");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // 铸造NFT给创作者
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // 存储章节信息
        chapters[tokenId] = Chapter({
            storyId: storyId,
            title: title,
            contentHash: contentHash,
            encryptedContentIPFS: encryptedContentIPFS,
            creator: msg.sender,
            price: price,
            createdAt: block.timestamp,
            unlockTime: unlockTime,
            totalSales: 0,
            royaltyPercent: royaltyPercent,
            isCanon: false
        });

        // 存储加密密钥
        encryptedKeys[tokenId] = encryptedKey;

        // 添加到索引
        storyChapters[storyId].push(tokenId);
        creatorChapters[msg.sender].push(tokenId);

        emit ChapterPublished(tokenId, storyId, msg.sender, title, contentHash);

        return tokenId;
    }

    /**
     * @dev 购买章节NFT
     * @param tokenId 章节Token ID
     */
    function purchaseChapter(uint256 tokenId)
        public
        payable
        nonReentrant
    {
        require(_ownerOf(tokenId) != address(0), "Chapter does not exist");
        Chapter storage chapter = chapters[tokenId];
        require(msg.value >= chapter.price, "Insufficient payment");

        address seller = ownerOf(tokenId);
        require(seller != msg.sender, "Cannot buy your own chapter");

        // 计算费用分配
        uint256 platformFee = (msg.value * platformFeePercent) / 10000;
        uint256 creatorAmount = msg.value - platformFee;

        // 如果是二次销售，支付版税给原创作者
        if (seller != chapter.creator) {
            uint256 royalty = (msg.value * chapter.royaltyPercent) / 10000;
            creatorAmount -= royalty;

            // 支付版税
            (bool royaltySuccess, ) = payable(chapter.creator).call{value: royalty}("");
            require(royaltySuccess, "Royalty payment failed");

            emit RoyaltyPaid(tokenId, chapter.creator, royalty);
        }

        // 转移NFT
        _transfer(seller, msg.sender, tokenId);

        // 支付给卖家
        (bool sellerSuccess, ) = payable(seller).call{value: creatorAmount}("");
        require(sellerSuccess, "Seller payment failed");

        // 支付平台费用
        (bool platformSuccess, ) = payable(platformWallet).call{value: platformFee}("");
        require(platformSuccess, "Platform fee payment failed");

        // 更新统计
        chapter.totalSales++;

        // 退还多余的ETH
        if (msg.value > chapter.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - chapter.price}("");
            require(refundSuccess, "Refund failed");
        }

        emit ChapterPurchased(tokenId, msg.sender, chapter.price);
    }

    /**
     * @dev 获取解密密钥（访问控制）
     * @param tokenId 章节Token ID
     * @return 加密的解密密钥
     */
    function getDecryptionKey(uint256 tokenId)
        public
        view
        returns (bytes memory)
    {
        Chapter memory chapter = chapters[tokenId];

        // 检查访问权限
        bool hasAccess = false;

        // 1. 是创作者
        if (msg.sender == chapter.creator) {
            hasAccess = true;
        }
        // 2. 持有NFT
        else if (ownerOf(tokenId) == msg.sender) {
            hasAccess = true;
        }
        // 3. 已过免费解锁时间
        else if (chapter.unlockTime > 0 && block.timestamp >= chapter.unlockTime) {
            hasAccess = true;
        }

        require(hasAccess, "No access to this chapter");

        return encryptedKeys[tokenId];
    }

    /**
     * @dev 检查用户是否有访问权限
     * @param tokenId 章节Token ID
     * @param user 用户地址
     * @return 是否有访问权限
     */
    function hasAccessToChapter(uint256 tokenId, address user)
        public
        view
        returns (bool)
    {
        Chapter memory chapter = chapters[tokenId];

        // 创作者永远有权限
        if (user == chapter.creator) {
            return true;
        }

        // NFT持有者有权限
        if (ownerOf(tokenId) == user) {
            return true;
        }

        // 已过免费解锁时间
        if (chapter.unlockTime > 0 && block.timestamp >= chapter.unlockTime) {
            return true;
        }

        return false;
    }

    /**
     * @dev 打赏章节
     * @param tokenId 章节Token ID
     */
    function tipChapter(uint256 tokenId)
        public
        payable
        nonReentrant
    {
        require(msg.value > 0, "Tip must be greater than 0");
        require(_ownerOf(tokenId) != address(0), "Chapter does not exist");

        Chapter memory chapter = chapters[tokenId];

        // 计算平台手续费
        uint256 platformFee = (msg.value * platformFeePercent) / 10000;
        uint256 creatorAmount = msg.value - platformFee;

        // 支付给创作者
        (bool creatorSuccess, ) = payable(chapter.creator).call{value: creatorAmount}("");
        require(creatorSuccess, "Creator payment failed");

        // 支付平台费用
        (bool platformSuccess, ) = payable(platformWallet).call{value: platformFee}("");
        require(platformSuccess, "Platform fee payment failed");

        // 记录打赏
        hasTipped[msg.sender][tokenId] = true;
        totalTips[tokenId] += msg.value;

        emit ChapterTipped(tokenId, msg.sender, msg.value);
    }

    /**
     * @dev 设置章节为Canon（正史）
     * @param tokenId 章节Token ID
     */
    function setAsCanon(uint256 tokenId) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Chapter does not exist");
        chapters[tokenId].isCanon = true;
    }

    /**
     * @dev 更新章节价格
     * @param tokenId 章节Token ID
     * @param newPrice 新价格
     */
    function updateChapterPrice(uint256 tokenId, uint256 newPrice) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        chapters[tokenId].price = newPrice;
    }

    // ============ 查询功能 ============

    /**
     * @dev 获取故事的所有章节
     * @param storyId 故事ID
     * @return 章节Token ID数组
     */
    function getStoryChapters(uint256 storyId)
        public
        view
        returns (uint256[] memory)
    {
        return storyChapters[storyId];
    }

    /**
     * @dev 获取创作者的所有章节
     * @param creator 创作者地址
     * @return 章节Token ID数组
     */
    function getCreatorChapters(address creator)
        public
        view
        returns (uint256[] memory)
    {
        return creatorChapters[creator];
    }

    /**
     * @dev 获取章节详细信息
     * @param tokenId 章节Token ID
     * @return 章节信息
     */
    function getChapterInfo(uint256 tokenId)
        public
        view
        returns (Chapter memory)
    {
        return chapters[tokenId];
    }

    /**
     * @dev 批量检查访问权限
     * @param tokenIds 章节Token ID数组
     * @param user 用户地址
     * @return 访问权限数组
     */
    function batchCheckAccess(uint256[] memory tokenIds, address user)
        public
        view
        returns (bool[] memory)
    {
        bool[] memory accessList = new bool[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            accessList[i] = hasAccessToChapter(tokenIds[i], user);
        }
        return accessList;
    }

    // ============ 管理功能 ============

    /**
     * @dev 更新平台手续费
     * @param newFeePercent 新的手续费百分比
     */
    function updatePlatformFee(uint256 newFeePercent) public onlyOwner {
        require(newFeePercent <= 1000, "Fee too high (max 10%)");
        platformFeePercent = newFeePercent;
    }

    /**
     * @dev 更新平台钱包地址
     * @param newWallet 新的钱包地址
     */
    function updatePlatformWallet(address newWallet) public onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        platformWallet = newWallet;
    }

    /**
     * @dev 紧急暂停功能（预留）
     */
    function emergencyWithdraw() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    // ============ 重写必要的函数 ============

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
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }
}
