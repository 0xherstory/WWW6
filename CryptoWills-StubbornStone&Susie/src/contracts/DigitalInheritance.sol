// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DigitalInheritance {
    address public owner;
    address public heir;
    uint256 public lastCheckIn;
    uint256 public checkInInterval;
    bool public inherited;

    event CheckedIn(address indexed owner, uint256 timestamp);
    event InheritanceFinalized(address indexed heir, uint256 amount);

    // ✅ 改这里：添加 _owner 参数
    constructor(address _owner, address _heir, uint256 _intervalSeconds) payable {
        owner = _owner;  // ✅ 用传入的地址，不是 msg.sender
        heir = _heir;
        checkInInterval = _intervalSeconds;
        lastCheckIn = block.timestamp;
    }

    // 其他函数保持不变...
    function checkIn() external {
        require(msg.sender == owner, "Not owner");
        require(!inherited, "Already inherited");
        lastCheckIn = block.timestamp;
        emit CheckedIn(owner, lastCheckIn);
    }

    function isDead() public view returns (bool) {
        return block.timestamp > lastCheckIn + checkInInterval;
    }

    function finalizeInheritance() external {
        require(!inherited, "Already inherited");
        require(isDead(), "Owner still alive");
        inherited = true;
        uint256 balance = address(this).balance;
        payable(heir).transfer(balance);
        emit InheritanceFinalized(heir, balance);
    }

    receive() external payable {}

    function withdraw() external {
        require(msg.sender == owner, "Not owner");
        require(!inherited, "Already inherited");
        payable(owner).transfer(address(this).balance);
    }

    function changeHeir(address newHeir) external {
        require(msg.sender == owner, "Not owner");
        heir = newHeir;
    }

    function changeInterval(uint256 newInterval) external {
        require(msg.sender == owner, "Not owner");
        checkInInterval = newInterval;
    }
}
