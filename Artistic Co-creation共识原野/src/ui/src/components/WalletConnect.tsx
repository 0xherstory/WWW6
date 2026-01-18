import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const { toast } = useToast();

  const connectWallet = async () => {
    // Try real connection first, fallback to mock for demo/testing
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const bal = await provider.getBalance(address);
        
        setAccount(address);
        setBalance(ethers.formatEther(bal));
        
        toast({
          title: "钱包已连接",
          description: `已连接至 ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      } catch (error) {
        console.error("Error connecting wallet:", error);
        // Fallback to mock if user rejects or error occurs
        connectMockWallet();
      }
    } else {
      // No wallet installed - use mock for demo
      connectMockWallet();
    }
  };

  const connectMockWallet = () => {
    // Simulate a delay for realism
    setTimeout(() => {
      const mockAddress = "0x71C...9A23";
      setAccount(mockAddress);
      setBalance("14.5");
      
      toast({
        title: "模拟钱包已连接",
        description: "演示模式：已连接测试账户。",
      });
    }, 800);
  };

  useEffect(() => {
    // Check if already connected
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          connectWallet();
        }
      });
    }
  }, []);

  return (
    <Button 
      variant={account ? "outline" : "default"} 
      onClick={account ? () => {} : connectWallet}
      className="font-mono text-xs border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {account ? (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
      ) : (
        "连接钱包"
      )}
    </Button>
  );
}
