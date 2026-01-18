import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, CloudRain, Flame, Waves, Wind, Sprout, TrendingUp, Loader2, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Province, WeatherType } from "./ChinaMap";
import AnimatedCounter from "./AnimatedCounter";
import { useWeb3 } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { toast } from "@/hooks/use-toast";

interface BettingModalProps {
  province: Province | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBetConfirm?: (amount: number) => void;
}

const weatherOptions: {
  type: WeatherType;
  icon: React.ReactNode;
  label: string;
}[] = [{
  type: "sunny",
  icon: <Sun className="w-5 h-5" />,
  label: "晴天"
}, {
  type: "rain",
  icon: <CloudRain className="w-5 h-5" />,
  label: "小雨"
}, {
  type: "drought",
  icon: <Flame className="w-5 h-5" />,
  label: "干旱"
}, {
  type: "flood",
  icon: <Waves className="w-5 h-5" />,
  label: "洪涝"
}, {
  type: "typhoon",
  icon: <Wind className="w-5 h-5" />,
  label: "台风"
}];

// ETH amounts for quick selection (in ETH for Sepolia testnet)
const quickAmountsEth = [0.001, 0.005, 0.01, 0.05];

const BettingModal = ({
  province,
  open,
  onOpenChange,
  onBetConfirm
}: BettingModalProps) => {
  const [selectedWeather, setSelectedWeather] = useState<WeatherType>("drought");
  const [stance, setStance] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { account, connectWallet, isCorrectNetwork, switchToSepolia } = useWeb3();
  const { placeBet, isContractDeployed, charityPool } = useContract();

  if (!province) return null;

  const numAmount = parseFloat(amount) || 0;
  const odds = stance === "yes" ? 2.35 : 1.85;
  const potentialWin = numAmount * odds;
  const yesPool = 65;
  const noPool = 35;
  const totalPool = 12580;
  const currentWeather = province.weather;

  const handleConfirm = async () => {
    if (numAmount <= 0) return;

    // If not connected, prompt connection
    if (!account) {
      await connectWallet();
      return;
    }

    // If wrong network, prompt switch
    if (!isCorrectNetwork) {
      await switchToSepolia();
      return;
    }

    // Check if contract is deployed
    if (!isContractDeployed) {
      toast({
        title: "合約未部署",
        description: "請先部署智能合約到 Sepolia 測試網",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setTxHash(null);

    try {
      const result = await placeBet(
        province.name,
        selectedWeather,
        stance === "yes",
        amount
      );

      setTxHash(result.hash);
      
      toast({
        title: "下注成功！",
        description: (
          <div className="flex flex-col gap-1">
            <span>交易已確認</span>
            <a 
              href={`https://sepolia.etherscan.io/tx/${result.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline flex items-center gap-1"
            >
              查看交易 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ),
      });

      if (onBetConfirm) {
        onBetConfirm(numAmount);
      }

      // Reset form
      setAmount("");
    } catch (error: any) {
      console.error('Bet failed:', error);
      toast({
        title: "下注失敗",
        description: error.message || "交易被拒絕或失敗",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get button text based on state
  const getButtonContent = () => {
    if (isSubmitting) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          交易處理中...
        </>
      );
    }
    if (!account) {
      return "連接錢包下注";
    }
    if (!isCorrectNetwork) {
      return "切換到 Sepolia 網路";
    }
    if (!isContractDeployed) {
      return "合約未部署";
    }
    return "確認下注 (Confirm Bet)";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-medium max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span className="font-serif">{province.name}</span>
            <span className="text-sm font-normal text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
              {province.crop}
            </span>
          </DialogTitle>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>目标日期：<span className="font-medium text-foreground">2026年1月11日</span></span>
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-1">
              当前天气：
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium
                ${currentWeather === "sunny" ? "bg-weather-sunny/20 text-weather-sunny" : 
                  currentWeather === "rain" ? "bg-weather-rain/20 text-weather-rain" : 
                  currentWeather === "drought" ? "bg-weather-drought/20 text-weather-drought" : 
                  currentWeather === "flood" ? "bg-weather-flood/20 text-weather-flood" : 
                  "bg-weather-typhoon/20 text-weather-typhoon"}`}>
                {currentWeather === "sunny" && <Sun className="w-3 h-3" />}
                {currentWeather === "rain" && <CloudRain className="w-3 h-3" />}
                {currentWeather === "drought" && <Flame className="w-3 h-3" />}
                {currentWeather === "flood" && <Waves className="w-3 h-3" />}
                {currentWeather === "typhoon" && <Wind className="w-3 h-3" />}
                {weatherOptions.find(w => w.type === currentWeather)?.label}
              </span>
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Weather Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              选择天气预测
            </label>
            <div className="grid grid-cols-5 gap-2">
              {weatherOptions.map(option => (
                <motion.button
                  key={option.type}
                  onClick={() => setSelectedWeather(option.type)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all
                    ${selectedWeather === option.type ? "border-primary bg-primary/10 shadow-soft" : "border-border hover:border-primary/50 hover:bg-muted/50"}
                  `}
                >
                  <div className={`
                    p-1.5 rounded-lg
                    ${option.type === "sunny" ? "bg-weather-sunny/30" : option.type === "rain" ? "bg-weather-rain/30" : option.type === "drought" ? "bg-weather-drought/30" : option.type === "flood" ? "bg-weather-flood/30" : "bg-weather-typhoon/30"}
                  `}>
                    {option.icon}
                  </div>
                  <span className="text-[10px] font-medium">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Stance Toggle */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              您的立场
            </label>
            <div className="flex gap-2">
              <motion.button
                onClick={() => setStance("yes")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex-1 py-3 rounded-xl font-semibold text-sm transition-all
                  ${stance === "yes" ? "bg-accent text-accent-foreground shadow-soft" : "bg-muted text-muted-foreground hover:bg-accent/20"}
                `}
              >
                ✓ YES - 会发生
              </motion.button>
              <motion.button
                onClick={() => setStance("no")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex-1 py-3 rounded-xl font-semibold text-sm transition-all
                  ${stance === "no" ? "bg-destructive text-destructive-foreground shadow-soft" : "bg-muted text-muted-foreground hover:bg-destructive/20"}
                `}
              >
                ✗ NO - 不会发生
              </motion.button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              下注金额 (ETH)
            </label>
            <Input
              type="number"
              placeholder="输入 ETH 金额..."
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="h-12 text-lg bg-background border-border"
              step="0.001"
            />
            <div className="flex gap-2 mt-2">
              {quickAmountsEth.map(amt => (
                <motion.button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-1.5 text-sm font-medium rounded-lg bg-muted hover:bg-secondary transition-colors"
                >
                  {amt} ETH
                </motion.button>
              ))}
            </div>
          </div>

          {/* Market Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-muted/50 rounded-xl p-4 border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">市场预览</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">总奖池</p>
                <p className="text-sm font-semibold text-foreground">
                  <AnimatedCounter value={totalPool} prefix="$" suffix=" USDC" />
                </p>
              </div>
            </div>

            {/* Pool Distribution Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-accent">YES {yesPool}%</span>
                <span className="text-destructive">NO {noPool}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden flex bg-background">
                <motion.div
                  className="bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${yesPool}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="bg-destructive"
                  initial={{ width: 0 }}
                  animate={{ width: `${noPool}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">预计赔率</p>
                <p className="font-semibold text-foreground">{odds.toFixed(2)}x</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">潜在收益</p>
                <p className="font-semibold text-accent">
                  <AnimatedCounter value={potentialWin} prefix="+$" decimals={2} />
                </p>
              </div>
            </div>

            {/* Charity Note */}
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
              <Sprout className="w-4 h-4 text-accent" />
              <span className="text-xs text-accent font-medium">🌱 1% 下注金额将捐赠给助农资金池</span>
            </div>
          </motion.div>

          {/* Transaction Hash Display */}
          {txHash && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/10 border border-accent/30 rounded-lg p-3 flex items-center justify-between"
            >
              <span className="text-sm text-accent">交易成功！</span>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent underline flex items-center gap-1"
              >
                查看交易 <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          )}

          {/* Confirm Button */}
          <motion.div whileHover={{ scale: isSubmitting ? 1 : 1.02 }} whileTap={{ scale: isSubmitting ? 1 : 0.98 }}>
            <Button
              onClick={handleConfirm}
              disabled={numAmount <= 0 || isSubmitting || (!isContractDeployed && account && isCorrectNetwork)}
              className="w-full h-12 text-base font-semibold"
              variant={!account ? "wallet" : "default"}
            >
              {getButtonContent()}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BettingModal;
