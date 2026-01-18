import { useState, useCallback, useEffect } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

export interface WalletState {
  address: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

const SEPOLIA_CHAIN_ID = 11155111;

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    provider: null,
    signer: null,
    chainId: null,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      setState((s) => ({ ...s, error: "请安装 MetaMask 钱包" }));
      return;
    }

    setState((s) => ({ ...s, isConnecting: true, error: null }));

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();

      if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
          });
        } catch {
          setState((s) => ({ ...s, error: "请切换到 Sepolia 测试网", isConnecting: false }));
          return;
        }
      }

      setState({
        address: accounts[0],
        provider,
        signer,
        chainId: Number(network.chainId),
        isConnecting: false,
        error: null,
      });
    } catch (err: any) {
      setState((s) => ({ ...s, error: err.message, isConnecting: false }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      provider: null,
      signer: null,
      chainId: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (typeof window.ethereum === "undefined") return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (state.address !== accounts[0]) {
        connect();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [connect, disconnect, state.address]);

  return { ...state, connect, disconnect };
}
