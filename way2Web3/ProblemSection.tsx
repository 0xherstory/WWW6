import { FileX, HelpCircle, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    icon: FileX,
    number: "01",
    title: "简历在 Web3 中几乎不起作用",
    description: "传统简历无法展示你的 Web3 适配能力，项目方无法判断你是否具备实际工作能力。",
  },
  {
    icon: HelpCircle,
    number: "02",
    title: "不知道适合什么岗位，无法判断自己的真实市场价值",
    description: "技能迁移路径不清晰，方向迷茫，缺乏可信的能力定价参考。",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function ProblemSection() {
  return (
    <section className="section-container py-24 md:py-32">
      <div className="grid lg:grid-cols-[1fr,2fr] gap-12 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          
          <h2 className="heading-2">
            为什么 Web2 人才
            <br />
            <span className="font-serif italic">难以进入</span> Web3？
          </h2>
        </motion.div>
        
        <div className="space-y-8">
          <motion.p 
            className="body-large max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            你有能力，但缺少被 Web3 世界识别的方式。传统的求职路径在这里不再适用。
          </motion.p>
          
          <motion.div 
            className="grid gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group flex gap-6 p-6 border border-border hover:border-accent/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <span className="text-xs font-mono text-accent">{problem.number}</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">{problem.title}</h3>
                  <p className="text-sm text-muted-foreground">{problem.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}