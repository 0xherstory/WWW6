import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Mail, ArrowLeft, Lock, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { WalletList } from "@/components/WalletList";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [view, setView] = useState<"credentials" | "forgot_password" | "reset_password">("credentials");
  const [email, setEmail] = useState("");

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "验证码已发送",
      description: `验证码已发送至 ${email}，请查收。`,
    });
    setView("reset_password");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "密码重置成功",
      description: "您现在可以使用新密码登录。",
    });
    setTimeout(() => setView("credentials"), 1500);
  };

  if (view === "reset_password") {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <Card className="w-full max-w-md border-white/5 bg-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <Button variant="ghost" size="sm" onClick={() => setView("forgot_password")} className="w-fit p-0 hover:bg-transparent text-muted-foreground flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> 返回
            </Button>
            <CardTitle className="text-2xl font-bold pt-4">设置新密码</CardTitle>
            <CardDescription>请输入验证码与新密码</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase text-muted-foreground">邮箱验证码</Label>
                <Input placeholder="123456" className="bg-white/5 border-white/10 h-11" required />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase text-muted-foreground">新密码</Label>
                <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10 h-11" required />
              </div>
              <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground font-mono uppercase tracking-widest mt-4">
                更新密码
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === "forgot_password") {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <Card className="w-full max-w-md border-white/5 bg-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <Button variant="ghost" size="sm" onClick={() => setView("credentials")} className="w-fit p-0 hover:bg-transparent text-muted-foreground flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> 返回登录
            </Button>
            <CardTitle className="text-2xl font-bold pt-4">重置密码</CardTitle>
            <CardDescription>输入您的邮箱以接收验证码</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase text-muted-foreground">邮箱地址</Label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" 
                  className="bg-white/5 border-white/10 h-11" 
                  required
                />
              </div>
              <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground font-mono uppercase tracking-widest mt-4">
                发送验证码
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <Card className="w-full max-w-md border-white/5 bg-card/50 backdrop-blur-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold tracking-tight">登录</CardTitle>
          <CardDescription>请输入您的账户与密码</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase text-muted-foreground">账户名称 / 邮箱</Label>
              <Input placeholder="输入您的账户" className="bg-white/5 border-white/10 h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase text-muted-foreground flex items-center justify-between">
                密码
                <span onClick={() => setView("forgot_password")} className="text-[10px] lowercase hover:underline cursor-pointer opacity-50">忘记密码?</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10 h-11 pl-10" />
              </div>
            </div>
            <Button className="w-full h-11 bg-primary text-primary-foreground font-mono uppercase tracking-widest mt-4" onClick={() => {
              // Mock login success
              localStorage.setItem('user', JSON.stringify({ 
                username: "0xUser_" + Math.floor(Math.random() * 1000), 
                role: "participant" 
              }));
              setLocation('/');
            }}>
              确认登录
            </Button>
          </div>

          <div className="relative py-4">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
             <div className="relative flex justify-center text-[10px] uppercase font-mono text-muted-foreground"><span className="bg-card px-2">或者</span></div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            没有账户？ <span className="text-primary cursor-pointer hover:underline" onClick={() => setLocation('/register')}>立即注册</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
