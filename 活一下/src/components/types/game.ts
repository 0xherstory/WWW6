export interface Position {
  x: number;
  y: number;
}

export interface Spore {
  id: string;
  position: Position;
  isCollected: boolean;
  animationDelay: number;
}

export interface EvolutionStage {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  requiredSpores: number;
  tabs?: EvolutionTab[];
  unlocked: boolean;
  icon: string;
}

export interface EvolutionTab {
  id: string;
  name: string;
  nameCn: string;
  requiredSpores: number;
  unlocked: boolean;
}

export interface GameState {
  collectedSpores: number;
  characterPosition: Position;
  currentScene: number;
  pollutionLevel: number;
  evolutionStages: EvolutionStage[];
  spores: Spore[];
  nushuUnlocked: boolean;
  showNextLevel: boolean;
}

export const INITIAL_EVOLUTION_STAGES: EvolutionStage[] = [
  {
    id: 'origin',
    name: 'Primordial State',
    nameCn: '原初环境',
    description: '觉醒 - 无个体、无边界，处于"被孕育"状态',
    requiredSpores: 5,
    unlocked: false,
    icon: '🌑',
  },
  {
    id: 'stage1',
    name: 'Symbiotic Division',
    nameCn: '共生分裂态',
    description: '萌芽 - 个体出现，形态类比：细胞分裂',
    requiredSpores: 10,
    unlocked: false,
    icon: '🔬',
  },
  {
    id: 'stage2',
    name: 'Nurturing Colony',
    nameCn: '抚育群落态',
    description: '绽放 - 群体稳定存在分工',
    requiredSpores: 15,
    tabs: [
      { id: 'care', name: 'Care', nameCn: '照料', requiredSpores: 15, unlocked: false },
      { id: 'repair', name: 'Repair', nameCn: '修复', requiredSpores: 20, unlocked: false },
      { id: 'gather', name: 'Gather', nameCn: '采集', requiredSpores: 25, unlocked: false },
    ],
    unlocked: false,
    icon: '🌸',
  },
  {
    id: 'stage3',
    name: 'Memory Weaving',
    nameCn: '记忆织网态',
    description: '共鸣 - 群体拥有"共同记忆"',
    requiredSpores: 30,
    tabs: [
      { id: 'nushu', name: 'Nüshu', nameCn: '女书', requiredSpores: 30, unlocked: false },
      { id: 'song', name: 'Songs', nameCn: '歌谣', requiredSpores: 35, unlocked: false },
      { id: 'plant', name: 'Planting', nameCn: '种植', requiredSpores: 40, unlocked: false },
      { id: 'weave', name: 'Weaving', nameCn: '编织', requiredSpores: 45, unlocked: false },
    ],
    unlocked: false,
    icon: '🕸️',
  },
  {
    id: 'stage4',
    name: 'Nurturing Civilization',
    nameCn: '孕育型文明态',
    description: '文明温柔扩张且持续发展',
    requiredSpores: 50,
    tabs: [
      { id: 'ai', name: 'AI', nameCn: '人工智能', requiredSpores: 50, unlocked: false },
      { id: 'heal', name: 'Self-Healing', nameCn: '细胞自愈', requiredSpores: 55, unlocked: false },
      { id: 'symbiosis', name: 'Symbiosis', nameCn: '环境共生', requiredSpores: 60, unlocked: false },
    ],
    unlocked: false,
    icon: '🏛️',
  },
  {
    id: 'stage5',
    name: 'Symbiotic World',
    nameCn: '共生世界态',
    description: '共生 - 人、自然、技术共生',
    requiredSpores: 65,
    tabs: [
      { id: 'human', name: 'Humanity', nameCn: '人', requiredSpores: 65, unlocked: false },
      { id: 'nature', name: 'Nature', nameCn: '自然', requiredSpores: 70, unlocked: false },
      { id: 'symtech', name: 'Symbiotic Tech', nameCn: '技术共生', requiredSpores: 75, unlocked: false },
    ],
    unlocked: false,
    icon: '🌍',
  },
];

export const TOTAL_SPORES_FOR_NUSHU = 30;
