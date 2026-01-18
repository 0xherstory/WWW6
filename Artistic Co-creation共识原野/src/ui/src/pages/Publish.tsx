import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Upload, Percent, Users, ArrowLeft } from "lucide-react";
import { addSessionProject } from "@/lib/mock-data";
import fluidArt from "@assets/generated_images/fluid_simulation_art.png";

export default function Publish() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    artist: "",
    title: "",
    concept: "",
    link: "",
    creators: "10",
    share: "50"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newProject = {
        id: Date.now().toString(),
        title: formData.title,
        artist: formData.artist,
        image: fluidArt, 
        price: 0,
        creators: parseInt(formData.creators),
        status: "active" as const,
        category: "other" as const,
        description: formData.concept,
        splitsShare: parseInt(formData.share),
        iframeUrl: formData.link,
        history: [
          { 
            id: Date.now(), 
            title: "艺术家发起作品", 
            desc: `${formData.artist} 发布了初始作品。`, 
            time: new Date().toLocaleString(), 
            hash: `${Math.random().toString(16).slice(2, 10)}...`, 
            type: "artist" as const 
          }
        ]
      };
      addSessionProject(newProject);
      setLoading(false);
      toast({
        title: "发布成功",
        description: "第一个 NFT 已生成，作品框架已上线。",
      });
      setLocation("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">发布作品</h1>
            <p className="text-muted-foreground text-sm font-light uppercase tracking-widest font-mono">艺术家工作台 / Artist Console</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setLocation('/')} className="text-muted-foreground hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> 退出并返回主页
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-white/5 bg-card/50 backdrop-blur-xl rounded-2xl">
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="artist" className="text-[10px] uppercase font-mono tracking-[0.2em] text-muted-foreground">发起人 (艺术家名字)</Label>
                  <Input 
                    id="artist" 
                    value={formData.artist}
                    onChange={e => setFormData(prev => ({...prev, artist: e.target.value}))}
                    placeholder="输入您的真实姓名或艺名" 
                    required 
                    className="bg-white/5 border-white/10 h-12 rounded-xl" 
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-[10px] uppercase font-mono tracking-[0.2em] text-muted-foreground">作品名称</Label>
                  <Input 
                    id="title" 
                    value={formData.title}
                    onChange={e => setFormData(prev => ({...prev, title: e.target.value}))}
                    placeholder="为您的创作命名" 
                    required 
                    className="bg-white/5 border-white/10 h-12 rounded-xl" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="concept" className="text-[10px] uppercase font-mono tracking-[0.2em] text-muted-foreground">作品理念</Label>
                <Textarea 
                  id="concept" 
                  value={formData.concept}
                  onChange={e => setFormData(prev => ({...prev, concept: e.target.value}))}
                  placeholder="简述作品背后的核心思想..." 
                  className="min-h-[100px] bg-white/5 border-white/10 rounded-xl py-4" 
                  required 
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="link" className="text-[10px] uppercase font-mono tracking-[0.2em] text-muted-foreground">3D 动态图形提交链接 (p5.js Editor 等)</Label>
                <div className="flex gap-3">
                  <Input 
                    id="link" 
                    value={formData.link}
                    onChange={e => setFormData(prev => ({...prev, link: e.target.value}))}
                    placeholder="https://editor.p5js.org/..." 
                    className="bg-white/5 border-white/10 h-12 rounded-xl flex-1" 
                    required 
                  />
                  <Button type="button" variant="outline" className="h-12 w-12 rounded-xl border-white/10"><Upload className="w-5 h-5" /></Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-mono tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Users className="w-3 h-3" /> 共创人数设置
                  </Label>
                  <Input 
                    type="number" 
                    min="1" 
                    step="1" 
                    value={formData.creators}
                    onChange={e => setFormData(prev => ({...prev, creators: e.target.value}))}
                    placeholder="设定最大参与人数" 
                    className="bg-white/5 border-white/10 h-12 rounded-xl" 
                    required 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-mono tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Percent className="w-3 h-3" /> 参与者分成份额
                  </Label>
                  <Input 
                    type="number" 
                    min="1" 
                    step="1" 
                    value={formData.share}
                    onChange={e => setFormData(prev => ({...prev, share: e.target.value}))}
                    placeholder="例如 50" 
                    className="bg-white/5 border-white/10 h-12 rounded-xl" 
                    required 
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full h-14 text-lg font-mono uppercase tracking-widest bg-primary hover:bg-primary/90 rounded-xl" disabled={loading}>
                  {loading ? "正在同步区块链数据..." : "提交"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
