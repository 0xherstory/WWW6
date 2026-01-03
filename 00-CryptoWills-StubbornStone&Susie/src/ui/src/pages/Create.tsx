import { useState } from "react";
import { Link } from "react-router-dom";
import { Contract, parseEther } from "ethers";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTransition } from "@/components/layout/PageTransition";
import { WalletButton } from "@/components/WalletButton";
import { useWalletContext } from "@/contexts/WalletContext";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/contracts";
import { useToast } from "@/hooks/use-toast";

export default function Create() {
  const { signer, address, chainId } = useWalletContext();
  const { toast } = useToast();
  const [heir, setHeir] = useState("");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [days, setDays] = useState("");
  const [minutes, setMinutes] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdAddress, setCreatedAddress] = useState("");

  // Calculate total interval in seconds
  const calculateIntervalSeconds = () => {
    const y = parseInt(years) || 0;
    const m = parseInt(months) || 0;
    const d = parseInt(days) || 0;
    const min = parseInt(minutes) || 0;
    // Approximate: 1 year = 365 days, 1 month = 30 days
    return (y * 365 * 86400) + (m * 30 * 86400) + (d * 86400) + (min * 60);
  };

  const getIntervalDisplay = () => {
    const parts = [];
    if (years) parts.push(`${years}年`);
    if (months) parts.push(`${months}月`);
    if (days) parts.push(`${days}天`);
    if (minutes) parts.push(`${minutes}分钟`);
    return parts.length > 0 ? parts.join(" ") : "未设置";
  };

  const handleCreate = async () => {
    if (!signer) {
      toast({ title: "请先连接钱包", variant: "destructive" });
      return;
    }

    const intervalSeconds = calculateIntervalSeconds();
    if (!heir || intervalSeconds <= 0 || !amount) {
      toast({ title: "请填写所有字段", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
      const tx = await factory.createInheritance(heir, intervalSeconds, {
        value: parseEther(amount),
      });

      toast({ title: "交易已提交", description: "等待确认中..." });

      const receipt = await tx.wait();
      
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = factory.interface.parseLog({ topics: log.topics as string[], data: log.data });
          return parsed?.name === "InheritanceCreated";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = factory.interface.parseLog({ topics: event.topics as string[], data: event.data });
        setCreatedAddress(parsed?.args?.[1] || "");
      }

      setSuccess(true);
      toast({ title: "遗产创建成功！", description: `已锁定 ${amount} ETH，间隔 ${getIntervalDisplay()}` });
    } catch (err: any) {
      toast({ title: "创建失败", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between">
          <Link 
            to="/hub"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium tracking-widest">BACK</span>
          </Link>
          <WalletButton />
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center pt-20 pb-20 px-6 md:px-12 lg:px-20">
          <div className="w-full max-w-xl">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.85] tracking-tighter mb-4"
            >
              CREATE
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mb-10"
            >
              创建您的数字遗产。指定继承人地址、锁定金额和签到间隔时间。
            </motion.p>

            {!address ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-xl p-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium mb-2">连接钱包</p>
                <p className="text-sm text-muted-foreground">
                  请先连接您的 MetaMask 钱包
                </p>
              </motion.div>
            ) : success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-primary/30 rounded-xl p-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <p className="text-xl font-semibold mb-2">创建成功！</p>
                <p className="text-sm text-muted-foreground mb-4">
                  您的遗产合约已部署
                </p>
                {createdAddress && (
                  <p className="font-mono text-xs text-primary break-all mb-6">
                    {createdAddress}
                  </p>
                )}
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => { setSuccess(false); setHeir(""); setYears(""); setMonths(""); setDays(""); setMinutes(""); setAmount(""); }}
                  >
                    继续创建
                  </Button>
                  <Button asChild>
                    <Link to="/list">查看列表</Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-xl p-8 space-y-6"
              >
                {/* Heir Address */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">继承人地址</Label>
                  <Input
                    placeholder="0x..."
                    value={heir}
                    onChange={(e) => setHeir(e.target.value)}
                    className="bg-background border-border font-mono h-12"
                  />
                </div>

                {/* Interval */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">签到间隔</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="space-y-1">
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        className="bg-background border-border h-10 text-center"
                      />
                      <p className="text-xs text-muted-foreground text-center">年</p>
                    </div>
                    <div className="space-y-1">
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={months}
                        onChange={(e) => setMonths(e.target.value)}
                        className="bg-background border-border h-10 text-center"
                      />
                      <p className="text-xs text-muted-foreground text-center">月</p>
                    </div>
                    <div className="space-y-1">
                      <Input
                        type="number"
                        min="0"
                        placeholder="30"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        className="bg-background border-border h-10 text-center"
                      />
                      <p className="text-xs text-muted-foreground text-center">天</p>
                    </div>
                    <div className="space-y-1">
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        className="bg-background border-border h-10 text-center"
                      />
                      <p className="text-xs text-muted-foreground text-center">分钟</p>
                    </div>
                  </div>
                  {calculateIntervalSeconds() > 0 && (
                    <p className="text-xs text-primary">总计: {getIntervalDisplay()}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">遗产金额（ETH）</Label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="0.1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-background border-border h-12"
                  />
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={isLoading}
                  size="lg"
                  className="w-full h-12 font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      创建中...
                    </>
                  ) : (
                    "创建遗产合约"
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 px-6 md:px-12 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">
            {chainId === 11155111 ? "Sepolia Testnet" : chainId ? `Chain ${chainId}` : ""}
          </span>
        </footer>
      </div>
    </PageTransition>
  );
}
