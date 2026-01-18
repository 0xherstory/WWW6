import { memo, useState } from 'react';
import { Spore as SporeType } from '@/types/game';

interface SporeProps {
  spore: SporeType;
  onCollect: (id: string) => boolean;
}

export const SporeComponent = memo(({ spore, onCollect }: SporeProps) => {
  const [isAbsorbing, setIsAbsorbing] = useState(false);

  if (spore.isCollected && !isAbsorbing) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (spore.isCollected || isAbsorbing) return;

    // Only play absorb animation if collection actually succeeds
    const collected = onCollect(spore.id);
    if (collected) {
      setIsAbsorbing(true);
    }
  };

  return (
    <div
      className={`absolute z-10 cursor-pointer transition-transform hover:scale-125 ${
        isAbsorbing ? 'animate-absorb' : 'animate-spore'
      }`}
      style={{
        left: `${spore.position.x}%`,
        top: `${spore.position.y}%`,
        animationDelay: `${spore.animationDelay}s`,
      }}
      onClick={handleClick}
    >
      {/* Outer Glow */}
      <div className="absolute -inset-3 bg-spore-glow/20 rounded-full blur-md animate-pulse-glow" />
      
      {/* Spore Body */}
      <div className="relative w-6 h-6">
        {/* Core */}
        <div className="absolute inset-0 bg-gradient-to-br from-spore to-pollution rounded-full pollution-glow" />
        
        {/* Inner Pattern */}
        <div className="absolute inset-1 bg-gradient-to-tr from-spore-glow/50 to-transparent rounded-full" />
        
        {/* Particles */}
        <div className="absolute -top-1 left-1/2 w-1 h-1 bg-spore-glow rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/2 -right-1 w-0.5 h-0.5 bg-spore-glow rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute -bottom-1 left-1/4 w-0.5 h-0.5 bg-spore-glow rounded-full animate-float" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
});

SporeComponent.displayName = 'SporeComponent';
