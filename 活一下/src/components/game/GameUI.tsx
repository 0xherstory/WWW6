import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Leaf, ChevronRight, Zap } from 'lucide-react';

interface GameUIProps {
  pollutionLevel: number;
  showNextLevel: boolean;
  onSave: () => void;
  onReset: () => void;
  onNextLevel: () => void;
  onSkipToUnlock?: () => void;
}

export const GameUI = memo(({ pollutionLevel, showNextLevel, onSave, onReset, onNextLevel, onSkipToUnlock }: GameUIProps) => {
  const purificationProgress = 100 - pollutionLevel;

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4">
        {/* Title */}
        <div className="glass-panel px-6 py-3 rounded-2xl neon-border">
          <h1 className="font-display text-lg text-primary neon-text tracking-wider">
            污染净化者
          </h1>
          <p className="text-xs text-muted-foreground text-center">Pollution Purifier</p>
        </div>
      </div>

      {/* Purification Progress */}
      <div className="fixed top-4 right-4 z-40 glass-panel px-4 py-3 rounded-xl neon-border">
        <div className="flex items-center gap-3">
          <Leaf className={`w-5 h-5 ${purificationProgress > 50 ? 'text-secondary' : 'text-muted-foreground'}`} />
          <div className="w-36">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">净化进度</span>
              <span className="text-xs font-mono text-primary neon-text">{Math.round(purificationProgress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${purificationProgress}%`,
                  background: purificationProgress > 50
                    ? 'linear-gradient(90deg, hsl(var(--secondary)) 0%, hsl(var(--secondary-glow)) 100%)'
                    : 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary-glow)) 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Next Level Button - Shows after wallet address submitted */}
      {showNextLevel && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-scale-in">
          <div className="glass-panel p-8 rounded-2xl neon-border text-center">
            <h2 className="font-display text-2xl text-primary neon-text mb-4">🎉 恭喜通关！</h2>
            <p className="text-muted-foreground mb-6">准备前往下一个场景</p>
            <Button
              size="lg"
              onClick={onNextLevel}
              className="bg-primary hover:bg-primary/80 text-primary-foreground neon-border animate-pulse-glow"
            >
              <span className="mr-2">下一关</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="fixed bottom-4 right-4 z-40 flex gap-2">
        {/* 测试用速通按钮 */}
        {onSkipToUnlock && !showNextLevel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSkipToUnlock}
            className="glass-panel border-secondary/30 hover:border-secondary/60 hover:bg-secondary/10 text-secondary"
          >
            <Zap className="w-4 h-4 mr-2" />
            速通测试
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="glass-panel border-primary/30 hover:border-primary/60 hover:bg-primary/10"
        >
          <Save className="w-4 h-4 mr-2" />
          存档
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="glass-panel border-destructive/30 hover:border-destructive/60 hover:bg-destructive/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          重启
        </Button>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 glass-panel px-4 py-2 rounded-xl">
        <p className="text-xs text-muted-foreground">
          移动角色靠近<span className="text-spore-glow mx-1">污染孢子</span>后点击收集
        </p>
      </div>
    </>
  );
});

GameUI.displayName = 'GameUI';
