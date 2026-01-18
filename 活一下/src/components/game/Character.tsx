import { memo } from 'react';
import { Position } from '@/types/game';

interface CharacterProps {
  position: Position;
}

export const Character = memo(({ position }: CharacterProps) => {
  return (
    <div
      className="absolute z-20 transition-all duration-500 ease-out cursor-pointer animate-character-idle"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Character Body - Q-style astronaut */}
      <div className="relative w-12 h-16 group">
        {/* Vacuum Cleaner Backpack */}
        <div className="absolute -right-4 top-4 w-6 h-10 bg-gradient-to-b from-muted to-background rounded-lg border border-primary/30">
          {/* Vacuum Tube */}
          <div className="absolute -left-2 top-1 w-8 h-1.5 bg-muted rounded-full transform rotate-45" />
          {/* Vacuum Nozzle */}
          <div className="absolute -left-6 -top-1 w-4 h-3 bg-primary/40 rounded-lg neon-border" />
          {/* Blue Glow on Vacuum */}
          <div className="absolute inset-0 bg-primary/10 rounded-lg animate-pulse-glow" />
        </div>

        {/* Helmet */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-b from-card to-background rounded-full border-2 border-primary/50 overflow-hidden">
          {/* Visor */}
          <div className="absolute inset-1 bg-gradient-to-br from-primary/30 to-neon-blue/20 rounded-full">
            {/* Eyes */}
            <div className="flex justify-center gap-1.5 pt-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
          {/* Helmet Reflection */}
          <div className="absolute top-1 left-2 w-2 h-2 bg-primary/40 rounded-full blur-sm" />
        </div>

        {/* Body */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-card to-background rounded-lg border border-primary/30">
          {/* Chest Light */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
        </div>

        {/* Legs */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-3 h-4 bg-gradient-to-b from-card to-muted rounded-b-lg" />
          <div className="w-3 h-4 bg-gradient-to-b from-card to-muted rounded-b-lg" />
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute -inset-2 bg-primary/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
});

Character.displayName = 'Character';
