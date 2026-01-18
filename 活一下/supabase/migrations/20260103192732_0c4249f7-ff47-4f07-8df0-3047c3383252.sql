-- 添加 UPDATE 权限，允许管理员更新状态
CREATE POLICY "Allow update wallet rewards"
ON public.wallet_rewards
FOR UPDATE
USING (true)
WITH CHECK (true);