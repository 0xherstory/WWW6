import { Shield, ExternalLink, Github } from "lucide-react";
import { FACTORY_ADDRESS } from "@/lib/contracts";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-auto py-8 bg-background/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-lg">DIGITAL INHERITANCE</p>
              <p className="text-xs text-muted-foreground">
                基于以太坊智能合约的数字遗产继承
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-muted-foreground">
            <a 
              href={`https://sepolia.etherscan.io/address/${FACTORY_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Etherscan
            </a>
            <a 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border/30 text-center space-y-2">
          <p className="text-xs text-muted-foreground font-mono">
            Factory: {FACTORY_ADDRESS}
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} StubbornStone & VivianToo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
