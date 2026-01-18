import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, Copy, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WalletReward {
  id: string;
  wallet_address: string;
  reward_amount: number;
  token_symbol: string;
  tx_hash: string | null;
  status: string;
  created_at: string;
}

export default function Admin() {
  const [rewards, setRewards] = useState<WalletReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [txHashInputs, setTxHashInputs] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const fetchRewards = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wallet_rewards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: '加载失败', description: error.message, variant: 'destructive' });
    } else {
      setRewards(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: '已复制', description: '钱包地址已复制到剪贴板' });
  };

  const markAsSent = async (id: string) => {
    const txHash = txHashInputs[id]?.trim();
    if (!txHash) {
      toast({ title: '请输入交易哈希', variant: 'destructive' });
      return;
    }

    const { error } = await supabase
      .from('wallet_rewards')
      .update({ status: 'sent', tx_hash: txHash })
      .eq('id', id);

    if (error) {
      toast({ title: '更新失败', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '已标记为已发送' });
      fetchRewards();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">待发送</Badge>;
      case 'sent':
        return <Badge className="bg-green-500">已发送</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">NS币发放管理</h1>
          </div>
          <Button onClick={fetchRewards} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>

        <div className="space-y-4">
          {rewards.length === 0 && !loading && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                暂无待发送的奖励
              </CardContent>
            </Card>
          )}

          {rewards.map((reward) => (
            <Card key={reward.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {reward.reward_amount.toLocaleString()} {reward.token_symbol}
                    {getStatusBadge(reward.status)}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {new Date(reward.created_at).toLocaleString('zh-CN')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-muted p-2 rounded font-mono break-all">
                    {reward.wallet_address}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(reward.wallet_address)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                {reward.status === 'pending' ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="输入交易哈希 (tx_hash)"
                      value={txHashInputs[reward.id] || ''}
                      onChange={(e) =>
                        setTxHashInputs((prev) => ({ ...prev, [reward.id]: e.target.value }))
                      }
                      className="font-mono text-sm"
                    />
                    <Button onClick={() => markAsSent(reward.id)}>
                      <Check className="w-4 h-4 mr-2" />
                      确认发送
                    </Button>
                  </div>
                ) : (
                  reward.tx_hash && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">交易哈希: </span>
                      <code className="bg-muted p-1 rounded font-mono break-all">
                        {reward.tx_hash}
                      </code>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
