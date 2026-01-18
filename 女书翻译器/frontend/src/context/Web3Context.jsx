import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NushuProtocolABI from '../contracts/NushuProtocolABI.json';

// 从环境变量获取合约地址
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// 创建上下文
const Web3Context = createContext();

// 提供者组件
export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 连接MetaMask
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 检查是否安装了MetaMask
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this application');
      }
      
      // 请求账户访问权限
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      // 不强制要求特定网络，允许使用本地网络
      // const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      // if (chainId !== '0xaa36a7') { // Sepolia的chainId
      //   await window.ethereum.request({
      //     method: 'wallet_switchEthereumChain',
      //     params: [{ chainId: '0xaa36a7' }]
      //   });
      // }
      
      // 创建提供者和签名者
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // 创建合约实例
      const contract = new ethers.Contract(CONTRACT_ADDRESS, NushuProtocolABI, signer);
      
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
      setAccount(accounts[0]);
      
      // 获取用户积分
      const userPoints = await contract.points(accounts[0]);
      const userPointsNumber = Number(userPoints);
      
      // 第一次登录自动领取初始积分
      if (userPointsNumber === 0) {
        try {
          await contract.claimInitialPoints();
          // 更新积分
          await fetchUserPoints(contract, accounts[0]);
        } catch (claimErr) {
          // 如果已经领取过，忽略错误
          if (claimErr.message && claimErr.message.includes('Already claimed')) {
            console.log('Initial points already claimed');
            // 更新积分
            await fetchUserPoints(contract, accounts[0]);
          } else {
            console.error('Error claiming initial points:', claimErr);
            // 即使领取失败，也更新积分显示
            await fetchUserPoints(contract, accounts[0]);
          }
        }
      } else {
        // 如果已经有积分，直接更新状态
        setPoints(userPointsNumber);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error connecting wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取用户积分
  const fetchUserPoints = async (contractInstance, accountAddress) => {
    try {
      const userPoints = await contractInstance.points(accountAddress);
      setPoints(Number(userPoints));
    } catch (err) {
      console.error('Error fetching user points:', err);
    }
  };

  // 领取初始积分
  const claimInitialPoints = async () => {
    try {
      if (!contract || !account) {
        throw new Error('Please connect your wallet first');
      }
      
      setLoading(true);
      setError(null);
      
      const tx = await contract.claimInitialPoints();
      await tx.wait();
      
      // 更新积分
      await fetchUserPoints(contract, account);
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error claiming initial points:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 购买积分
  const buyPoints = async (ethAmount) => {
    try {
      if (!contract || !account) {
        throw new Error('Please connect your wallet first');
      }
      
      setLoading(true);
      setError(null);
      
      const tx = await contract.buyPoints({
        value: ethers.parseEther(ethAmount.toString())
      });
      await tx.wait();
      
      // 更新积分
      await fetchUserPoints(contract, account);
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error buying points:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 使用服务（扣除积分并触发翻译请求）
  const useService = async (requestId, imageUrl) => {
    try {
      if (!contract || !account) {
        throw new Error('Please connect your wallet first');
      }
      
      setLoading(true);
      setError(null);
      
      const tx = await contract.useService(requestId, imageUrl);
      await tx.wait();
      
      // 更新积分
      await fetchUserPoints(contract, account);
      
      return tx.hash;
    } catch (err) {
      // 不在UI中显示智能合约错误，只在控制台记录
      console.error('Error using service:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 监听账户和网络变化
  useEffect(() => {
    if (window.ethereum) {
      // 监听账户变化
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          const newAccount = accounts[0];
          setAccount(newAccount);
          
          // 重新创建提供者、签名者和合约实例，使用新账户
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const newContract = new ethers.Contract(CONTRACT_ADDRESS, NushuProtocolABI, signer);
            
            setProvider(provider);
            setSigner(signer);
            setContract(newContract);
            
            // 获取用户积分
            const userPoints = await newContract.points(newAccount);
            const userPointsNumber = Number(userPoints);
            
            // 第一次登录自动领取初始积分
            if (userPointsNumber === 0) {
              try {
                await newContract.claimInitialPoints();
                // 更新积分
                await fetchUserPoints(newContract, newAccount);
              } catch (claimErr) {
                // 如果已经领取过，忽略错误
                if (claimErr.message && claimErr.message.includes('Already claimed')) {
                  console.log('Initial points already claimed');
                  // 更新积分
                  await fetchUserPoints(newContract, newAccount);
                } else {
                  console.error('Error claiming initial points:', claimErr);
                  // 即使领取失败，也更新积分显示
                  await fetchUserPoints(newContract, newAccount);
                }
              }
            } else {
              // 如果已经有积分，直接更新状态
              setPoints(userPointsNumber);
            }
          } catch (err) {
            console.error('Error updating account:', err);
            // 重置状态
            setAccount(null);
            setPoints(0);
            setError('Failed to update account');
          }
        } else {
          setAccount(null);
          setPoints(0);
        }
      });
      
      // 监听网络变化
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  // 上下文值
  const contextValue = {
    provider,
    signer,
    contract,
    account,
    points,
    loading,
    error,
    connectWallet,
    claimInitialPoints,
    buyPoints,
    useService,
    fetchUserPoints
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

// 自定义钩子，用于访问上下文
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
