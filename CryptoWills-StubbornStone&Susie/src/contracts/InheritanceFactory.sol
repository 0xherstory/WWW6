// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DigitalInheritance.sol";

contract InheritanceFactory {
    address[] public allInheritances;

    event InheritanceCreated(address indexed owner, address instance, uint256 value);

    function createInheritance(
        address heir,
        uint256 intervalSeconds
    ) external payable {
        require(msg.value > 0, "Send some ETH as inheritance");
        
        // ✅ 改这里：把 msg.sender（用户地址）传给 DigitalInheritance
        DigitalInheritance di = new DigitalInheritance{value: msg.value}(
            msg.sender,  // ✅ 用户地址作为 owner
            heir,
            intervalSeconds
        );
        
        allInheritances.push(address(di));
        emit InheritanceCreated(msg.sender, address(di), msg.value);
    }

    function getAllInheritances() external view returns (address[] memory) {
        return allInheritances;
    }

    function getInstanceCount() external view returns (uint256) {
        return allInheritances.length;
    }
}
