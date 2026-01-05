import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";

const keywords = [
  { text: "INHERITANCE", opacity: "opacity-100" },
  { text: "BLOCKCHAIN", opacity: "opacity-70" },
  { text: "TRUSTLESS", opacity: "opacity-50" },
  { text: "SECURE", opacity: "opacity-35" },
  { text: "AUTOMATED", opacity: "opacity-25" },
];

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex items-center">
            <div className="px-2 md:px-4 lg:px-6">
            <div className="space-y-0">
              {keywords.map((word, index) => (
                <motion.div
                  key={word.text}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                >
                  <span
                    className={`block font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.85] tracking-tighter text-foreground ${word.opacity}`}
                  >
                    {word.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </main>

        {/* Enter button - bottom right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="fixed bottom-8 right-8"
        >
          <Link 
            to="/hub"
            className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-sm font-medium tracking-widest">ENTER</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}
