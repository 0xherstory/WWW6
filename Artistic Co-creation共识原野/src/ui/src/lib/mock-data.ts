import geoArt from "@assets/generated_images/abstract_generative_3d_geometry_art.png";
import fluidArt from "@assets/generated_images/fluid_simulation_art.png";
import networkArt from "@assets/generated_images/algorithmic_network_structure.png";

export interface Project {
  id: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  creators: number;
  status: "active" | "completed" | "sold";
  category: "history" | "other";
  description: string;
  content?: string;
  splitsShare: number;
  iframeUrl?: string;
  hasCustomGraphic?: boolean;
  history?: Array<{
    id: number;
    title: string;
    desc: string;
    time: string;
    hash: string;
    type: "artist" | "participant" | "completed" | "sale";
  }>;
}

// Global state to store session-based projects for mockup
export const getSessionProjects = (): Project[] => {
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('session_projects') : null;
    let projects = stored ? JSON.parse(stored) : MOCK_PROJECTS;
    
    // Ensure projects is an array
    if (!Array.isArray(projects)) {
      projects = MOCK_PROJECTS;
    }
    
    // Recalculate creators count based on history for consistency across the app
    return projects.map((p: Project) => {
      // Only update creators count from history if the project is completed or sold
      if (p && (p.status === 'completed' || p.status === 'sold') && Array.isArray(p.history)) {
        const participantCount = p.history.filter((h: any) => h && h.type === 'participant').length;
        
        return {
          ...p,
          creators: participantCount
        };
      }
      
      // For active projects (or any other status), keep the original creators count
      // This allows 'active' projects to show the target/limit set by the artist
      return p;
    });
  } catch (e) {
    console.error("Failed to load projects", e);
    return MOCK_PROJECTS;
  }
};

export const addSessionProject = (project: Project) => {
  const projects = getSessionProjects();
  const updated = [project, ...projects];
  if (typeof window !== 'undefined') {
    localStorage.setItem('session_projects', JSON.stringify(updated));
  }
};

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "演算法下的共生原野",
    artist: "0xArchitecture",
    image: geoArt,
    price: 0,
    creators: 12,
    status: "active",
    category: "history",
    splitsShare: 50,
    iframeUrl: "https://editor.p5js.org/chenjingfei2020ug/full/Xsl3dttAS",
    description: `在这件实时交互装置中，我试图构建一个“后人类时代”的虚拟生态模型。作品通过高密度的巨型几何锥体阵列，隐喻了地球生态系统中那些沉默而庞大的底层基石——碳循环、地质构造与数据流。这些高耸的支柱不再是冰冷的几何体，而是通过**生物性频率（Biological Frequency）上下悦动的光球进行呼吸，模拟出一种超越有机物界限的“生命脉动”。\n\n当观者介入这一系统并触发动物面容的生成，实际上是在参与一场关于物种边界的探讨。这些精致的面部几何体并非孤立存在，它们在错落的 3D 纵深空间中寻找位点，与宏大的环境支柱形成一种脆弱而微妙的张力。这映射了当代地球生态的真实现状：生命个体如何在日益人工化的环境尺度中，通过数据确权来找寻其独一无二的栖息维度。\n\n作品将 Web3 的钱包连接行为转化为一种“入场券”，探讨了在生态危机面前，我们是否能通过数字契约重构人、动物与环境之间的共生关系。`,
    history: [
      { id: 1, title: "艺术家发起作品", desc: "0xArchitecture 发布了初始作品。", time: "2026-01-01 10:00:00", hash: "0x82...f91a", type: "artist" }
    ]
  },
  {
    id: "4",
    title: "破茧与重构",
    artist: "CyberArtist",
    image: networkArt,
    price: 0.25,
    creators: 32,
    status: "completed",
    category: "other",
    splitsShare: 0,
    iframeUrl: "https://editor.p5js.org/chenjingfei2020ug/full/D2f4WRu48",
    description: `1. 结构与宿命：父权制的灰色秩序\n在作品的初始状态，一个由冷灰色点阵构成的完美球体悬浮于虚空。这代表了父权制（Patriarchy）在当代社会中所构建的无形却严密的准则。但在女性主义视角下，它往往隐喻一种“闭环的困境”——一种被预设好的、整齐划一的女性角色框架。这些灰色的点，是社会对女性身体、言论与职业路径的精细网格化管理，冰冷且难以撼动。\n\n2. 行动与觉醒：身体的介入\n艺术的魅力在于互动（Intervention）。当观众点击画布，原本寂静的灰色系统被打破。每一次点击，都是一次女性自我的主体性表达。\n\n粉色节点：并非传统的柔弱符号，而是象征着女性生命力（Vitality）的爆发。\n连线：通过代码生成的连线，模拟了当代女性主义中的“情谊”（Sisterhood）与联结。这种联结不再是孤立的反抗，而是在数字空间中交织成一张充满韧性的网络。\n\n3. 冲破与溢出：溢出框架的叙事\n作品最核心的视觉逻辑在于“溢出”。当粉色能量触及球体边缘，它会生长出放射状的线条，直接刺穿灰色的几何边界。 这象征着当代女性不再满足于在现有的框架内寻求平衡，而是致力于“摧毁边界”。它代表了那些无法被旧有语境定义的身份、欲望与力量，正以一种不可逆转的态势冲向更广阔的荒野。\n\n4. NFT与唯一性：不可替代的觉醒\n结合 NFT 的技术特性，每一位观众互动生成的最终形态都是独一无二的。这不仅是数据的记录，更是对“每个个体觉醒历程不可替代”的隐喻。正如女性主义不是一个标准化的答案，而是一场千人千面的、动态演变的持续运动。这个作品记录下的，正是那一瞬间——当女性意识到自己拥有改变整个系统结构的力量时，世界所呈现出的璀璨形态。`,
    history: [
      { id: 1, title: "艺术家发起作品", desc: "CyberArtist 发布了初始作品。", time: "2026-01-01 12:00:00", hash: "0x3a...b2c1", type: "artist" },
      { id: 2, title: "参与者共创", desc: "参与者 0x4f... 完成了共创贡献。", time: "2026-01-02 09:00:00", hash: "0x7d...e9a2", type: "participant" },
      { id: 3, title: "作品完成", desc: "CyberArtist 确认作品已完成并申请出售。", time: "2026-01-02 14:00:00", hash: "0x2c...f3d4", type: "completed" }
    ]
  },
  {
    id: "3",
    title: "流体铬合金",
    artist: "FluxState",
    image: fluidArt,
    price: 0.12,
    creators: 8,
    status: "sold",
    category: "history",
    splitsShare: 0,
    description: `由社区输入冻结在时间中的流体动力学模拟。流体模拟采用了最新的物理引擎，模拟了液态金属在零重力环境下的动态行为。`,
    history: [
      { id: 1, title: "艺术家发起作品", desc: "FluxState 发布了初始作品。", time: "2025-12-20 10:00:00", hash: "0x1a...e5d2", type: "artist" },
      { id: 2, title: "参与者共创", desc: "参与者协作调整了流体参数。", time: "2025-12-25 15:00:00", hash: "0x9f...a3c8", type: "participant" },
      { id: 3, title: "作品完成", desc: "FluxState 确认作品已完成并申请出售。", time: "2025-12-30 11:00:00", hash: "0x6b...c4d9", type: "completed" },
      { id: 4, title: "作品已售出", desc: "收藏家 0xRich 购买。", time: "2026-01-01 18:00:00", hash: "0x4e...b7d1", type: "sale" }
    ]
  }
];
