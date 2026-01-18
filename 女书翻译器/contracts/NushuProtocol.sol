// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NushuProtocol {
    // 状态变量
    mapping(address => uint256) private _points;
    uint256 public constant INITIAL_POINTS = 50;
    uint256 public constant POINTS_PER_ETH = 10000;
    uint256 public constant SERVICE_COST = 5;
    
    // 事件定义
    event PointsClaimed(address indexed user, uint256 amount);
    event PointsPurchased(address indexed user, uint256 ethAmount, uint256 pointsAmount);
    event TranslationRequested(address indexed user, uint256 requestId, string imageUrl);
    
    // 内部函数：发放初始积分
    function _giveInitialPoints(address user) internal {
        if (_points[user] == 0) {
            _points[user] = INITIAL_POINTS;
            emit PointsClaimed(user, INITIAL_POINTS);
        }
    }
    
    // 获取用户积分
    function points(address user) external view returns (uint256) {
        return _points[user];
    }
    
    // 新用户领取初始积分（保留函数但修改实现）
    function claimInitialPoints() external {
        require(_points[msg.sender] == 0, "Already claimed initial points");
        _points[msg.sender] = INITIAL_POINTS;
        emit PointsClaimed(msg.sender, INITIAL_POINTS);
    }
    
    // 购买积分 (1 ETH = 10,000 积分)
    function buyPoints() external payable {
        require(msg.value > 0, "Must send ETH to buy points");
        // 确保用户有初始积分
        if (_points[msg.sender] == 0) {
            _points[msg.sender] = INITIAL_POINTS;
            emit PointsClaimed(msg.sender, INITIAL_POINTS);
        }
        uint256 pointsToAdd = msg.value * POINTS_PER_ETH / 1 ether;
        _points[msg.sender] += pointsToAdd;
        emit PointsPurchased(msg.sender, msg.value, pointsToAdd);
    }
    
    // 使用服务 (扣除5积分并触发翻译请求事件)
    function useService(uint256 requestId, string calldata imageUrl) external {
        // 确保用户有初始积分
        if (_points[msg.sender] == 0) {
            _points[msg.sender] = INITIAL_POINTS;
            emit PointsClaimed(msg.sender, INITIAL_POINTS);
        }
        require(_points[msg.sender] >= SERVICE_COST, "Insufficient points");
        _points[msg.sender] -= SERVICE_COST;
        emit TranslationRequested(msg.sender, requestId, imageUrl);
    }
    
    // 获取用户积分
    function getUserPoints(address user) external view returns (uint256) {
        return _points[user];
    }
}
