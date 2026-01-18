import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWeb3 } from "@/contexts/Web3Context";
import { toast } from "@/hooks/use-toast";

const WalletButton = () => {
  const {
    account,
    balance,
    isConnecting,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
  } = useWeb3();

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast({
        title: "已複製",
        description: "錢包地址已複製到剪貼板",
      });
    }
  };

  const openEtherscan = () => {
    if (account) {
      window.open(`https://sepolia.etherscan.io/address/${account}`, '_blank');
    }
  };

  // Not connected state
  if (!account) {
    return (
      <Button
        variant="wallet"
        size="sm"
        className="gap-2"
        onClick={connectWallet}
        disabled={isConnecting}
      >
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:inline">
          {isConnecting ? "連接中..." : "连接钱包"}
        </span>
      </Button>
    );
  }

  // Wrong network state
  if (!isCorrectNetwork) {
    return (
      <Button
        variant="destructive"
        size="sm"
        className="gap-2"
        onClick={switchToSepolia}
      >
        <AlertTriangle className="w-4 h-4" />
        <span className="hidden sm:inline">切換到 Sepolia</span>
      </Button>
    );
  }

  // Connected state
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-accent/10 border-accent/30 hover:bg-accent/20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 rounded-full bg-accent"
          />
          <span className="font-mono text-sm">{shortenAddress(account)}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-xs text-muted-foreground">餘額</p>
          <p className="text-lg font-semibold">
            {parseFloat(balance).toFixed(4)} ETH
          </p>
          <p className="text-xs text-accent">Sepolia 測試網</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="w-4 h-4 mr-2" />
          複製地址
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openEtherscan} className="cursor-pointer">
          <ExternalLink className="w-4 h-4 mr-2" />
          在 Etherscan 查看
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={disconnectWallet}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          斷開連接
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletButton;
