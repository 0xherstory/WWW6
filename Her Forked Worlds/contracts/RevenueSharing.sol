// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title RevenueSharing
 * @dev 收益分配合约
 *
 * 功能：
 * 1. 奖励池管理
 * 2. 基于贡献度的收益分配
 * 3. 创作者激励
 * 4. 社区治理奖励
 */
contract RevenueSharing is Ownable, ReentrancyGuard {

    // ============ 状态变量 ============

    // 奖励池
    uint256 public rewardPool;

    // 创作者贡献记录
    struct Contribution {
        uint256 readCount;      // 阅读量
        uint256 likeCount;      // 点赞数
        uint256 nftSales;       // NFT销售额
        uint256 tips;           // 打赏总额
        uint256 lastClaimTime;  // 上次领取时间
        uint256 totalEarned;    // 累计收益
    }

    // 创作者地址 -> 贡献记录
    mapping(address => Contribution) public contributions;

    // 章节ID -> 本周期收益
    mapping(uint256 => uint256) public chapterRevenue;

    // 分配周期（默认7天）
    uint256 public distributionPeriod = 7 days;

    // 上次分配时间
    uint256 public lastDistributionTime;

    // 平台Token合约地址
    IERC20 public platformToken;

    // 收益权重配置
    uint256 public readWeight = 30;      // 阅读量权重 30%
    uint256 public likeWeight = 20;      // 点赞权重 20%
    uint256 public salesWeight = 40;     // 销售额权重 40%
    uint256 public tipWeight = 10;       // 打赏权重 10%

    // ============ 事件 ============

    event ContributionRecorded(
        address indexed creator,
        uint256 readCount,
        uint256 likeCount,
        uint256 sales,
        uint256 tips
    );

    event RevenueDistributed(
        address indexed creator,
        uint256 amount,
        uint256 timestamp
    );

    event RewardPoolFunded(
        uint256 amount,
        uint256 timestamp
    );

    // ============ 构造函数 ============

    constructor(address _platformToken) Ownable(msg.sender) {
        platformToken = IERC20(_platformToken);
        lastDistributionTime = block.timestamp;
    }

    // ============ 核心功能 ============

    /**
     * @dev 充值奖励池
     */
    function fundRewardPool() public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        rewardPool += msg.value;
        emit RewardPoolFunded(msg.value, block.timestamp);
    }

    /**
     * @dev 记录创作者贡献
     * @param creator 创作者地址
     * @param readCount 阅读量增加
     * @param likeCount 点赞数增加
     * @param sales NFT销售额增加
     * @param tips 打赏金额增加
     */
    function recordContribution(
        address creator,
        uint256 readCount,
        uint256 likeCount,
        uint256 sales,
        uint256 tips
    ) public onlyOwner {
        Contribution storage contribution = contributions[creator];

        contribution.readCount += readCount;
        contribution.likeCount += likeCount;
        contribution.nftSales += sales;
        contribution.tips += tips;

        emit ContributionRecorded(creator, readCount, likeCount, sales, tips);
    }

    /**
     * @dev 计算创作者的收益份额
     * @param creator 创作者地址
     * @return 收益份额（基于权重计算）
     */
    function calculateShare(address creator) public view returns (uint256) {
        Contribution memory contribution = contributions[creator];

        // 计算加权得分
        uint256 score = (contribution.readCount * readWeight) +
                       (contribution.likeCount * likeWeight) +
                       (contribution.nftSales * salesWeight) +
                       (contribution.tips * tipWeight);

        return score;
    }

    /**
     * @dev 分配收益给所有创作者
     * @param creators 创作者地址数组
     */
    function distributeRevenue(address[] memory creators)
        public
        onlyOwner
        nonReentrant
    {
        require(block.timestamp >= lastDistributionTime + distributionPeriod, "Distribution period not reached");
        require(rewardPool > 0, "Reward pool is empty");

        // 计算总得分
        uint256 totalScore = 0;
        for (uint256 i = 0; i < creators.length; i++) {
            totalScore += calculateShare(creators[i]);
        }

        require(totalScore > 0, "No contributions to distribute");

        // 分配收益
        uint256 distributedAmount = 0;
        for (uint256 i = 0; i < creators.length; i++) {
            address creator = creators[i];
            uint256 share = calculateShare(creator);

            if (share > 0) {
                uint256 amount = (rewardPool * share) / totalScore;

                // 转账
                (bool success, ) = payable(creator).call{value: amount}("");
                require(success, "Transfer failed");

                // 更新记录
                contributions[creator].totalEarned += amount;
                contributions[creator].lastClaimTime = block.timestamp;
                distributedAmount += amount;

                emit RevenueDistributed(creator, amount, block.timestamp);
            }
        }

        // 更新奖励池
        rewardPool -= distributedAmount;
        lastDistributionTime = block.timestamp;
    }

    /**
     * @dev 单个创作者领取收益
     * @param creator 创作者地址
     */
    function claimRevenue(address creator) public nonReentrant {
        require(msg.sender == creator || msg.sender == owner(), "Not authorized");
        require(rewardPool > 0, "Reward pool is empty");

        uint256 share = calculateShare(creator);
        require(share > 0, "No revenue to claim");

        // 计算可领取金额（预留一部分给其他创作者）
        uint256 amount = (rewardPool * share) / (share + 1000); // 简化计算

        // 转账
        (bool success, ) = payable(creator).call{value: amount}("");
        require(success, "Transfer failed");

        // 更新记录
        contributions[creator].totalEarned += amount;
        contributions[creator].lastClaimTime = block.timestamp;
        rewardPool -= amount;

        emit RevenueDistributed(creator, amount, block.timestamp);
    }

    /**
     * @dev 重置创作者贡献（新周期）
     * @param creator 创作者地址
     */
    function resetContribution(address creator) public onlyOwner {
        Contribution storage contribution = contributions[creator];
        contribution.readCount = 0;
        contribution.likeCount = 0;
        contribution.nftSales = 0;
        contribution.tips = 0;
    }

    // ============ 配置功能 ============

    /**
     * @dev 更新权重配置
     * @param _readWeight 阅读量权重
     * @param _likeWeight 点赞权重
     * @param _salesWeight 销售额权重
     * @param _tipWeight 打赏权重
     */
    function updateWeights(
        uint256 _readWeight,
        uint256 _likeWeight,
        uint256 _salesWeight,
        uint256 _tipWeight
    ) public onlyOwner {
        require(_readWeight + _likeWeight + _salesWeight + _tipWeight == 100, "Weights must sum to 100");

        readWeight = _readWeight;
        likeWeight = _likeWeight;
        salesWeight = _salesWeight;
        tipWeight = _tipWeight;
    }

    /**
     * @dev 更新分配周期
     * @param newPeriod 新的周期（秒）
     */
    function updateDistributionPeriod(uint256 newPeriod) public onlyOwner {
        require(newPeriod >= 1 days, "Period too short");
        distributionPeriod = newPeriod;
    }

    // ============ 查询功能 ============

    /**
     * @dev 获取创作者贡献详情
     * @param creator 创作者地址
     * @return 贡献记录
     */
    function getContribution(address creator)
        public
        view
        returns (Contribution memory)
    {
        return contributions[creator];
    }

    /**
     * @dev 预估创作者收益
     * @param creator 创作者地址
     * @return 预估收益
     */
    function estimateRevenue(address creator) public view returns (uint256) {
        if (rewardPool == 0) return 0;

        uint256 share = calculateShare(creator);
        if (share == 0) return 0;

        // 简化估算（假设只有这个创作者）
        return (rewardPool * share) / (share + 1000);
    }

    /**
     * @dev 获取奖励池余额
     * @return 奖励池余额
     */
    function getRewardPoolBalance() public view returns (uint256) {
        return rewardPool;
    }

    // ============ 紧急功能 ============

    /**
     * @dev 紧急提取（仅所有者）
     */
    function emergencyWithdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        rewardPool = 0;
    }

    /**
     * @dev 接收ETH
     */
    receive() external payable {
        rewardPool += msg.value;
        emit RewardPoolFunded(msg.value, block.timestamp);
    }
}
