import { Project } from "@/lib/mock-data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface ArtworkCardProps {
  project: Project;
}

export function ArtworkCard({ project }: ArtworkCardProps) {
  const [, setLocation] = useLocation();

  const getStatusLabel = () => {
    switch(project.status) {
      case "active": return "共创中";
      case "completed": return "已完成";
      case "sold": return "已售罄";
      default: return project.status;
    }
  };

  const getButtonLabel = () => {
    switch(project.status) {
      case "active": return "开始共创";
      case "completed": return "开始收藏";
      case "sold": return "查看作品";
      default: return "详情";
    }
  };

  const getButtonClass = () => {
    switch(project.status) {
      case "active": return "bg-primary hover:bg-primary/90 text-primary-foreground";
      case "completed": return "bg-accent hover:bg-accent/90 text-accent-foreground";
      case "sold": return "bg-secondary hover:bg-secondary/90 text-secondary-foreground";
      default: return "";
    }
  };

  return (
    <Card 
      className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card/80 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 cursor-pointer"
      onClick={() => setLocation(`/project/${project.id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-black">
        {project.iframeUrl ? (
            <div className="w-full h-full relative overflow-hidden bg-black">
              {/* Reset scaling for home page cards to ensure full visibility */}
              <iframe 
                src={`${project.iframeUrl}?click=none&header=none&display=none&hide-header=true&showHeader=false&show-header=false&toolbar=0&embed=true&show-attribution=false&author=none`} 
                className="w-full h-[150%] absolute -top-[25%] border-none pointer-events-none scale-100"
                style={{ transformOrigin: 'center top' }}
                title="p5js preview"
              />
              <div className="absolute top-0 left-0 w-full h-[25%] bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
            </div>
        ) : (
          <img 
            src={project.image} 
            alt={project.title} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
        
        <div className="absolute top-3 right-3">
          <Badge variant={project.status === "active" ? "default" : "secondary"} className={`uppercase tracking-wider font-mono text-[10px] ${project.status === 'active' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-muted text-muted-foreground'}`}>
            <span className="flex items-center gap-1">
              {project.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
              {getStatusLabel()}
            </span>
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-sans font-bold text-lg leading-tight group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <User className="w-3 h-3" />
            {project.artist}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs font-mono border-t border-white/5 pt-3">
          <div className="space-y-1">
            {project.status === "active" ? (
              <>
                <span className="text-muted-foreground block">分成份额</span>
                <span className="text-accent font-semibold">{project.splitsShare}%</span>
              </>
            ) : (
              <>
                <span className="text-muted-foreground block">{project.status === 'sold' ? '售出价格' : '价格'}</span>
                <span className="text-foreground font-semibold flex items-center">
                  Ξ {project.price} ETH
                </span>
              </>
            )}
          </div>
          <div className="space-y-1 text-right">
            <span className="text-muted-foreground block">参与人数</span>
            <span className="text-foreground font-semibold flex items-center justify-end gap-1">
              <Users className="w-3 h-3" />
              {project.creators}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className={`w-full transition-all font-mono text-xs uppercase tracking-wide rounded-xl h-11 ${getButtonClass()}`}>
          {getButtonLabel()}
          <ArrowUpRight className="w-3 h-3 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}
