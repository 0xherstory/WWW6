import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { getSessionProjects, Project } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, Users, Play, Loader2, Info, History, Wallet, Lock, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WalletList } from "@/components/WalletList";

export default function ProjectDetail() {
  const [, params] = useRoute("/project/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [viewState, setViewState] = useState<"detail" | "completed_setup">("detail");
  const [mintingState, setMintingState] = useState<"idle" | "minting" | "success">("idle");
  const [finishPrice, setFinishPrice] = useState("1");
  const [dynamicHistory, setDynamicHistory] = useState<any[]>([]);
  
  // Payment Flow States
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"wallets" | "credentials" | "confirm">("wallets");
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [accountBalance] = useState(14.52);
  const [gasEstimate] = useState(0.002);
  
  const [isArtist, setIsArtist] = useState(false);
  
  // Force update hack for iframe
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (params?.id) {
      const projects = getSessionProjects();
      const p = projects.find((proj: any) => proj.id === params.id);
      
      const shouldUpdate = !project || 
                          project.id !== p?.id || 
                          (p?.history?.length !== project.history?.length);

      if (p && shouldUpdate) {
        setProject(p);
        
        // Check if current user is the artist
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.role === 'artist' && user.username === p.artist) {
            setIsArtist(true);
          } else {
            setIsArtist(false);
          }
        }

        const cleanHistory = (p.history || []).map((h: any) => {
          let cleanHash = (h.hash || "").toString();
          cleanHash = cleanHash.replace(/NFT#/g, "").replace(/NFT：/g, "").replace(/NFT: /g, "").replace(/NFT:/g, "");
          
          return {
            ...h,
            hash: cleanHash ? `NFT: ${cleanHash}` : ""
          };
        }).sort((a: any, b: any) => 
          new Date(b.time).getTime() - new Date(a.time).getTime()
        );
        
        // Calculate dynamic participant count for completed/sold projects
        if (p.status === 'completed' || p.status === 'sold') {
           const participantCount = cleanHistory.filter((h: any) => h.type === 'participant').length;
           // If we have history participants, we update the creators count
           // But we need to be careful not to overwrite if it's already correct or if we want to preserve initial state
           // However, user requested actual count for completed projects
           if (participantCount > 0 && participantCount !== p.creators) {
              setProject(prev => prev ? { ...prev, ...p, history: cleanHistory, creators: participantCount } : { ...p, history: cleanHistory, creators: participantCount });
           } else {
              setProject({ ...p, history: cleanHistory });
           }
           setDynamicHistory(cleanHistory);
        } else {
           setProject(p);
           setDynamicHistory(cleanHistory);
        }
      }
    }
  }, [params?.id, project?.history?.length]);

  const handleStudioComplete = () => {
    // Instead of closing a dialog, we just exit the "mode"
    // The main iframe was already there, so we just force a refresh
    setIsCanvasOpen(false);
    setMintingState("minting");
    
    // Force iframe reload to simulate update
    // We add a random component to ensure it's treated as a fresh navigation
    setIframeKey(prev => prev + 1);
    
    setTimeout(() => {
      const storedUser = localStorage.getItem('user');
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const userName = userData ? (userData.username || userData.nickname || "0xCollaborator") : "0xCollaborator";

      const newRecord = {
        id: Date.now(),
        title: "参与者共创",
        desc: `${userName} 完成了一次 3D 交互共创贡献。`,
        time: new Date().toLocaleString(),
        hash: `0x${Math.random().toString(16).slice(2, 10)}...`,
        type: "participant"
      };
      
      const updatedHistory = [newRecord, ...dynamicHistory];
      setDynamicHistory(updatedHistory);
      
      if (project) {
        const projects = getSessionProjects();
        const updatedProjects = projects.map(p => 
          p.id === project.id ? { 
            ...p, 
            history: updatedHistory,
            hasCustomGraphic: true 
          } : p
        );
        localStorage.setItem('session_projects', JSON.stringify(updatedProjects));
        setProject(prev => prev ? { ...prev, history: updatedHistory, hasCustomGraphic: true } : null);
      }
      
      setMintingState("success");
      toast({ title: "协作成功", description: "新的共创 NFT 已记录在历程中。" });
    }, 2000);
  };

  const handlePurchase = () => {
    setIsPaymentOpen(true);
    setPaymentStep("wallets");
  };

  const handleWalletSelect = (walletId: string) => {
    setSelectedWallet(walletId);
    setPaymentStep("credentials");
  };

  const handleWalletLogin = () => {
    setPaymentStep("confirm");
  };

  const handleConfirmPayment = () => {
    setMintingState("minting");
    setTimeout(() => {
      // Get current user details from session or mock wallet
      const storedUser = localStorage.getItem('user');
      let buyerName = "0xCollector";
      
      // Try to get wallet address from context/state first (if we had it in global state)
      // Since we don't have global wallet state, we check if user logged in via wallet
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        buyerName = userData.username || userData.walletAddress || "0xCollector";
      }
      
      // If we have a selected wallet flow, use a mocked address for that specific wallet type
      if (selectedWallet) {
         // Create a deterministic but realistic looking address based on timestamp
         buyerName = `0x${Math.floor(Date.now() / 1000).toString(16)}...${Math.floor(Math.random() * 10000).toString(16)}`;
      }

      const projects = getSessionProjects();
      const updatedHistory = [
        {
          id: Date.now(),
          title: "作品已售出",
          desc: `收藏家 ${buyerName} 购买。`,
          time: new Date().toLocaleString(),
          hash: `0x${Math.random().toString(16).slice(2, 10)}...`,
          type: "sale"
        },
        ...dynamicHistory
      ];
      
      const updatedProjects = projects.map(p => 
        p.id === project?.id ? { ...p, status: "sold" as const, history: updatedHistory } : p
      );
      localStorage.setItem('session_projects', JSON.stringify(updatedProjects));
      
      setMintingState("success");
      setIsPaymentOpen(false);
      setLocation("/");
      toast({ title: "收藏成功", description: "您已成功购买此作品。" });
    }, 2000);
  };

  if (!project) return <div className="p-20 text-center">加载中...</div>;

  return (
    <div className="min-h-screen pt-10 pb-20 px-6 max-w-7xl mx-auto">
      <Button variant="ghost" className="mb-8 hover:bg-white/5" onClick={() => setLocation('/')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> 返回画廊
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <div className="space-y-6">
          <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black shadow-2xl">
            {project.iframeUrl ? (
               <div className="w-full h-full relative overflow-hidden bg-black">
                 {/* Adjusted iframe scaling and positioning for better visibility */}
                 {/* Using t=${iframeKey} to force reload when studio closes */}
                 <iframe 
                  key={iframeKey} 
                  src={`${project.iframeUrl}?click=none&header=none&display=none&hide-header=true&showHeader=false&show-header=false&toolbar=0&embed=true&show-attribution=false&author=none&t=${iframeKey}`} 
                  className="w-full h-[150%] absolute -top-[25%] border-none pointer-events-none scale-100"
                  style={{ transformOrigin: 'center top' }}
                  title="3D canvas"
                 />
                 {/* Adjusted mask to be less intrusive but still hide top bars */}
                 <div className="absolute top-0 left-0 w-full h-[15%] bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
                 {/* Overlay to hide the "translation/language" icon in top right - matches Fullscreen studio fix */}
                 <div className="absolute top-0 right-0 w-24 h-16 bg-black z-20 pointer-events-none" />
                 
                 {project.hasCustomGraphic && (
                   <div className="absolute bottom-4 right-4 z-20 px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-[10px] font-mono text-primary animate-pulse">
                     已合并最新共创状态
                   </div>
                 )}
               </div>
            ) : (
               <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            )}
            
            {mintingState === "minting" && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col gap-4 z-20">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="font-mono text-sm uppercase tracking-widest text-white">区块链交互中...</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {viewState === "detail" ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="font-mono text-xs py-1 px-3 border-primary/30 text-primary uppercase tracking-widest">
                    {project.status === "active" ? "共创中" : project.status === "completed" ? "已完成" : "已售罄"}
                  </Badge>
                  <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
                    <Users className="w-3 h-3" />
                    {project.creators} 位参与者
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-gradient w-fit">
                  {project.title}
                </h1>
                <p className="font-mono text-sm text-muted-foreground flex items-center gap-2">
                  由 <span className="text-foreground border-b border-white/20 pb-0.5">{project.artist}</span> 发起
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Info className="w-3 h-3" /> 作品理念
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground/80 font-light whitespace-pre-wrap border-l-2 border-primary/30 pl-4">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white/5 border border-white/5 space-y-4">
                 {project.status === "active" ? (
                    <div className="flex justify-between items-center font-mono text-sm">
                      <span className="text-muted-foreground">分成份额</span>
                      <span className="text-accent">{project.splitsShare}% 分配给参与者</span>
                    </div>
                 ) : (
                    <>
                      <div className="flex justify-between items-center font-mono text-sm">
                        <span className="text-muted-foreground">{project.status === 'sold' ? '售出价格' : '当前价格'}</span>
                        <span className="text-xl font-bold">Ξ {project.status === 'completed' ? finishPrice : project.price} ETH</span>
                      </div>
                      <div className="flex justify-between items-center font-mono text-xs text-muted-foreground">
                        <span>预估 Gas 费</span>
                        <span>~0.002 ETH</span>
                      </div>
                      
                      {project.status === "sold" && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                          <h5 className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            收入分配 (通过 Splits.org)
                          </h5>
                          
                          <div className="space-y-2 font-mono text-xs">
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">艺术家 ({project.creators > 0 ? (100 - project.splitsShare) : 100}%)</span>
                                <span className="text-white">Ξ {project.creators > 0 ? (project.price * (1 - project.splitsShare / 100)).toFixed(4) : project.price.toFixed(4)} ETH</span>
                             </div>
                             
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">参与者总计 ({project.creators > 0 ? project.splitsShare : 0}%)</span>
                                <span className="text-white">Ξ {project.creators > 0 ? (project.price * (project.splitsShare / 100)).toFixed(4) : "0.0000"} ETH</span>
                             </div>

                             {project.creators > 0 && (
                               <div className="flex justify-between items-center pl-4 border-l border-white/10 text-muted-foreground/70">
                                  <span>每位参与者 (共 {project.creators} 人)</span>
                                  <span>Ξ {((project.price * (project.splitsShare / 100)) / project.creators).toFixed(4)} ETH</span>
                               </div>
                             )}
                          </div>
                          
                          <div className="text-[10px] text-muted-foreground/50 pt-1">
                             * 合约自动执行分账，直接转入参与者钱包
                          </div>
                        </div>
                      )}
                    </>
                 )}
              </div>

              <div className="space-y-4">
                {project.status === "active" ? (
                  <div className="flex flex-col gap-4">
                    {!isArtist ? (
                      <Button 
                        size="lg" 
                        className="w-full text-lg font-mono uppercase tracking-wide h-14 bg-primary hover:bg-primary/90 rounded-xl"
                        onClick={() => setIsCanvasOpen(true)}
                      >
                        <Play className="w-5 h-5 mr-2 fill-current" />
                        进入 3D 工作室
                      </Button>
                    ) : (
                      <Button 
                        size="lg"
                        className="w-full h-14 bg-accent text-accent-foreground font-mono uppercase tracking-widest rounded-xl"
                        onClick={() => setViewState("completed_setup")}
                      >
                        确认已完成并申请出售
                      </Button>
                    )}
                  </div>
                ) : project.status === "completed" ? (
                  <Button 
                    size="lg" 
                    className="w-full text-lg font-mono uppercase tracking-wide h-14 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
                    onClick={handlePurchase}
                  >
                    确定收藏
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full h-14 font-mono uppercase tracking-widest border-white/10 rounded-xl" disabled>
                    已被藏家收入
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
               <h2 className="text-3xl font-bold">标记作品为已完成</h2>
               <div className="space-y-4">
                 <div className="space-y-2">
                   <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">设置作品出售价格 (ETH)</Label>
                   <Input 
                     type="number" 
                     min="1"
                     step="1"
                     value={finishPrice} 
                     onChange={(e) => {
                       const val = e.target.value;
                       // Allow empty string for typing, otherwise enforce integer >= 1
                       if (val === "" || (parseInt(val) >= 1 && !val.includes('.'))) {
                          setFinishPrice(val);
                       }
                     }}
                     className="bg-white/5 border-white/10 h-12 rounded-xl"
                   />
                 </div>
                 <div className="flex gap-4">
                   <Button variant="ghost" className="flex-1" onClick={() => setViewState("detail")}>取消</Button>
                   <Button className="flex-[2] bg-primary rounded-xl" onClick={() => {
                     setMintingState("minting");
                     setTimeout(() => {
                       const finalRecord = {
                         id: Date.now(),
                         title: "作品完成",
                         desc: `${project.artist} 确认作品已完成并申请出售。`,
                         time: new Date().toLocaleString(),
                         hash: `0x${Math.random().toString(16).slice(2, 10)}...`,
                         type: "completed"
                       };
                       
                       const updatedHistory = [finalRecord, ...dynamicHistory];
                       
                       // Recalculate participant count
                       const participantCount = updatedHistory.filter((h: any) => h.type === 'participant').length;
                       
                       const projects = getSessionProjects();
                       const updatedProjects = projects.map(p => 
                         p.id === project.id ? { 
                            ...p, 
                            status: 'completed' as const, 
                            history: updatedHistory, 
                            price: parseFloat(finishPrice),
                            creators: participantCount // Update creators count on completion
                         } : p
                       );
                       localStorage.setItem('session_projects', JSON.stringify(updatedProjects));
                       
                       setMintingState("success");
                       setLocation("/");
                     }, 2000);
                   }}>提交收藏</Button>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-20 pt-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-8">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <History className="w-6 h-6 text-primary" /> 作品来源与历程
          </h3>
          <div className="space-y-4">
             {dynamicHistory.map((item) => (
               <div key={item.id} className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-white/10 text-white">
                    {item.type === 'artist' ? '启' : item.type === 'sale' ? '售' : item.type === 'completed' ? '完' : '续'}
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                    <div className="flex flex-col gap-1 mt-2">
                       <p className="text-[10px] font-mono opacity-30">{item.time}</p>
                       <p className="text-[10px] font-mono opacity-30 truncate">NFT: {item.hash}</p>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Instead of a separate Dialog for 3D Studio, we use a Fullscreen Overlay mode */}
      {isCanvasOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300">
          <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-zinc-900 shrink-0">
            <span className="font-mono text-xs uppercase tracking-widest text-white">3D 工作室 - 正在共创</span>
            <Button size="sm" className="bg-accent text-accent-foreground rounded-lg" onClick={handleStudioComplete}>
              完成作品并返回网站
            </Button>
          </div>
          <div className="flex-1 relative w-full h-full">
            {/* We reuse the iframe URL here but full screen */}
             <iframe 
                src={`${project.iframeUrl}?header=none&display=none&hide-header=true&showHeader=false&show-header=false`} 
                className="w-full h-full border-none"
                title="3D Studio Fullscreen"
              />
              {/* Overlay to hide the "translation/language" icon in top right */}
              <div className="absolute top-0 right-0 w-24 h-16 bg-black z-20 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Main Page Iframe - conditionally hidden or refreshed when studio closes */}
      {!isCanvasOpen && (
        <div className="hidden">
           {/* This hidden div ensures we don't duplicate logic, 
               but actually we want the main page image to UPDATE.
               So we force a reload with a key when returning.
           */}
        </div>
      )}

      {/* Payment Flow Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-[425px] border-white/10 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>
              {paymentStep === "wallets" && "选择钱包"}
              {paymentStep === "credentials" && "钱包登录"}
              {paymentStep === "confirm" && "确认支付"}
            </DialogTitle>
            <DialogDescription>
              {paymentStep === "wallets" && "选择您的支付钱包以继续收藏"}
              {paymentStep === "credentials" && "输入您的钱包账户信息"}
              {paymentStep === "confirm" && "确认余额并完成交易"}
            </DialogDescription>
          </DialogHeader>

          {paymentStep === "wallets" && (
            <WalletList onSelect={handleWalletSelect} />
          )}

          {paymentStep === "credentials" && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                  {selectedWallet?.includes("metamask") ? "🦊" : <Wallet className="w-5 h-5 text-primary" />}
                </div>
                <div>
                  <div className="font-bold text-sm">正在连接 {selectedWallet}</div>
                  <div className="text-[10px] text-muted-foreground">需验证所有权</div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase">账户名称</Label>
                <Input placeholder="Wallet Account Name" className="bg-white/5" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase">密码</Label>
                <Input type="password" placeholder="••••••••" className="bg-white/5" />
              </div>
              <Button className="w-full mt-4" onClick={handleWalletLogin}>确认登录</Button>
              <Button variant="ghost" className="w-full" onClick={() => setPaymentStep("wallets")}>返回选择</Button>
            </div>
          )}

          {paymentStep === "confirm" && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold">Ξ {(project.price + gasEstimate).toFixed(4)}</div>
                <div className="text-sm text-muted-foreground">总计需支付</div>
              </div>
              
              <div className="space-y-2 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">当前价格</span>
                  <span className="font-mono">Ξ {project.price} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gas 预估</span>
                  <span className="font-mono">Ξ {gasEstimate} ETH</span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">账户余额</span>
                  <span className="font-mono">Ξ {accountBalance.toFixed(2)} ETH</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-primary">
                  <span>剩余余额</span>
                  <span className="font-mono">Ξ {(accountBalance - (project.price || 0) - gasEstimate).toFixed(4)} ETH</span>
                </div>
              </div>

              <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={handleConfirmPayment}>
                <Check className="w-4 h-4 mr-2" /> 确认支付
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

