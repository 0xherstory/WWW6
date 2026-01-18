import { memo, useState } from 'react';
import { EvolutionStage } from '@/types/game';
import { Button } from '@/components/ui/button';
import { ChevronRight, Lock } from 'lucide-react';

interface EvolutionPanelProps {
  stages: EvolutionStage[];
  isOpen: boolean;
  onToggle: () => void;
}

export const EvolutionPanel = memo(({ stages, isOpen, onToggle }: EvolutionPanelProps) => {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const currentStage = stages.filter((s) => s.unlocked).pop();

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 glass-panel px-2 py-6 hover:bg-card/90 neon-border"
      >
        <ChevronRight
          className={`w-5 h-5 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {/* Panel */}
      <div
        className={`fixed left-0 top-0 h-full w-80 glass-panel z-30 transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-display text-primary neon-text mb-2">进化的母系社会</h2>
            <p className="text-sm text-muted-foreground">Evolving Matriarchal Society</p>
          </div>

          {/* Current Progress */}
          {currentStage && (
            <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/30 neon-border">
              <p className="text-xs text-muted-foreground mb-1">当前阶段</p>
              <p className="text-lg font-display text-primary">{currentStage.nameCn}</p>
              <p className="text-sm text-foreground/80">{currentStage.name}</p>
            </div>
          )}

          {/* Evolution Tree */}
          <div className="space-y-3">
            {stages.map((stage, index) => (
              <div key={stage.id}>
                {/* Stage Card */}
                <div
                  className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    stage.unlocked
                      ? 'bg-card/80 border border-primary/40 hover:border-primary/70'
                      : 'bg-muted/30 border border-border/30 opacity-60'
                  } ${selectedStage === stage.id ? 'ring-2 ring-primary/50' : ''}`}
                  onClick={() => stage.unlocked && setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                        stage.unlocked ? 'bg-primary/20' : 'bg-muted'
                      }`}
                    >
                      {stage.unlocked ? stage.icon : <Lock className="w-4 h-4 text-muted-foreground" />}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className={`font-display text-sm ${stage.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {stage.nameCn}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{stage.name}</p>
                    </div>
                  </div>

                  {/* Description (expanded) */}
                  {selectedStage === stage.id && stage.unlocked && (
                    <div className="mt-3 pt-3 border-t border-border/50 animate-fade-in">
                      <p className="text-xs text-muted-foreground mb-3">{stage.description}</p>

                      {/* Tabs */}
                      {stage.tabs && stage.tabs.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {stage.tabs.map((tab) => (
                            <div
                              key={tab.id}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                tab.unlocked
                                  ? 'bg-secondary/30 text-secondary border border-secondary/50 nature-glow'
                                  : 'bg-muted/50 text-muted-foreground border border-border/30'
                              }`}
                            >
                              {tab.nameCn}
                              {!tab.unlocked && <Lock className="inline-block w-3 h-3 ml-1" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Connector Line */}
                {index < stages.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div
                      className={`w-0.5 h-4 ${
                        stages[index + 1].unlocked ? 'bg-primary/50' : 'bg-border/30'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
});

EvolutionPanel.displayName = 'EvolutionPanel';
