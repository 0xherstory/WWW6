import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, Gift, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  onSkipToNextLevel?: () => void;
}

export const WalletDialog = ({ isOpen, onClose, onSubmitted, onSkipToNextLevel }: WalletDialogProps) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const validateEthAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = async () => {
    if (!walletAddress.trim()) {
      setError('请输入钱包地址');
      return;
    }
    
    if (!validateEthAddress(walletAddress.trim())) {
      setError('请输入有效的以太坊钱包地址');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const { error: dbError } = await supabase
        .from('wallet_rewards')
        .insert({
          wallet_address: walletAddress.trim(),
        });

      if (dbError) {
        if (dbError.code === '23505') {
          setError('该钱包地址已领取过奖励');
        } else {
          setError('提交失败，请稍后重试');
          console.error('Database error:', dbError);
        }
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
      onSubmitted?.();
      toast({
        title: '提交成功',
        description: '您的钱包地址已记录，NS币将尽快发送',
      });
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('Submit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setWalletAddress('');
    setError('');
    onClose();
  };

  const handleSkipAndClose = () => {
    handleClose();
    onSkipToNextLevel?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleSkipAndClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/30">
        {!isSubmitted ? (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                🎉 恭喜解锁女书币！
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                请输入您的以太坊钱包地址，我们将赠送您 <span className="text-primary font-bold">66,666 NS币</span>（女书币）
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Input
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => {
                    setWalletAddress(e.target.value);
                    setError('');
                  }}
                  className="font-mono text-sm bg-background/50 border-primary/30 focus:border-primary"
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-destructive text-sm">{error}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSkipAndClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  稍后填写
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Gift className="w-4 h-4 mr-2" />
                  )}
                  领取奖励
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                🎊 奖励申请成功！
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2 space-y-2">
                <p>
                  <span className="text-primary font-bold text-2xl">66,666 NS币</span>
                </p>
                <p className="text-sm">将尽快发送至您的钱包</p>
                <p className="font-mono text-xs break-all bg-muted/50 p-2 rounded mt-2">
                  {walletAddress}
                </p>
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4">
              <Button
                onClick={handleClose}
                className="w-full bg-primary hover:bg-primary/90"
              >
                继续游戏
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
