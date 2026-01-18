import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WalletListProps {
  onSelect: (id: string) => void;
}

export const WalletList = ({ onSelect }: WalletListProps) => {
  const walletOptions = [
    { id: "metamask", name: "MetaMask", subName: "元面具", icon: "https://i.ibb.co/6R2vP9Z/metamask.png" },
    { id: "coinbase", name: "Coinbase Wallet", subName: "Coinbase 钱包", icon: "https://i.ibb.co/VmqK1QZ/coinbase.png" },
    { id: "passkeys", name: "Passkeys", subName: "通行密钥", icon: "🔑" },
    { id: "walletconnect", name: "WalletConnect", subName: "钱包连接", icon: "https://i.ibb.co/9vFzXvD/walletconnect.png" },
    { id: "bitget", name: "Install Bitget Wallet", subName: "安装 Bitget 钱包", icon: "https://i.ibb.co/fD7pS7S/bitget.png" }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-[10px] uppercase font-mono text-muted-foreground px-1">Recent 最近使用</p>
        {walletOptions.slice(0, 1).map((wallet) => (
          <Button 
            key={wallet.id}
            variant="outline" 
            className="w-full h-16 border-white/10 hover:bg-white/10 font-sans text-sm flex items-center justify-between px-6 transition-all group rounded-xl"
            onClick={() => onSelect(wallet.id)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform p-2">
                <img src={wallet.icon} alt={wallet.name} className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <div className="font-medium text-white">{wallet.name}</div>
                <div className="text-[10px] text-muted-foreground">{wallet.subName}</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-[10px] uppercase font-mono text-muted-foreground px-1">Popular 热门推荐</p>
        {walletOptions.slice(1).map((wallet) => (
          <Button 
            key={wallet.id}
            variant="outline" 
            className="w-full h-16 border-white/10 hover:bg-white/10 font-sans text-sm flex items-center justify-between px-6 transition-all group rounded-xl"
            onClick={() => onSelect(wallet.id)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform p-2">
                {wallet.id === 'passkeys' ? (
                  <span className="text-2xl">{wallet.icon}</span>
                ) : (
                  <img src={wallet.icon} alt={wallet.name} className="w-full h-full object-contain" />
                )}
              </div>
              <div className="text-left">
                <div className="font-medium text-white">{wallet.name}</div>
                <div className="text-[10px] text-muted-foreground">{wallet.subName}</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Button>
        ))}
      </div>
      <Button variant="ghost" className="w-full text-xs text-muted-foreground">Show more 显示更多</Button>
    </div>
  );
};
