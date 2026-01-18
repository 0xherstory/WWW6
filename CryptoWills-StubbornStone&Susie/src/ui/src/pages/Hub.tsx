import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { useWalletContext } from "@/contexts/WalletContext";
import { WalletButton } from "@/components/WalletButton";
import { FACTORY_ADDRESS } from "@/lib/contracts";

const navItems = [
  { labelCn: "新建", label: "CREATE", path: "/create" },
  { labelCn: "管理", label: "MANAGE", path: "/list" },
  { labelCn: "合约", label: "CONTRACT", path: `https://sepolia.etherscan.io/address/${FACTORY_ADDRESS}`, external: true },
];

export default function Hub() {
  const { chainId } = useWalletContext();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium tracking-widest">BACK</span>
          </Link>
          <WalletButton />
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center">
          <div className="px-6 md:px-12 lg:px-20">
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline gap-4 md:gap-6"
                    >
                      <span className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-[0.85] tracking-tighter">
                        {item.labelCn}
                      </span>
                      <span className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-muted-foreground group-hover:text-primary transition-colors leading-[0.85] tracking-tighter">
                        {item.label}
                      </span>
                    </a>
                  ) : (
                    <Link 
                      to={item.path}
                      className="group flex items-baseline gap-4 md:gap-6"
                    >
                      <span className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-[0.85] tracking-tighter">
                        {item.labelCn}
                      </span>
                      <span className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-muted-foreground group-hover:text-primary transition-colors leading-[0.85] tracking-tighter">
                        {item.label}
                      </span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 px-6 md:px-12 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">
            {chainId === 11155111 ? "Sepolia Testnet" : chainId ? `Chain ${chainId}` : ""}
          </span>
          <span className="hidden sm:block">
            将您的数字资产安全地传承给下一代。基于智能合约的去中心化继承协议。
          </span>
        </footer>
      </div>
    </PageTransition>
  );
}
