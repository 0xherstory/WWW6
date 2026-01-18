import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { CeresBettingContract, CONTRACT_ADDRESS } from '@/contracts/CeresBetting';

interface ContractState {
  charityPool: string;
  totalVolume: string;
  userBetCount: number;
  isLoading: boolean;
}

export const useContract = () => {
  const { signer, account, isCorrectNetwork } = useWeb3();
  const [contract, setContract] = useState<CeresBettingContract | null>(null);
  const [state, setState] = useState<ContractState>({
    charityPool: '0',
    totalVolume: '0',
    userBetCount: 0,
    isLoading: false,
  });

  // Check if contract is deployed (address is not zero)
  const isContractDeployed = !CONTRACT_ADDRESS.startsWith('0x000000000000000000000000000000000000');

  // Initialize contract when signer is available
  useEffect(() => {
    if (signer && isCorrectNetwork && isContractDeployed) {
      const ceresBetting = new CeresBettingContract(signer);
      setContract(ceresBetting);
    } else {
      setContract(null);
    }
  }, [signer, isCorrectNetwork, isContractDeployed]);

  // Fetch contract data
  const fetchContractData = useCallback(async () => {
    if (!contract || !account) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const [charityPool, totalVolume, userBetCount] = await Promise.all([
        contract.getCharityPool(),
        contract.getTotalVolume(),
        contract.getUserBetCount(account),
      ]);

      setState({
        charityPool,
        totalVolume,
        userBetCount,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch contract data:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [contract, account]);

  // Fetch data when contract or account changes
  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  // Place bet function
  const placeBet = async (
    province: string,
    weatherType: string,
    stance: boolean,
    amountInEth: string
  ) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    const result = await contract.placeBet(province, weatherType, stance, amountInEth);
    
    // Refresh data after bet
    await fetchContractData();
    
    return result;
  };

  return {
    contract,
    isContractDeployed,
    charityPool: state.charityPool,
    totalVolume: state.totalVolume,
    userBetCount: state.userBetCount,
    isLoading: state.isLoading,
    placeBet,
    refreshData: fetchContractData,
  };
};
