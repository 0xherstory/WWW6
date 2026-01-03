import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/contexts/WalletContext";
import { Loader2 } from "lucide-react";

export function WalletButton() {
  const { address, isConnecting, connect, disconnect } = useWalletContext();

  if (isConnecting) {
    return (
      <Button disabled variant="outline" className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        连接中...
      </Button>
    );
  }

  if (address) {
    return (
      <Button 
        variant="outline" 
        onClick={disconnect}
        className="font-mono text-sm"
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button 
      variant="outline"
      onClick={connect}
      className="font-medium tracking-wider"
    >
      CONNECT
    </Button>
  );
}
