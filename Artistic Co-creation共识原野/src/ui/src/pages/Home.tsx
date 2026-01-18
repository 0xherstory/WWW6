import { useState } from "react";
import { ArtworkCard } from "@/components/ArtworkCard";
import { getSessionProjects } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Globe } from "lucide-react";

export default function Home() {
  const [filter, setFilter] = useState<{status: string, category: string}>({status: "all", category: "all"});
  const [showFilters, setShowFilters] = useState(false);

  const projects = getSessionProjects();
  const filteredProjects = projects.filter(p => {
    const statusMatch = filter.status === "all" || p.status === filter.status;
    const categoryMatch = filter.category === "all" || p.category === filter.category;
    return statusMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Globe className="w-3 h-3" />
            <span>生成式艺术的未来是协作</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-5xl mx-auto leading-tight text-balance">
            共识原野：艺术共创与共识
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed">
            本项目是对传统艺术权力机制的一次“数字迁徙”。我们剥离了美术馆与画廊作为中介的“过滤器”职能，将观看的权力归还于众。在这片由算法驱动的原始丛林中，每一次交互不再是被动的审美消费，而是一次主动的“共创”。
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col gap-6">
          {/* Row 1: Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="搜索作品..." className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl" />
          </div>

          {/* Row 2: Stats */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-sans">所有合集</span>
            <span className="text-sm font-mono text-muted-foreground">({projects.length}个结果)</span>
          </div>

          {/* Row 3: Filter Toggle */}
          <div className="flex">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className={`font-mono text-xs uppercase tracking-widest gap-2 rounded-xl h-11 px-6 ${showFilters ? 'bg-white/10' : ''}`}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? '隐藏过滤器' : '显示过滤器'}
            </Button>
          </div>

          {/* Conditional Filters Row */}
          {showFilters && (
            <div className="flex flex-wrap gap-12 p-8 rounded-2xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-4">
              <div className="space-y-4 min-w-[200px]">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">产品状态</span>
                <div className="flex flex-col gap-3">
                  {["all", "active", "completed", "sold"].map((s) => (
                    <div 
                      key={s} 
                      className={`text-sm cursor-pointer hover:text-primary transition-colors ${filter.status === s ? 'text-primary font-bold underline underline-offset-4' : 'text-muted-foreground'}`}
                      onClick={() => setFilter({...filter, status: s})}
                    >
                      {s === 'all' ? '全部' : s === 'active' ? '共创中' : s === 'completed' ? '已完成' : '已售罄'}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 min-w-[200px]">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">收藏类别</span>
                <div className="flex flex-col gap-3">
                  {["all", "history", "other"].map((c) => (
                    <div 
                      key={c} 
                      className={`text-sm cursor-pointer hover:text-primary transition-colors ${filter.category === c ? 'text-primary font-bold underline underline-offset-4' : 'text-muted-foreground'}`}
                      onClick={() => setFilter({...filter, category: c})}
                    >
                      {c === 'all' ? '全部' : c === 'history' ? '历史' : '其他'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((project) => (
            <ArtworkCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20 px-6 bg-black/40 mt-20">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Top Row: Brand & Description - Centered for symmetry */}
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-primary text-xl font-bold uppercase tracking-tight">
              Artistic Co-creation
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              当您点击屏幕，即是在打破传统机构设置的“展墙”隔离。每一尊生成的灵魂面容都是观众与艺术家共建生态的物证。这些互动将被永久锚定在区块链上，转化为独一无二的共创 NFT。在这里，艺术不再是单向的权力输出，而是由集体意识实时编织、由链上共识永久记录的共生原野。
            </p>
          </div>
          
          {/* Bottom Row: Platform (Left) & Community (Right) - Symmetrical */}
          <div className="flex justify-between items-start px-4 md:px-20 border-t border-white/5 pt-12">
            <div className="text-left">
              <h4 className="font-mono text-sm uppercase tracking-widest mb-6">平台</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="hover:text-primary transition-colors cursor-pointer">发布项目</li>
                <li className="hover:text-primary transition-colors cursor-pointer">收益看板</li>
              </ul>
            </div>
            
            <div className="text-right">
              <h4 className="font-mono text-sm uppercase tracking-widest mb-6">社区</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="hover:text-primary transition-colors cursor-pointer">Discord</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Twitter (X)</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
