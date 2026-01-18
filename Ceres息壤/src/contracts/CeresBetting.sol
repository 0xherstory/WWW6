// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/* ---------- 仅保留必要依赖（移除 ERC20 相关） ---------- */
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CeresBetting
 * @dev 天氣博弈合約 - 仅支持 ETH（Sepolia/主网）交互
 */
contract CeresBetting is ReentrancyGuard {
    address public owner;
    uint256 public charityPool;
    uint256 public totalBetsVolume;
    uint256 public charityPercentage = 1; // 1% 公益比例

    enum WeatherType { Sunny, Rain, Drought, Flood, Typhoon }

    struct Bet {
        address bettor;
        string province;
        WeatherType weatherType;
        bool stance; // true = YES會發生, false = NO不會發生
        uint256 amount; // 實際投注金額（已扣慈善）
        uint256 timestamp;
    }

    mapping(address => Bet[]) public userBets;
    Bet[] public allBets;

    event BetPlaced(
        address indexed bettor,
        string province,
        uint8 weatherType,
        bool stance,
        uint256 amount,
        uint256 charityAmount
    );
    event CharityWithdrawal(address indexed recipient, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev ETH 下注函数（核心，支持 Sepolia ETH/主网 ETH）
     */
    function placeBet(
        string memory province,
        uint8 weatherType,
        bool stance
    ) external payable {
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(weatherType <= 4, "Invalid weather type");

        // 计算公益金（1%）
        uint256 charityAmount = (msg.value * charityPercentage) / 100;
        uint256 betAmount = msg.value - charityAmount;

        // 更新公益池和总投注额
        charityPool += charityAmount;
        totalBetsVolume += msg.value;

        // 记录下注
        Bet memory newBet = Bet({
            bettor: msg.sender,
            province: province,
            weatherType: WeatherType(weatherType),
            stance: stance,
            amount: betAmount,
            timestamp: block.timestamp
        });

        userBets[msg.sender].push(newBet);
        allBets.push(newBet);

        emit BetPlaced(
            msg.sender,
            province,
            weatherType,
            stance,
            betAmount,
            charityAmount
        );
    }

    /**
     * @dev 提取 ETH 公益金
     */
    function withdrawCharity(address recipient, uint256 amount)
        external
        onlyOwner
        nonReentrant
    {
        require(amount <= charityPool, "Insufficient charity pool");
        charityPool -= amount;
        // 转出 ETH（Sepolia/主网通用）
        (bool success, ) = payable(recipient).call{value: amount}("");
        require(success, "Transfer failed");
        emit CharityWithdrawal(recipient, amount);
    }

    /**
     * @dev 设置公益比例（最大10%）
     */
    function setCharityPercentage(uint256 _percentage) external onlyOwner {
        require(_percentage <= 10, "Max 10%");
        charityPercentage = _percentage;
    }

    // ---------- 只读查询函数 ----------
    function getBetCount(address bettor) external view returns (uint256) {
        return userBets[bettor].length;
    }

    function getUserBets(address bettor) external view returns (Bet[] memory) {
        return userBets[bettor];
    }

    function getTotalBets() external view returns (uint256) {
        return allBets.length;
    }

    /**
     * @dev 直接接收 ETH（计入公益池）
     */
    receive() external payable {
        charityPool += msg.value;
    }
}

/* ============================================================
 *  NFT（CeresPass）：仅保留 ETH 场景下的纪念票根功能
 * ============================================================ */
contract CeresPass is ERC721Enumerable, Ownable {
    uint256 private _tokenIdCounter = 1;
    string  public baseTokenURI;

    constructor(
        string memory name_, 
        string memory symbol_
    ) 
        ERC721(name_, symbol_)       
        Ownable(msg.sender)          
    {}

    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory uri) external onlyOwner {
        baseTokenURI = uri;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

/* ============================================================
 *  V2 主合约：仅保留 ETH + NFT 功能（删除所有 ERC20 逻辑）
 * ============================================================ */
contract CeresBettingV2 is CeresBetting {
    /* ----- NFT ----- */
    CeresPass public immutable pass;

    /* ----- 事件 ----- */
    event NFTMinted(address indexed to, uint256 tokenId);

    /**
     * @dev V2 构造函数（仅初始化 NFT）
     */
    constructor(
        string memory nftName,
        string memory nftSymbol
    ) {
        pass = new CeresPass(nftName, nftSymbol);
    }

    /**
     * @dev NFT 铸造（管理员调用）
     */
    function mintPass(address to) external onlyOwner returns (uint256) {
        uint256 id = pass.mint(to);
        emit NFTMinted(to, id);
        return id;
    }
}
