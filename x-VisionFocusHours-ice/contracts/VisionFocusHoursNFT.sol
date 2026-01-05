// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
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
    ReentrancyGuard,
    IERC2981
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
    ) ERC721("VisionFocus Hours", "VFHOURS") Ownable(msg.sender) {
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
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
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
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
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
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
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
     * @return totalSupply 总供应量
     */
    function totalSupply() public view override returns (uint256) {
        return _tokenIdCounter.current() - 1;
    }
    
    // ============ 管理员功能 ============
    
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
        maxSupply = newMaxSupply;
    }
    
    /**
     * @dev 设置每用户每年最大铸造数量
     * @param newMaxMints 新的最大铸造数量
     */
    function setMaxMintsPerUserPerYear(uint256 newMaxMints) external onlyOwner {
        maxMintsPerUserPerYear = newMaxMints;
    }
    
    /**
     * @dev 设置收入接收地址
     * @param newTreasury 新的收入接收地址
     */
    function setTreasury(address payable newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid address");
        treasury = newTreasury;
    }
    
    /**
     * @dev 设置版税比例
     * @param newRoyaltyBps 新的版税比例 (基点)
     */
    function setRoyaltyBps(uint96 newRoyaltyBps) external onlyOwner {
        require(newRoyaltyBps <= 1000, "Royalty too high"); // 最大10%
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
     * @dev 提款
     * @param amount 提款金额 (0 = 全部)
     */
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        uint256 withdrawAmount = amount == 0 ? balance : amount;
        
        require(withdrawAmount > 0, "No funds to withdraw");
        require(withdrawAmount <= balance, "Insufficient balance");
        
        (bool success, ) = treasury.call{value: withdrawAmount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawal(treasury, withdrawAmount);
    }
    
    // ============ 内部函数 ============
    
    /**
     * @dev 计算成就等级
     * @param totalHours 总专注时间
     * @return level 成就等级字符串
     */
    function _calculateAchievementLevel(
        uint256 totalHours
    )
        internal
        pure
        returns (string memory)
    {
        if (totalHours >= 100) {
            return "Diamond";
        } else if (totalHours >= 60) {
            return "Platinum";
        } else if (totalHours >= 30) {
            return "Gold";
        } else if (totalHours >= 10) {
            return "Silver";
        } else {
            return "Bronze";
        }
    }
    
    // ============ ERC2981 版税支持 ============
    
    /**
     * @dev 实现 ERC2981 版税接口
     * @param tokenId Token ID
     * @param salePrice 销售价格
     * @return receiver 版税接收地址
     * @return royaltyAmount 版税金额
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    )
        external
        view
        override
        returns (address, uint256)
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        uint256 royaltyAmount = (salePrice * royaltyBps) / 10000;
        return (treasury, royaltyAmount);
    }
    
    // ============ 重写函数 ============
    
    /**
     * @dev 重写 _update 以支持 Enumerable
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @dev 重写 _increaseBalance 以支持 Enumerable
     */
    function _increaseBalance(
        address account,
        uint128 value
    )
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }
    
    /**
     * @dev 重写 tokenURI 以支持 URIStorage
     */
    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev 重写 supportsInterface 以支持所有接口
     */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable, IERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

