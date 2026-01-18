import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { BrowserProvider, JsonRpcSigner, formatEther, parseEther } from 'ethers';

// Sepolia Testnet Chain ID
const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
const SEPOLIA_CHAIN_CONFIG = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: 'Sepolia Testnet',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'SepoliaETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.sepolia.org'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

interface Web3ContextType {
  account: string | null;
  signer: JsonRpcSigner | null;
  provider: BrowserProvider | null;
  balance: string;
  chainId: string | null;
  isConnecting: boolean;
  isCorrectNetwork: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToSepolia: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  const updateBalance = useCallback(async (address: string, prov: BrowserProvider) => {
    try {
      const bal = await prov.getBalance(address);
      setBalance(formatEther(bal));
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  }, []);

  const switchToSepolia = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_CHAIN_CONFIG],
          });
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError);
        }
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      const prov = new BrowserProvider(window.ethereum);
      const accounts = await prov.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const sig = await prov.getSigner();
        const network = await prov.getNetwork();
        
        setProvider(prov);
        setSigner(sig);
        setAccount(accounts[0]);
        setChainId('0x' + network.chainId.toString(16));
        
        await updateBalance(accounts[0], prov);
        
        // Auto switch to Sepolia if not on correct network
        if ('0x' + network.chainId.toString(16) !== SEPOLIA_CHAIN_ID) {
          await switchToSepolia();
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
    setBalance('0');
    setChainId(null);
  };

  // Listen for account and network changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        if (provider) {
          const sig = await provider.getSigner();
          setSigner(sig);
          await updateBalance(accounts[0], provider);
        }
      }
    };

    const handleChainChanged = (newChainId: string) => {
      setChainId(newChainId);
      // Reload to reset state on chain change
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Check if already connected
    const checkConnection = async () => {
      try {
        const prov = new BrowserProvider(window.ethereum);
        const accounts = await prov.listAccounts();
        
        if (accounts.length > 0) {
          const sig = await prov.getSigner();
          const network = await prov.getNetwork();
          
          setProvider(prov);
          setSigner(sig);
          setAccount(accounts[0].address);
          setChainId('0x' + network.chainId.toString(16));
          
          await updateBalance(accounts[0].address, prov);
        }
      } catch (error) {
        console.error('Failed to check connection:', error);
      }
    };

    checkConnection();

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [provider, updateBalance]);

  return (
    <Web3Context.Provider
      value={{
        account,
        signer,
        provider,
        balance,
        chainId,
        isConnecting,
        isCorrectNetwork,
        connectWallet,
        disconnectWallet,
        switchToSepolia,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
