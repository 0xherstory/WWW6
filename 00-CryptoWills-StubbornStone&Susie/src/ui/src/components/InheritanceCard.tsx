import { useState, useEffect, useCallback } from "react";
import { Contract, formatEther, parseEther } from "ethers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWalletContext } from "@/contexts/WalletContext";
import { INHERITANCE_ABI } from "@/lib/contracts";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2,
  Heart,
  Skull,
  Copy,
  ExternalLink,
  Settings,
  Undo2,
  UserCog
} from "lucide-react";

interface Props {
  address: string;
  onUpdate?: () => void;
}

interface InheritanceData {
  owner: string;
  heir: string;
  lastCheckIn: bigint;
  checkInInterval: bigint;
  inherited: boolean;
  balance: string;
  isDead: boolean;
}

export function InheritanceCard({ address, onUpdate }: Props) {
  const { provider, signer, address: userAddress } = useWalletContext();
  const { toast } = useToast();
  const [data, setData] = useState<InheritanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  
  // Edit states
  const [newHeir, setNewHeir] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const fetchData = useCallback(async () => {
    if (!provider) return;

    try {
      const contract = new Contract(address, INHERITANCE_ABI, provider);
      const [owner, heir, lastCheckIn, checkInInterval, inherited, isDead] = await Promise.all([
        contract.owner(),
        contract.heir(),
        contract.lastCheckIn(),
        contract.checkInInterval(),
        contract.inherited(),
        contract.isDead(),
      ]);
      const balance = await provider.getBalance(address);

      setData({
        owner,
        heir,
        lastCheckIn,
        checkInInterval,
        inherited,
        balance: formatEther(balance),
        isDead,
      });
    } catch (err) {
      console.error("Failed to fetch inheritance data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [provider, address]);

  // Listen to contract events
  useEffect(() => {
    if (!provider || !data) return;

    const contract = new Contract(address, INHERITANCE_ABI, provider);

    const handleCheckIn = () => {
      toast({ title: "签到成功", description: "倒计时已重置" });
      fetchData();
    };

    const handleFinalized = (heir: string, amount: bigint) => {
      toast({ 
        title: "遗产已被继承", 
        description: `${formatEther(amount)} ETH 已转移给继承人` 
      });
      fetchData();
      onUpdate?.();
    };

    contract.on("CheckedIn", handleCheckIn);
    contract.on("InheritanceFinalized", handleFinalized);

    return () => {
      contract.off("CheckedIn", handleCheckIn);
      contract.off("InheritanceFinalized", handleFinalized);
    };
  }, [provider, address, data, fetchData, toast, onUpdate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time countdown (updates every second)
  useEffect(() => {
    if (!data || data.inherited) return;

    const updateCountdown = () => {
      const now = BigInt(Math.floor(Date.now() / 1000));
      const deadline = data.lastCheckIn + data.checkInInterval;
      const remaining = deadline - now;

      if (remaining <= 0n) {
        setCountdown("已到期");
        return;
      }

      const days = Number(remaining / 86400n);
      const hours = Number((remaining % 86400n) / 3600n);
      const minutes = Number((remaining % 3600n) / 60n);
      const seconds = Number(remaining % 60n);

      if (days > 0) {
        setCountdown(`${days}天 ${hours}时 ${minutes}分`);
      } else if (hours > 0) {
        setCountdown(`${hours}时 ${minutes}分 ${seconds}秒`);
      } else {
        setCountdown(`${minutes}分 ${seconds}秒`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data]);

  const getWriteSigner = useCallback(async () => {
    if (signer) return signer;
    if (!provider) return null;
    try {
      return await provider.getSigner();
    } catch {
      return null;
    }
  }, [provider, signer]);

  // Check-in function
  const handleCheckIn = async () => {
    const writeSigner = await getWriteSigner();
    if (!writeSigner) {
      toast({ title: "请先连接钱包", variant: "destructive" });
      return;
    }

    setActionLoading("checkIn");
    try {
      const contract = new Contract(address, INHERITANCE_ABI, writeSigner);
      const tx = await contract.checkIn();
      toast({ title: "签到交易已提交", description: "等待确认..." });
      await tx.wait();
      toast({ title: "签到成功！", description: "倒计时已重置" });
      fetchData();
    } catch (err: any) {
      toast({ title: "签到失败", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  // Finalize inheritance (for heir)
  const handleFinalize = async () => {
    const writeSigner = await getWriteSigner();
    if (!writeSigner) {
      toast({ title: "请先连接钱包", variant: "destructive" });
      return;
    }

    setActionLoading("finalize");
    try {
      const contract = new Contract(address, INHERITANCE_ABI, writeSigner);
      const tx = await contract.finalizeInheritance();
      toast({ title: "领取交易已提交", description: "等待确认..." });
      await tx.wait();
      toast({ title: "遗产领取成功！" });
      fetchData();
      onUpdate?.();
    } catch (err: any) {
      toast({ title: "领取失败", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  // Withdraw function (cancel/retrieve funds)
  const handleWithdraw = async () => {
    const writeSigner = await getWriteSigner();
    if (!writeSigner) {
      toast({ title: "请先连接钱包", variant: "destructive" });
      return;
    }

    setActionLoading("withdraw");
    try {
      const contract = new Contract(address, INHERITANCE_ABI, writeSigner);
      const tx = await contract.withdraw();
      toast({ title: "撤回交易已提交", description: "等待确认..." });
      await tx.wait();
      toast({ title: "资金已撤回！", description: "ETH 已返回您的钱包" });
      fetchData();
      onUpdate?.();
    } catch (err: any) {
      toast({ title: "撤回失败", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  // Change heir function
  const handleChangeHeir = async () => {
    if (!newHeir) return;

    const writeSigner = await getWriteSigner();
    if (!writeSigner) {
      toast({ title: "请先连接钱包", variant: "destructive" });
      return;
    }

    setActionLoading("changeHeir");
    try {
      const contract = new Contract(address, INHERITANCE_ABI, writeSigner);
      const tx = await contract.changeHeir(newHeir);
      toast({ title: "修改继承人交易已提交", description: "等待确认..." });
      await tx.wait();
      toast({ title: "继承人已修改！" });
      setNewHeir("");
      fetchData();
    } catch (err: any) {
      toast({ title: "修改失败", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({ title: "已复制地址" });
  };

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          加载失败
        </CardContent>
      </Card>
    );
  }

  const isOwner = userAddress && data.owner && userAddress.toLowerCase() === data.owner.toLowerCase();
  const isHeir = userAddress && data.heir && userAddress.toLowerCase() === data.heir.toLowerCase();
  const lastCheckInDate = new Date(Number(data.lastCheckIn) * 1000);
  const hasBalance = parseFloat(data.balance) > 0;
  const isConnected = !!provider && !!userAddress;

  return (
    <Card className={`border-border bg-card transition-all hover:border-primary/30 ${data.inherited ? "opacity-50" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {address.slice(0, 8)}...{address.slice(-6)}
            </span>
            <button onClick={copyAddress} className="text-muted-foreground hover:text-foreground transition-colors">
              <Copy className="h-3 w-3" />
            </button>
          </div>
          <div className="flex gap-1.5">
            {data.inherited ? (
              <Badge variant="secondary" className="text-xs">已继承</Badge>
            ) : data.isDead ? (
              <Badge variant="destructive" className="text-xs flex items-center gap-1">
                <Skull className="h-3 w-3" />
                可继承
              </Badge>
            ) : (
              <Badge className="text-xs flex items-center gap-1 bg-emerald-600 text-white">
                <Heart className="h-3 w-3" />
                正常
              </Badge>
            )}
            {isOwner && <Badge variant="outline" className="text-xs">Owner</Badge>}
            {isHeir && <Badge variant="outline" className="text-xs">Heir</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data display */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">余额</p>
            <p className="font-semibold text-primary">{parseFloat(data.balance).toFixed(4)} ETH</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">剩余时间</p>
            <p className={`font-medium ${data.isDead ? "text-destructive" : "text-primary"}`}>
              {data.inherited ? "-" : countdown}
            </p>
          </div>
          <div className="space-y-0.5 col-span-2">
            <p className="text-xs text-muted-foreground">上次签到</p>
            <p className="text-xs">{lastCheckInDate.toLocaleString("zh-CN")}</p>
          </div>
        </div>

        {/* Heir display */}
        <div className="text-xs space-y-0.5">
          <p className="text-muted-foreground">继承人</p>
          <p className="font-mono text-xs truncate">{data.heir}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          {/* Check-in button (Owner only, not inherited) */}
          {!data.inherited && !data.isDead && (
            <Button
              onClick={handleCheckIn}
              disabled={actionLoading === "checkIn" || !isConnected || !isOwner}
              size="sm"
              className="flex-1"
              title={!isConnected ? "请先连接钱包" : !isOwner ? "仅合约Owner可操作" : "点击签到"}
            >
              {actionLoading === "checkIn" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-1" />
                  签到
                </>
              )}
            </Button>
          )}

          {/* Expired notice for owner */}
          {!data.inherited && data.isDead && isOwner && !isHeir && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              disabled
            >
              已到期，继承人可领取
            </Button>
          )}

          {/* Finalize button (Heir only, not inherited, isDead) */}
          {!data.inherited && data.isDead && isHeir && (
            <Button
              onClick={handleFinalize}
              disabled={actionLoading === "finalize" || !isConnected}
              size="sm"
              variant="destructive"
              className="flex-1"
              title={!isConnected ? "请先连接钱包" : "点击领取"}
            >
              {actionLoading === "finalize" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "领取遗产"
              )}
            </Button>
          )}

          {/* Settings button (always visible, but disabled if not owner) */}
          {!data.inherited && (
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={!isConnected || !isOwner}
                  title={!isConnected ? "请先连接钱包" : !isOwner ? "仅合约Owner可操作" : "管理设置"}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>合约管理</DialogTitle>
                  <DialogDescription>
                    修改遗产合约设置或撤回资金
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Withdraw - visible when NOT expired (disabled if no balance) */}
                  {!data.isDead && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Undo2 className="h-4 w-4 text-destructive" />
                        <Label className="text-sm font-medium">撤回资金</Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        撤回合约中的所有 ETH（当前余额：{parseFloat(data.balance).toFixed(4)} ETH）到您的钱包
                      </p>
                      <Button
                        onClick={handleWithdraw}
                        disabled={actionLoading === "withdraw" || !hasBalance}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        title={!hasBalance ? "合约余额为 0，无需撤回" : undefined}
                      >
                        {actionLoading === "withdraw" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : !hasBalance ? (
                          "余额为 0"
                        ) : (
                          "确认撤回"
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Expired notice */}
                  {data.isDead && (
                    <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-md">
                      合约已到期，无法撤回资金。继承人可以领取遗产。
                    </div>
                  )}

                  {/* Change Heir */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4 text-primary" />
                      <Label className="text-sm font-medium">修改继承人</Label>
                    </div>
                    <Input
                      placeholder="新继承人地址 0x..."
                      value={newHeir}
                      onChange={(e) => setNewHeir(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <Button
                      onClick={handleChangeHeir}
                      disabled={actionLoading === "changeHeir" || !newHeir}
                      size="sm"
                      className="w-full"
                    >
                      {actionLoading === "changeHeir" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "确认修改继承人"
                      )}
                    </Button>
                  </div>

                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Etherscan link */}
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a 
              href={`https://sepolia.etherscan.io/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {(!isConnected || (!isOwner && !isHeir)) && (
          <p className="text-xs text-muted-foreground">
            {!isConnected
              ? "钱包未就绪：请重新连接或刷新页面"
              : `当前钱包无权限（Owner: ${data.owner.slice(0, 6)}...${data.owner.slice(-4)}）`}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
