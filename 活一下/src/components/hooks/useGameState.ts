import { useState, useCallback, useEffect } from 'react';
import { GameState, Spore, Position, INITIAL_EVOLUTION_STAGES, TOTAL_SPORES_FOR_NUSHU } from '@/types/game';

const STORAGE_KEY = 'pollution-cleaner-game-save';
const SPORES_PER_LEVEL = 30;

const generateSpores = (count: number, sceneId: number = 1): Spore[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `spore-${sceneId}-${i}-${Date.now()}`,
    position: {
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 45,
    },
    isCollected: false,
    animationDelay: Math.random() * 2,
  }));
};

const getInitialState = (): GameState => ({
  collectedSpores: 0,
  characterPosition: { x: 50, y: 75 },
  currentScene: 1,
  pollutionLevel: 100,
  evolutionStages: INITIAL_EVOLUTION_STAGES,
  spores: generateSpores(TOTAL_SPORES_FOR_NUSHU, 1),
  nushuUnlocked: false,
  showNextLevel: false,
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure new fields exist
        return {
          ...getInitialState(),
          ...parsed,
        };
      } catch {
        return getInitialState();
      }
    }
    return getInitialState();
  });

  // Auto-save
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const collectSpore = useCallback((sporeId: string) => {
    setGameState((prev) => {
      const sporeIndex = prev.spores.findIndex((s) => s.id === sporeId);
      if (sporeIndex === -1 || prev.spores[sporeIndex].isCollected) return prev;

      const newSpores = [...prev.spores];
      newSpores[sporeIndex] = { ...newSpores[sporeIndex], isCollected: true };

      const newCollectedCount = prev.collectedSpores + 1;
      const activeSporesCount = newSpores.filter(s => !s.isCollected).length;
      const totalSporesInScene = newSpores.length;
      const collectedInScene = totalSporesInScene - activeSporesCount;
      const newPollutionLevel = Math.max(0, 100 - (collectedInScene / totalSporesInScene) * 100);

      // Update evolution stages
      const newStages = prev.evolutionStages.map((stage) => {
        const stageUnlocked = newCollectedCount >= stage.requiredSpores;
        const updatedTabs = stage.tabs?.map((tab) => ({
          ...tab,
          unlocked: newCollectedCount >= tab.requiredSpores,
        }));
        return {
          ...stage,
          unlocked: stageUnlocked,
          tabs: updatedTabs,
        };
      });

      // Check if Nüshu is now unlocked (30 spores collected total)
      const nushuNowUnlocked = newCollectedCount >= 30;
      const showNextLevel = nushuNowUnlocked && prev.currentScene === 1 && !prev.showNextLevel;

      return {
        ...prev,
        spores: newSpores,
        collectedSpores: newCollectedCount,
        pollutionLevel: newPollutionLevel,
        evolutionStages: newStages,
        nushuUnlocked: nushuNowUnlocked,
        showNextLevel: showNextLevel || prev.showNextLevel,
      };
    });
  }, []);

  const moveCharacter = useCallback((position: Position) => {
    setGameState((prev) => ({
      ...prev,
      characterPosition: position,
    }));
  }, []);

  const resetGame = useCallback(() => {
    const newState = getInitialState();
    setGameState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const saveGame = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const goToNextLevel = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentScene: 2,
      pollutionLevel: 100,
      spores: generateSpores(SPORES_PER_LEVEL, 2),
      showNextLevel: false,
    }));
  }, []);

  // 测试用：直接跳到女书解锁状态
  const skipToNushuUnlocked = useCallback(() => {
    setGameState((prev) => {
      const allCollectedSpores = prev.spores.map(s => ({ ...s, isCollected: true }));
      const newStages = prev.evolutionStages.map((stage) => ({
        ...stage,
        unlocked: true,
        tabs: stage.tabs?.map((tab) => ({ ...tab, unlocked: true })),
      }));
      return {
        ...prev,
        spores: allCollectedSpores,
        collectedSpores: 30,
        pollutionLevel: 0,
        evolutionStages: newStages,
        nushuUnlocked: true,
        showNextLevel: true,
      };
    });
  }, []);

  return {
    gameState,
    collectSpore,
    moveCharacter,
    resetGame,
    saveGame,
    goToNextLevel,
    skipToNushuUnlocked,
  };
};
