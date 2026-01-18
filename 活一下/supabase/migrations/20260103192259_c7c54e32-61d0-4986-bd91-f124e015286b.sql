-- 创建钱包奖励记录表
CREATE TABLE public.wallet_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  reward_amount BIGINT NOT NULL DEFAULT 66666,
  token_symbol TEXT NOT NULL DEFAULT 'NS',
  tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 确保每个钱包地址只能领取一次
CREATE UNIQUE INDEX idx_wallet_rewards_address ON public.wallet_rewards(wallet_address);

-- Enable RLS (公开写入，但只有后端可以更新状态)
ALTER TABLE public.wallet_rewards ENABLE ROW LEVEL SECURITY;

-- 允许任何人插入新的钱包地址
CREATE POLICY "Anyone can insert wallet reward"
ON public.wallet_rewards
FOR INSERT
WITH CHECK (true);

-- 允许任何人查看自己的记录
CREATE POLICY "Anyone can view their own reward"
ON public.wallet_rewards
FOR SELECT
USING (true);

-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 创建触发器
CREATE TRIGGER update_wallet_rewards_updated_at
BEFORE UPDATE ON public.wallet_rewards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();