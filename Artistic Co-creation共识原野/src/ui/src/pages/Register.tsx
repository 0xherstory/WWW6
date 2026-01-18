import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Palette, Users, ArrowRight, Wallet, Lock, Mail, User, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { WalletList } from "@/components/WalletList";

export default function Register() {
  const [, setLocation] = useLocation();
  const [role, setRole] = useState<"artist" | "participant" | null>(null);
  
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const roles = [
    { id: 'artist', name: '艺术家 (Artist)', icon: Palette, desc: '发布 3D 艺术框架，发起共创项目' },
    { id: 'participant', name: '参与者 (Participant)', icon: Users, desc: '参与共创过程，贡献创意并获得分润' }
  ];

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save user to session
    localStorage.setItem('user', JSON.stringify({ username, role, email }));
    
    if (role === 'artist') {
      setLocation('/publish');
    } else {
      setLocation('/');
    }
  };

  const handleWalletSelect = (id: string) => {
    setSelectedWallet(id);
    setIsWalletOpen(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <Card className="w-full max-w-2xl border-white/5 bg-card/50 backdrop-blur-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold tracking-tight">申请加入共创</CardTitle>
          <CardDescription>填写信息并选择您的身份</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground flex items-center gap-2">
                  <User className="w-3 h-3" /> 用户名称
                </Label>
                <Input 
                  placeholder="输入您的用户名" 
                  required 
                  className="bg-white/5 border-white/10 h-11" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground flex items-center gap-2">
                  <Mail className="w-3 h-3" /> 邮箱地址
                </Label>
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  required 
                  className="bg-white/5 border-white/10 h-11" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xs uppercase font-mono text-muted-foreground">身份选择</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((r) => (
                  <div 
                    key={r.id}
                    onClick={() => setRole(r.id as any)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 space-y-2 ${role === r.id ? 'border-primary bg-primary/5 shadow-lg' : 'border-white/5 hover:border-white/10 hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${role === r.id ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground'}`}>
                        <r.icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm">{r.name}</h4>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground flex items-center gap-2">
                  <Wallet className="w-3 h-3" /> 钱包平台
                </Label>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full h-11 border-white/10 bg-white/5 justify-between font-normal"
                  onClick={() => setIsWalletOpen(true)}
                >
                  {selectedWallet ? (
                    <span className="capitalize">{selectedWallet}</span>
                  ) : (
                    <span className="text-muted-foreground">选择钱包平台</span>
                  )}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> 钱包地址
                </Label>
                <Input placeholder="0x..." required className="bg-white/5 border-white/10 h-11" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground flex items-center gap-2">
                  <Lock className="w-3 h-3" /> 登录密码
                </Label>
                <Input type="password" required className="bg-white/5 border-white/10 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground flex items-center gap-2">
                  <Lock className="w-3 h-3" /> 确认密码
                </Label>
                <Input type="password" required className="bg-white/5 border-white/10 h-11" />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 font-mono text-sm uppercase tracking-widest" disabled={!role}>
              提交申请并进入
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isWalletOpen} onOpenChange={setIsWalletOpen}>
        <DialogContent className="sm:max-w-[425px] border-white/10 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>选择钱包</DialogTitle>
            <DialogDescription>
              选择您的加密货币钱包以继续注册
            </DialogDescription>
          </DialogHeader>
          <WalletList onSelect={handleWalletSelect} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
