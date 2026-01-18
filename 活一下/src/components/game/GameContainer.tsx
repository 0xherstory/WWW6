import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { GameScene } from './GameScene';
import { Character } from './Character';
import { SporeComponent } from './Spore';
import { EvolutionPanel } from './EvolutionPanel';
import { GameUI } from './GameUI';
import { WalletDialog } from './WalletDialog';
import { Position } from '@/types/game';
import { useToast } from '@/hooks/use-toast';

// Unlock notifications with descriptions for all stages and tabs
const UNLOCK_NOTIFICATIONS: Record<number, { title: string; description: string }> = {
  5: { title: '🌑 原初环境解锁', description: '觉醒 - 无个体、无边界，处于"被孕育"状态' },
  10: { title: '🔬 共生分裂态解锁', description: '萌芽 - 个体开始出现，如同细胞分裂' },
  15: { title: '🌸 照料解锁', description: '抚育群落态 - 群体开始具备照料分工' },
  20: { title: '🔧 修复解锁', description: '群体可以进行修复工作' },
  25: { title: '🧺 采集解锁', description: '群体掌握了采集技能' },
  30: { title: '📜 恭喜你，解锁母系社会的货币', description: '女书 - 独特的文字系统，承载共同记忆' },
  35: { title: '🎵 歌谣解锁', description: '记忆织网态 - 歌声传递着群体的记忆与情感' },
  40: { title: '🌱 种植解锁', description: '群体学会了与土地共生，培育生命' },
  45: { title: '🧵 编织解锁', description: '将记忆与智慧编织成有形的纽带' },
  50: { title: '🤖 人工智能解锁', description: '孕育型文明态 - 智慧向内延伸，与机器共生' },
  55: { title: '💊 细胞自愈解锁', description: '掌握生命自我修复的奥秘' },
  60: { title: '🌿 环境共生解锁', description: '与自然建立深层的共生关系' },
  65: { title: '👥 人解锁', description: '共生世界态 - 人类意识的觉醒与升华' },
  70: { title: '🌳 自然解锁', description: '与自然万物建立深层连接' },
  75: { title: '🔗 技术共生解锁', description: '技术成为共生世界的有机部分' },
};

export const GameContainer = () => {
  const { gameState, collectSpore, moveCharacter, resetGame, saveGame, goToNextLevel, skipToNushuUnlocked } = useGameState();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [walletSubmitted, setWalletSubmitted] = useState(() => {
    return localStorage.getItem('wallet-submitted') === 'true';
  });
  const { toast } = useToast();
  const lastNotifiedSpores = useRef(gameState.collectedSpores);

  const handleSceneClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Don't move if clicking on a spore or UI element
      if ((e.target as HTMLElement).closest('[data-spore]')) {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 100;
      const clickY = ((e.clientY - rect.top) / rect.height) * 100;

      // Allow full screen movement including sky
      const targetX = Math.max(5, Math.min(95, clickX));
      const targetY = Math.max(5, Math.min(95, clickY));

      moveCharacter({ x: targetX, y: targetY } as Position);
    },
    [moveCharacter]
  );

  // Check for unlock notifications
  useEffect(() => {
    const current = gameState.collectedSpores;
    const last = lastNotifiedSpores.current;
    
    // Find any thresholds crossed
    Object.entries(UNLOCK_NOTIFICATIONS).forEach(([threshold, notification]) => {
      const t = parseInt(threshold);
      if (current >= t && last < t) {
        toast({
          title: notification.title,
          description: notification.description,
          duration: 4000,
        });
      }
    });
    
    lastNotifiedSpores.current = current;
  }, [gameState.collectedSpores, toast]);

  // Auto-open wallet dialog when nushu is unlocked and wallet not yet submitted
  useEffect(() => {
    if (gameState.nushuUnlocked && !walletSubmitted && !isWalletDialogOpen) {
      setIsWalletDialogOpen(true);
    }
  }, [gameState.nushuUnlocked, walletSubmitted, isWalletDialogOpen]);

  const handleSave = useCallback(() => {
    saveGame();
    toast({
      title: "游戏已保存",
      description: "你的进度已成功保存",
    });
  }, [saveGame, toast]);

  const handleReset = useCallback(() => {
    resetGame();
    setWalletSubmitted(false);
    localStorage.removeItem('wallet-submitted');
    toast({
      title: "游戏已重置",
      description: "开始新的净化之旅",
    });
  }, [resetGame, toast]);

  const handleNextLevel = useCallback(() => {
    goToNextLevel();
    toast({
      title: "进入新场景",
      description: "继续你的净化任务！",
    });
  }, [goToNextLevel, toast]);

  const handleWalletSubmitted = useCallback(() => {
    setWalletSubmitted(true);
    localStorage.setItem('wallet-submitted', 'true');
  }, []);

  const handleCloseWalletDialog = useCallback(() => {
    setIsWalletDialogOpen(false);
  }, []);

  const handleSkipWalletAndNextLevel = useCallback(() => {
    setIsWalletDialogOpen(false);
    setWalletSubmitted(true);
    localStorage.setItem('wallet-submitted', 'true');
    goToNextLevel();
    toast({
      title: "进入新场景",
      description: "继续你的净化任务！",
    });
  }, [goToNextLevel, toast]);

  const handleTogglePanel = useCallback(() => {
    setIsPanelOpen((prev) => !prev);
  }, []);

  // Check if character is near a spore (within 15% distance)
  const isNearSpore = useCallback((sporeX: number, sporeY: number) => {
    const charX = gameState.characterPosition.x;
    const charY = gameState.characterPosition.y;
    const distance = Math.sqrt(Math.pow(sporeX - charX, 2) + Math.pow(sporeY - charY, 2));
    return distance <= 15;
  }, [gameState.characterPosition]);

  const handleCollectSpore = useCallback((sporeId: string) => {
    const spore = gameState.spores.find(s => s.id === sporeId);
    if (spore && isNearSpore(spore.position.x, spore.position.y)) {
      collectSpore(sporeId);
      return true;
    }

    toast({
      title: "距离太远",
      description: "请移动角色靠近孢子再收集",
      duration: 2000,
    });
    return false;
  }, [gameState.spores, isNearSpore, collectSpore, toast]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Game Scene Background */}
      <GameScene
        pollutionLevel={gameState.pollutionLevel}
        currentScene={gameState.currentScene}
      />

      {/* Interactive Game Area */}
      <div
        className="absolute inset-0 cursor-crosshair"
        onClick={handleSceneClick}
      >
        {/* Spores */}
        {gameState.spores.map((spore) => (
          <SporeComponent
            key={spore.id}
            spore={spore}
            onCollect={handleCollectSpore}
          />
        ))}

        {/* Character */}
        <Character position={gameState.characterPosition} />
      </div>

      {/* Evolution Panel */}
      <EvolutionPanel
        stages={gameState.evolutionStages}
        isOpen={isPanelOpen}
        onToggle={handleTogglePanel}
      />

      {/* Game UI */}
      <GameUI
        pollutionLevel={gameState.pollutionLevel}
        showNextLevel={gameState.showNextLevel && walletSubmitted}
        onSave={handleSave}
        onReset={handleReset}
        onNextLevel={handleNextLevel}
        onSkipToUnlock={skipToNushuUnlocked}
      />

      {/* Wallet Dialog */}
      <WalletDialog
        isOpen={isWalletDialogOpen}
        onClose={handleCloseWalletDialog}
        onSubmitted={handleWalletSubmitted}
        onSkipToNextLevel={handleSkipWalletAndNextLevel}
      />
    </div>
  );
};
