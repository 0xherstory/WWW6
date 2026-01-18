export const FACTORY_ADDRESS = "0xcBC747c01C918497efc702f1e9c6e337731e343F";

export const FACTORY_ABI = [
  "function createInheritance(address heir, uint256 intervalSeconds) external payable",
  "function getAllInheritances() external view returns (address[])",
  "function getInstanceCount() external view returns (uint256)",
  "event InheritanceCreated(address indexed owner, address instance, uint256 value)"
];

export const INHERITANCE_ABI = [
  "function owner() external view returns (address)",
  "function heir() external view returns (address)",
  "function lastCheckIn() external view returns (uint256)",
  "function checkInInterval() external view returns (uint256)",
  "function inherited() external view returns (bool)",
  "function checkIn() external",
  "function isDead() external view returns (bool)",
  "function finalizeInheritance() external",
  "function withdraw() external",
  "function changeHeir(address newHeir) external",
  "function changeInterval(uint256 newInterval) external",
  "event CheckedIn(address indexed owner, uint256 timestamp)",
  "event InheritanceFinalized(address indexed heir, uint256 amount)"
];
