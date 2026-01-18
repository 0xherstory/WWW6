import { Contract, parseEther, formatEther } from 'ethers';
import type { JsonRpcSigner } from 'ethers';

// ==========================================
// 🚨 重要：部署合約後請更新此地址！
// ==========================================
// 使用 Remix IDE 部署合約到 Sepolia 測試網後，
// 將下方的地址替換為您的合約地址
export const CONTRACT_ADDRESS = '0x4583379bB712C0cd0817690529921d7000ca9390';

// Contract ABI - 與 Solidity 合約匹配 (ethers.js 人類可讀格式)
export const CONTRACT_ABI = [
  // Events
  'event BetPlaced(address indexed bettor, string province, uint8 weatherType, bool stance, uint256 amount, uint256 charityAmount)',
  'event CharityWithdrawal(address indexed recipient, uint256 amount)',
  
  // Read functions
  'function charityPool() view returns (uint256)',
  'function totalBetsVolume() view returns (uint256)',
  'function charityPercentage() view returns (uint256)',
  'function owner() view returns (address)',
  'function getBetCount(address bettor) view returns (uint256)',
  'function getTotalBets() view returns (uint256)',
  'function getUserBets(address bettor) view returns (tuple(address bettor, string province, uint8 weatherType, bool stance, uint256 amount, uint256 timestamp)[])',
  'function allBets(uint256) view returns (address bettor, string province, uint8 weatherType, bool stance, uint256 amount, uint256 timestamp)',
  'function userBets(address, uint256) view returns (address bettor, string province, uint8 weatherType, bool stance, uint256 amount, uint256 timestamp)',
  
  // Write functions
  'function placeBet(string memory province, uint8 weatherType, bool stance) payable',
  'function withdrawCharity(address recipient, uint256 amount)',
  'function setCharityPercentage(uint256 _percentage)',
];

// Weather type enum matching contract
export enum WeatherTypeContract {
  Sunny = 0,
  Rain = 1,
  Drought = 2,
  Flood = 3,
  Typhoon = 4,
}

// Map frontend weather types to contract enum
export const weatherTypeToContract: Record<string, WeatherTypeContract> = {
  sunny: WeatherTypeContract.Sunny,
  rain: WeatherTypeContract.Rain,
  drought: WeatherTypeContract.Drought,
  flood: WeatherTypeContract.Flood,
  typhoon: WeatherTypeContract.Typhoon,
};

export class CeresBettingContract {
  private contract: Contract;
  private signer: JsonRpcSigner;

  constructor(signer: JsonRpcSigner) {
    this.signer = signer;
    this.contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }

  // Get charity pool balance (in ETH)
  async getCharityPool(): Promise<string> {
    try {
      const pool = await this.contract.charityPool();
      return formatEther(pool);
    } catch (error) {
      console.error('Failed to get charity pool:', error);
      return '0';
    }
  }

  // Get total betting volume
  async getTotalVolume(): Promise<string> {
    try {
      const volume = await this.contract.totalBetsVolume();
      return formatEther(volume);
    } catch (error) {
      console.error('Failed to get total volume:', error);
      return '0';
    }
  }

  // Place a bet
  async placeBet(
    province: string,
    weatherType: string,
    stance: boolean,
    amountInEth: string
  ): Promise<{ hash: string; success: boolean }> {
    try {
      const weatherEnum = weatherTypeToContract[weatherType];
      const value = parseEther(amountInEth);

      const tx = await this.contract.placeBet(province, weatherEnum, stance, {
        value,
      });

      const receipt = await tx.wait();
      
      return {
        hash: receipt.hash,
        success: true,
      };
    } catch (error: any) {
      console.error('Failed to place bet:', error);
      throw new Error(error.reason || error.message || 'Transaction failed');
    }
  }

  // Get user's bet count
  async getUserBetCount(address: string): Promise<number> {
    try {
      const count = await this.contract.getBetCount(address);
      return Number(count);
    } catch (error) {
      console.error('Failed to get bet count:', error);
      return 0;
    }
  }
}
