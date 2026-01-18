import { useState, useEffect, useCallback } from "react";
import { Contract } from "ethers";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Loader2, FileX, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/PageTransition";
import { InheritanceCard } from "@/components/InheritanceCard";
import { WalletButton } from "@/components/WalletButton";
import { useWalletContext } from "@/contexts/WalletContext";
import { FACTORY_ADDRESS, FACTORY_ABI, INHERITANCE_ABI } from "@/lib/contracts";

interface ContractInfo {
  address: string;
  owner: string;
  heir: string;
  isDead: boolean;
  inherited: boolean;
}

export default function List() {
  const { provider, address: userAddress, chainId } = useWalletContext();
  const [contracts, setContracts] = useState<ContractInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchInstances = useCallback(async () => {
    if (!provider) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
      const allInstances: string[] = await factory.getAllInheritances();
      
      // Fetch owner, heir, isDead, inherited for each contract
      const contractInfos = await Promise.all(
        allInstances.map(async (addr) => {
          try {
            const contract = new Contract(addr, INHERITANCE_ABI, provider);
            const [owner, heir, isDead, inherited] = await Promise.all([
              contract.owner(),
              contract.heir(),
              contract.isDead(),
              contract.inherited(),
            ]);
            return { address: addr, owner, heir, isDead, inherited };
          } catch {
            return { address: addr, owner: "", heir: "", isDead: false, inherited: false };
          }
        })
      );
      
      setContracts(contractInfos.reverse());
    } catch (err) {
      console.error("Failed to fetch instances:", err);
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances, refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger((t) => t + 1);

  // Filter and categorize contracts
  const userLower = userAddress?.toLowerCase() || "";
  
  // Contracts where user is owner
  const ownerContracts = contracts.filter(
    (c) => c.owner.toLowerCase() === userLower
  );
  
  // Contracts where user is heir (and not owner)
  const heirContracts = contracts.filter(
    (c) => c.heir.toLowerCase() === userLower && c.owner.toLowerCase() !== userLower
  );
  
  // Sort: claimable (isDead & not inherited) first, then can check-in (not isDead & not inherited), then inherited
  const sortContracts = (arr: ContractInfo[]) => {
    return [...arr].sort((a, b) => {
      // Inherited contracts go last
      if (a.inherited !== b.inherited) return a.inherited ? 1 : -1;
      // isDead (claimable) contracts go first
      if (a.isDead !== b.isDead) return a.isDead ? -1 : 1;
      return 0;
    });
  };
  
  const sortedOwnerContracts = sortContracts(ownerContracts);
  const sortedHeirContracts = sortContracts(heirContracts);
  
  const hasContracts = sortedOwnerContracts.length > 0 || sortedHeirContracts.length > 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between">
          <Link 
            to="/hub"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium tracking-widest">BACK</span>
          </Link>
          <WalletButton />
        </header>

        {/* Main content */}
        <main className="flex-1 pt-24 pb-20 px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl">
            {/* Title & Actions */}
            <div className="flex items-center justify-between mb-8">
              <motion.h1
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.85] tracking-tighter"
              >
                MANAGE
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3"
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  刷新
                </Button>
                <Button asChild size="sm" className="gap-2">
                  <Link to="/create">
                    <Plus className="h-4 w-4" />
                    创建
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* List */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !hasContracts ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed border-border rounded-xl"
              >
                <FileX className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">暂无您的遗产合约</p>
                <p className="text-sm mb-6">创建您的第一个遗产合约</p>
                <Button asChild>
                  <Link to="/create">创建遗产</Link>
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-10">
                {/* Owner section */}
                {sortedOwnerContracts.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-lg font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                      <span className="text-foreground">作为所有者</span>
                      <span className="text-sm font-normal">({sortedOwnerContracts.length})</span>
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {sortedOwnerContracts.map((contract, index) => (
                        <motion.div
                          key={contract.address}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                        >
                          <InheritanceCard address={contract.address} onUpdate={fetchInstances} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* Heir section */}
                {sortedHeirContracts.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-lg font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                      <span className="text-foreground">作为继承人</span>
                      <span className="text-sm font-normal">({sortedHeirContracts.length})</span>
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {sortedHeirContracts.map((contract, index) => (
                        <motion.div
                          key={contract.address}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                        >
                          <InheritanceCard address={contract.address} onUpdate={fetchInstances} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 px-6 md:px-12 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">
            {chainId === 11155111 ? "Sepolia Testnet" : chainId ? `Chain ${chainId}` : ""}
          </span>
        </footer>
      </div>
    </PageTransition>
  );
}
