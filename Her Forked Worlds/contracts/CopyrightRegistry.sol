// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CopyrightRegistry
 * @dev 版权注册合约 - 为内容提供不可篡改的时间戳证明
 *
 * 功能：
 * 1. 内容哈希注册（版权时间戳）
 * 2. 版权查询与验证
 * 3. 版权转让
 * 4. 版权纠纷证明
 */
contract CopyrightRegistry is Ownable {

    // ============ 状态变量 ============

    // 版权记录结构体
    struct Copyright {
        bytes32 contentHash;        // 内容哈希
        address creator;            // 创作者地址
        string title;               // 作品标题
        string ipfsHash;            // IPFS存储地址
        uint256 registeredAt;       // 注册时间
        string licenseType;         // 许可类型（CC0, CC-BY, All Rights Reserved等）
        bool isTransferred;         // 是否已转让
        address currentOwner;       // 当前版权所有者
    }

    // 内容哈希 -> 版权记录
    mapping(bytes32 => Copyright) public copyrights;

    // 创作者地址 -> 版权记录列表
    mapping(address => bytes32[]) public creatorCopyrights;

    // 检查内容哈希是否已注册
    mapping(bytes32 => bool) public isRegistered;

    // ============ 事件 ============

    event CopyrightRegistered(
        bytes32 indexed contentHash,
        address indexed creator,
        string title,
        uint256 timestamp
    );

    event CopyrightTransferred(
        bytes32 indexed contentHash,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );

    event LicenseUpdated(
        bytes32 indexed contentHash,
        string newLicense
    );

    // ============ 构造函数 ============

    constructor() Ownable(msg.sender) {}

    // ============ 核心功能 ============

    /**
     * @dev 注册版权
     * @param contentHash 内容哈希（keccak256）
     * @param title 作品标题
     * @param ipfsHash IPFS存储地址
     * @param licenseType 许可类型
     */
    function registerCopyright(
        bytes32 contentHash,
        string memory title,
        string memory ipfsHash,
        string memory licenseType
    ) public {
        require(contentHash != bytes32(0), "Invalid content hash");
        require(!isRegistered[contentHash], "Copyright already registered");
        require(bytes(title).length > 0, "Title cannot be empty");

        copyrights[contentHash] = Copyright({
            contentHash: contentHash,
            creator: msg.sender,
            title: title,
            ipfsHash: ipfsHash,
            registeredAt: block.timestamp,
            licenseType: licenseType,
            isTransferred: false,
            currentOwner: msg.sender
        });

        creatorCopyrights[msg.sender].push(contentHash);
        isRegistered[contentHash] = true;

        emit CopyrightRegistered(contentHash, msg.sender, title, block.timestamp);
    }

    /**
     * @dev 批量注册版权
     * @param contentHashes 内容哈希数组
     * @param titles 标题数组
     * @param ipfsHashes IPFS地址数组
     * @param licenseTypes 许可类型数组
     */
    function batchRegisterCopyright(
        bytes32[] memory contentHashes,
        string[] memory titles,
        string[] memory ipfsHashes,
        string[] memory licenseTypes
    ) public {
        require(
            contentHashes.length == titles.length &&
            titles.length == ipfsHashes.length &&
            ipfsHashes.length == licenseTypes.length,
            "Array lengths mismatch"
        );

        for (uint256 i = 0; i < contentHashes.length; i++) {
            registerCopyright(
                contentHashes[i],
                titles[i],
                ipfsHashes[i],
                licenseTypes[i]
            );
        }
    }

    /**
     * @dev 转让版权
     * @param contentHash 内容哈希
     * @param newOwner 新的版权所有者
     */
    function transferCopyright(bytes32 contentHash, address newOwner) public {
        require(isRegistered[contentHash], "Copyright not registered");
        Copyright storage copyright = copyrights[contentHash];
        require(copyright.currentOwner == msg.sender, "Not the copyright owner");
        require(newOwner != address(0), "Invalid new owner");

        copyright.currentOwner = newOwner;
        copyright.isTransferred = true;

        emit CopyrightTransferred(contentHash, msg.sender, newOwner, block.timestamp);
    }

    /**
     * @dev 更新许可类型
     * @param contentHash 内容哈希
     * @param newLicense 新的许可类型
     */
    function updateLicense(bytes32 contentHash, string memory newLicense) public {
        require(isRegistered[contentHash], "Copyright not registered");
        Copyright storage copyright = copyrights[contentHash];
        require(copyright.currentOwner == msg.sender, "Not the copyright owner");

        copyright.licenseType = newLicense;

        emit LicenseUpdated(contentHash, newLicense);
    }

    // ============ 查询功能 ============

    /**
     * @dev 验证版权归属
     * @param contentHash 内容哈希
     * @param claimedOwner 声称的所有者
     * @return 是否为真正的版权所有者
     */
    function verifyCopyrightOwnership(bytes32 contentHash, address claimedOwner)
        public
        view
        returns (bool)
    {
        if (!isRegistered[contentHash]) {
            return false;
        }
        return copyrights[contentHash].currentOwner == claimedOwner;
    }

    /**
     * @dev 验证内容是否在特定时间前创作
     * @param contentHash 内容哈希
     * @param timestamp 时间戳
     * @return 是否在该时间前创作
     */
    function verifyCreationTime(bytes32 contentHash, uint256 timestamp)
        public
        view
        returns (bool)
    {
        if (!isRegistered[contentHash]) {
            return false;
        }
        return copyrights[contentHash].registeredAt <= timestamp;
    }

    /**
     * @dev 获取版权详细信息
     * @param contentHash 内容哈希
     * @return 版权记录
     */
    function getCopyright(bytes32 contentHash)
        public
        view
        returns (Copyright memory)
    {
        require(isRegistered[contentHash], "Copyright not registered");
        return copyrights[contentHash];
    }

    /**
     * @dev 获取创作者的所有版权
     * @param creator 创作者地址
     * @return 版权哈希数组
     */
    function getCreatorCopyrights(address creator)
        public
        view
        returns (bytes32[] memory)
    {
        return creatorCopyrights[creator];
    }

    /**
     * @dev 比较两个内容哈希的注册时间
     * @param hash1 第一个内容哈希
     * @param hash2 第二个内容哈希
     * @return -1: hash1更早, 0: 相同, 1: hash2更早
     */
    function compareRegistrationTime(bytes32 hash1, bytes32 hash2)
        public
        view
        returns (int8)
    {
        require(isRegistered[hash1] && isRegistered[hash2], "One or both copyrights not registered");

        uint256 time1 = copyrights[hash1].registeredAt;
        uint256 time2 = copyrights[hash2].registeredAt;

        if (time1 < time2) return -1;
        if (time1 > time2) return 1;
        return 0;
    }

    /**
     * @dev 检查内容是否抄袭（基于注册时间）
     * @param originalHash 原创内容哈希
     * @param suspectedHash 疑似抄袭内容哈希
     * @return 疑似内容是否在原创之后注册
     */
    function checkPlagiarism(bytes32 originalHash, bytes32 suspectedHash)
        public
        view
        returns (bool)
    {
        require(isRegistered[originalHash] && isRegistered[suspectedHash], "One or both copyrights not registered");

        return copyrights[suspectedHash].registeredAt > copyrights[originalHash].registeredAt;
    }

    // ============ 辅助功能 ============

    /**
     * @dev 生成内容哈希（前端可以用这个方法验证）
     * @param content 原始内容
     * @return 内容哈希
     */
    function generateContentHash(string memory content)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(content));
    }
}
