import { memo, useMemo } from 'react';

interface GameSceneProps {
  pollutionLevel: number;
  currentScene: number;
}

// Pixel art building component
const PixelBuilding = memo(({ 
  left, 
  width, 
  height, 
  variant = 1,
  pollutionLevel 
}: { 
  left: string; 
  width: number; 
  height: number; 
  variant?: number;
  pollutionLevel: number;
}) => {
  const windows = useMemo(() => {
    const cols = Math.floor(width / 12);
    const rows = Math.floor(height / 20);
    return Array.from({ length: cols * rows }, (_, i) => ({
      col: i % cols,
      row: Math.floor(i / cols),
      lit: Math.random() > 0.4,
    }));
  }, [width, height]);

  return (
    <div 
      className="absolute bottom-24"
      style={{ left, width: `${width}px` }}
    >
      {/* Building base with pixel effect */}
      <div 
        className="relative"
        style={{ 
          height: `${height}px`,
          background: variant === 1 
            ? 'linear-gradient(180deg, hsl(220 30% 18%) 0%, hsl(220 25% 12%) 100%)'
            : 'linear-gradient(180deg, hsl(220 25% 22%) 0%, hsl(220 30% 14%) 100%)',
          imageRendering: 'pixelated',
          borderTop: '4px solid hsl(220 30% 25%)',
          borderLeft: '2px solid hsl(220 35% 28%)',
          borderRight: '2px solid hsl(220 20% 10%)',
        }}
      >
        {/* Pixel detail lines */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-border/30" />
        <div className="absolute top-2 left-0 right-0 h-px bg-border/20" />
        
        {/* Windows grid */}
        <div className="absolute inset-2 grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.floor(width / 12)}, 1fr)` }}>
          {windows.map((w, i) => (
            <div
              key={i}
              className="w-2 h-3"
              style={{
                background: w.lit 
                  ? `hsl(${40 + Math.random() * 20} 80% ${50 + Math.random() * 20}%)`
                  : 'hsl(220 20% 8%)',
                boxShadow: w.lit ? '0 0 4px hsl(45 80% 50% / 0.5)' : 'none',
                imageRendering: 'pixelated',
              }}
            />
          ))}
        </div>

        {/* Antenna/Details on top */}
        {variant === 1 && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-1 h-6 bg-muted">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Neon sign on building */}
      {pollutionLevel > 30 && variant === 2 && (
        <div 
          className="absolute top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-[8px] font-bold neon-border animate-pulse-glow"
          style={{ 
            background: 'hsl(var(--primary) / 0.3)',
            color: 'hsl(var(--primary))',
            textShadow: '0 0 5px hsl(var(--primary))',
            imageRendering: 'pixelated',
          }}
        >
          ネオン
        </div>
      )}
    </div>
  );
});

PixelBuilding.displayName = 'PixelBuilding';

// Pixel art junk pile
const PixelJunk = memo(({ left, bottom, size = 'md' }: { left: string; bottom: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-8 h-6',
    md: 'w-12 h-8',
    lg: 'w-16 h-10',
  };

  return (
    <div 
      className={`absolute ${sizeClasses[size]}`}
      style={{ left, bottom, imageRendering: 'pixelated' }}
    >
      {/* Stacked pixel blocks */}
      <div className="absolute bottom-0 left-0 w-4 h-4 bg-muted border border-border/50 rotate-6" />
      <div className="absolute bottom-2 left-2 w-5 h-3 bg-card border border-border/30 -rotate-3" />
      <div className="absolute bottom-1 left-4 w-3 h-5 bg-muted/80 border border-border/40 rotate-12" />
      {/* Glowing element */}
      <div className="absolute bottom-3 left-1 w-2 h-2 bg-primary/60 rounded-sm animate-pulse" 
           style={{ boxShadow: '0 0 6px hsl(var(--primary) / 0.8)' }} />
    </div>
  );
});

PixelJunk.displayName = 'PixelJunk';

// Pixel art machine
const PixelMachine = memo(({ left, animated = false }: { left: string; animated?: boolean }) => (
  <div 
    className="absolute bottom-24"
    style={{ left, imageRendering: 'pixelated' }}
  >
    <div className="relative w-10 h-14 bg-gradient-to-b from-muted to-card border-2 border-border">
      {/* Machine body details */}
      <div className="absolute top-1 left-1 right-1 h-4 bg-background/50 border border-border/50">
        {/* Screen */}
        <div className="w-full h-full bg-primary/20 flex items-center justify-center">
          <div className={`w-1 h-1 bg-primary rounded-full ${animated ? 'animate-pulse' : ''}`} />
        </div>
      </div>
      {/* Buttons */}
      <div className="absolute top-6 left-1 flex gap-0.5">
        <div className="w-1 h-1 bg-destructive" />
        <div className="w-1 h-1 bg-accent" />
        <div className="w-1 h-1 bg-secondary" />
      </div>
      {/* Vent */}
      <div className="absolute bottom-1 left-1 right-1 h-3 bg-background/30">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-full h-px bg-border/50 mt-0.5" />
        ))}
      </div>
      {/* Glow */}
      <div 
        className="absolute -inset-1 opacity-30 animate-pulse-glow"
        style={{ 
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)',
          filter: 'blur(4px)',
        }}
      />
    </div>
    {/* Pipe */}
    <div className="absolute -right-4 top-4 w-4 h-2 bg-muted border border-border/50" />
  </div>
));

PixelMachine.displayName = 'PixelMachine';

// Billboard component
const PixelBillboard = memo(({ left, text, color = 'primary' }: { left: string; text: string; color?: 'primary' | 'accent' }) => (
  <div 
    className="absolute bottom-48"
    style={{ left, imageRendering: 'pixelated' }}
  >
    {/* Pole */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-20 bg-muted border-x border-border/50" />
    {/* Sign */}
    <div 
      className={`relative w-20 h-10 bg-card border-2 border-${color}/50 neon-border`}
      style={{ 
        boxShadow: color === 'primary' 
          ? '0 0 15px hsl(var(--primary) / 0.5), inset 0 0 10px hsl(var(--primary) / 0.2)'
          : '0 0 15px hsl(var(--accent) / 0.5), inset 0 0 10px hsl(var(--accent) / 0.2)',
      }}
    >
      <div className={`w-full h-full flex items-center justify-center text-[10px] font-bold text-${color} animate-pulse-glow`}>
        {text}
      </div>
    </div>
  </div>
));

PixelBillboard.displayName = 'PixelBillboard';

export const GameScene = memo(({ pollutionLevel, currentScene }: GameSceneProps) => {
  const purificationProgress = 100 - pollutionLevel;
  
  return (
    <div className="absolute inset-0 overflow-hidden scene-transition" style={{ imageRendering: 'auto' }}>
      {/* Base Dark Layer */}
      <div className="absolute inset-0 bg-background" />

      {/* Cyberpunk City Scene (Scene 1) - Enhanced Pixel Art */}
      {currentScene === 1 && (
        <>
          {/* Polluted Sky with pixel gradient */}
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: pollutionLevel / 100 }}
          >
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, hsl(280 30% 12%) 0%, hsl(220 25% 10%) 30%, hsl(260 20% 15%) 60%, hsl(220 30% 12%) 100%)',
              }}
            />
            {/* Pollution particles */}
            <div className="absolute inset-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-pollution/40 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 60}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${4 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
            {/* Smog layers */}
            <div className="absolute inset-x-0 top-1/4 h-20 bg-pollution/10 blur-xl" />
            <div className="absolute inset-x-0 top-1/2 h-16 bg-pollution/15 blur-lg" />
          </div>

          {/* Ghibli Sky (revealed as pollution clears) */}
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: purificationProgress / 100 }}
          >
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, hsl(200 75% 70%) 0%, hsl(200 65% 80%) 40%, hsl(45 60% 85%) 100%)'
              }}
            />
            {/* Fluffy clouds */}
            <div className="absolute top-8 left-[15%] w-40 h-16 bg-foreground/95 rounded-full blur-sm opacity-90" />
            <div className="absolute top-12 left-[20%] w-28 h-10 bg-foreground/90 rounded-full blur-sm opacity-85" />
            <div className="absolute top-6 right-[20%] w-36 h-14 bg-foreground/95 rounded-full blur-sm opacity-90" />
            <div className="absolute top-14 right-[25%] w-24 h-8 bg-foreground/85 rounded-full blur-sm opacity-80" />
            <div className="absolute top-20 left-[45%] w-32 h-12 bg-foreground/90 rounded-full blur-sm opacity-85" />
          </div>

          {/* Pixel Art City */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-3/4 transition-opacity duration-500"
            style={{ opacity: Math.max(0.3, pollutionLevel / 100) }}
          >
            {/* Background buildings */}
            <PixelBuilding left="2%" width={50} height={180} variant={1} pollutionLevel={pollutionLevel} />
            <PixelBuilding left="12%" width={70} height={220} variant={2} pollutionLevel={pollutionLevel} />
            <PixelBuilding left="25%" width={45} height={140} variant={1} pollutionLevel={pollutionLevel} />
            <PixelBuilding left="35%" width={80} height={200} variant={2} pollutionLevel={pollutionLevel} />
            <PixelBuilding left="50%" width={55} height={160} variant={1} pollutionLevel={pollutionLevel} />
            <PixelBuilding left="62%" width={65} height={190} variant={2} pollutionLevel={pollutionLevel} />
            <PixelBuilding left="75%" width={50} height={150} variant={1} pollutionLevel={pollutionLevel} />
            <PixelBuilding left="85%" width={60} height={170} variant={2} pollutionLevel={pollutionLevel} />

            {/* Billboards */}
            {pollutionLevel > 20 && (
              <>
                <PixelBillboard left="18%" text="CYBER" color="primary" />
                <PixelBillboard left="55%" text="2099" color="accent" />
                <PixelBillboard left="78%" text="ネオン" color="primary" />
              </>
            )}

            {/* Machines */}
            {pollutionLevel > 30 && (
              <>
                <PixelMachine left="8%" animated />
                <PixelMachine left="45%" />
                <PixelMachine left="88%" animated />
              </>
            )}

            {/* Junk piles */}
            {pollutionLevel > 20 && (
              <>
                <PixelJunk left="5%" bottom="96px" size="lg" />
                <PixelJunk left="20%" bottom="96px" size="md" />
                <PixelJunk left="40%" bottom="96px" size="sm" />
                <PixelJunk left="60%" bottom="96px" size="md" />
                <PixelJunk left="80%" bottom="96px" size="lg" />
                <PixelJunk left="92%" bottom="96px" size="sm" />
              </>
            )}
          </div>

          {/* Ground */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 transition-all duration-1000"
            style={{
              background: pollutionLevel > 20 
                ? 'linear-gradient(180deg, hsl(220 25% 15%) 0%, hsl(220 30% 10%) 50%, hsl(220 25% 8%) 100%)'
                : 'linear-gradient(180deg, hsl(95 55% 45%) 0%, hsl(140 60% 35%) 100%)',
              imageRendering: 'pixelated',
            }}
          >
            {/* Ground details when polluted */}
            {pollutionLevel > 20 && (
              <>
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20" />
                <div className="absolute top-2 left-0 right-0 h-px bg-border/30" />
              </>
            )}
          </div>

          {/* Ghibli Grass (appears as pollution clears) */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 transition-opacity duration-1000 pointer-events-none"
            style={{ opacity: purificationProgress / 100 }}
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 bg-ghibli-grass rounded-t-full"
                style={{
                  left: `${1 + i * 2}%`,
                  width: '3px',
                  height: `${15 + Math.random() * 25}px`,
                  opacity: 0.6 + Math.random() * 0.4,
                  transform: `rotate(${-5 + Math.random() * 10}deg)`,
                }}
              />
            ))}
            {/* Flowers */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`flower-${i}`}
                className="absolute bottom-4"
                style={{ left: `${10 + i * 12}%` }}
              >
                <div className="w-2 h-2 bg-accent rounded-full" />
                <div className="w-1 h-4 bg-secondary mx-auto -mt-1" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Scene 2 - Wandering Earth Industrial Zone */}
      {currentScene === 2 && (
        <>
          {/* Polluted Sky */}
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: pollutionLevel / 100 }}
          >
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, hsl(270 25% 10%) 0%, hsl(240 20% 8%) 40%, hsl(220 25% 12%) 100%)',
              }}
            />
            {/* Heavy pollution particles */}
            <div className="absolute inset-0">
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-pollution/60 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 50}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
            {/* Smog layers */}
            <div className="absolute inset-x-0 top-1/3 h-24 bg-pollution/20 blur-2xl" />
          </div>

          {/* Ghibli Sky for Scene 2 */}
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: purificationProgress / 100 }}
          >
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, hsl(200 80% 65%) 0%, hsl(200 70% 78%) 50%, hsl(50 70% 88%) 100%)'
              }}
            />
            {/* Beautiful clouds */}
            <div className="absolute top-6 left-[10%] w-48 h-20 bg-foreground/95 rounded-full blur-md opacity-90" />
            <div className="absolute top-10 left-[25%] w-32 h-12 bg-foreground/90 rounded-full blur-sm opacity-85" />
            <div className="absolute top-4 right-[15%] w-44 h-18 bg-foreground/95 rounded-full blur-md opacity-90" />
            <div className="absolute top-16 right-[30%] w-28 h-10 bg-foreground/85 rounded-full blur-sm opacity-80" />
          </div>

          {/* Distant mountains when purified */}
          <div
            className="absolute bottom-24 left-0 right-0 h-40 transition-opacity duration-1000"
            style={{ opacity: purificationProgress / 100 }}
          >
            <div 
              className="absolute bottom-0 left-[5%] w-[30%] h-32"
              style={{
                background: 'linear-gradient(180deg, hsl(140 40% 50%) 0%, hsl(140 50% 40%) 100%)',
                clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
              }}
            />
            <div 
              className="absolute bottom-0 left-[25%] w-[35%] h-40"
              style={{
                background: 'linear-gradient(180deg, hsl(140 35% 45%) 0%, hsl(140 45% 35%) 100%)',
                clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
              }}
            />
            <div 
              className="absolute bottom-0 right-[10%] w-[28%] h-28"
              style={{
                background: 'linear-gradient(180deg, hsl(140 45% 55%) 0%, hsl(140 50% 45%) 100%)',
                clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
              }}
            />
          </div>

          {/* Giant Planetary Engine Tower - Left */}
          <div 
            className="absolute bottom-24 left-[5%] transition-opacity duration-500"
            style={{ opacity: Math.max(0.4, pollutionLevel / 100), imageRendering: 'pixelated' }}
          >
            {/* Main tower structure */}
            <div className="relative w-24 h-64">
              {/* Base */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-muted to-card border-2 border-border">
                <div className="absolute top-2 left-2 right-2 h-3 bg-background/30 border border-border/50" />
                <div className="absolute bottom-2 left-2 right-2 h-4 bg-background/20">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="absolute w-2 h-2 bg-primary/60 rounded-sm animate-pulse" 
                         style={{ left: `${i * 16}%`, top: '2px', animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
              {/* Middle section */}
              <div className="absolute bottom-20 left-2 right-2 h-28 bg-gradient-to-t from-card to-muted border-x-2 border-border">
                {/* Pipes */}
                <div className="absolute left-0 top-4 w-2 h-20 bg-border" />
                <div className="absolute right-0 top-4 w-2 h-20 bg-border" />
                {/* Lights */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="absolute w-3 h-3 bg-destructive/80 rounded-sm animate-pulse"
                       style={{ left: '40%', top: `${20 + i * 20}%`, animationDelay: `${i * 0.3}s`,
                                boxShadow: '0 0 8px hsl(var(--destructive))' }} />
                ))}
              </div>
              {/* Top engine */}
              <div className="absolute bottom-48 left-0 right-0 h-16 bg-gradient-to-t from-muted to-border border-2 border-border">
                <div className="absolute top-2 left-4 right-4 h-6 bg-primary/30 border border-primary/50"
                     style={{ boxShadow: '0 0 15px hsl(var(--primary) / 0.5)' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-primary rounded-full animate-pulse-glow" />
                  </div>
                </div>
              </div>
              {/* Exhaust vents */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-muted border-2 border-border rounded-sm">
                <div className="w-full h-full bg-pollution/40 animate-pulse" />
              </div>
              {/* Steam effect */}
              {pollutionLevel > 40 && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="absolute w-3 h-3 bg-muted/60 rounded-full animate-float"
                         style={{ left: `${-10 + i * 5}px`, top: `${i * 8}px`, animationDelay: `${i * 0.3}s` }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Central Mega Structure */}
          <div 
            className="absolute bottom-24 left-[30%] transition-opacity duration-500"
            style={{ opacity: Math.max(0.4, pollutionLevel / 100), imageRendering: 'pixelated' }}
          >
            <div className="relative w-40 h-52">
              {/* Main dome */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-muted to-card border-2 border-border rounded-t-3xl">
                {/* Windows grid */}
                <div className="absolute top-4 left-4 right-4 bottom-4 grid grid-cols-4 gap-1">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="bg-primary/20 border border-primary/30"
                         style={{ boxShadow: Math.random() > 0.5 ? '0 0 4px hsl(var(--primary) / 0.5)' : 'none' }} />
                  ))}
                </div>
                {/* Central light */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary/40 rounded-full animate-pulse-glow"
                     style={{ boxShadow: '0 0 20px hsl(var(--primary) / 0.6)' }} />
              </div>
              {/* Antenna array */}
              <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2">
                <div className="w-1 h-16 bg-border">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-destructive rounded-full animate-pulse" />
                </div>
                <div className="w-1 h-20 bg-border">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
                <div className="w-1 h-14 bg-border">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rounded-full animate-pulse" />
                </div>
              </div>
              {/* Side thrusters */}
              <div className="absolute bottom-8 -left-6 w-6 h-16 bg-gradient-to-l from-muted to-card border border-border">
                <div className="w-2 h-2 bg-destructive/60 mx-auto mt-2 animate-pulse" />
              </div>
              <div className="absolute bottom-8 -right-6 w-6 h-16 bg-gradient-to-r from-muted to-card border border-border">
                <div className="w-2 h-2 bg-destructive/60 mx-auto mt-2 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Engine Complex */}
          <div 
            className="absolute bottom-24 right-[8%] transition-opacity duration-500"
            style={{ opacity: Math.max(0.4, pollutionLevel / 100), imageRendering: 'pixelated' }}
          >
            <div className="relative w-32 h-48">
              {/* Cylindrical tanks */}
              <div className="absolute bottom-0 left-0 w-12 h-40 bg-gradient-to-t from-muted to-card border-2 border-border rounded-t-full">
                <div className="absolute top-8 left-2 right-2 h-2 bg-accent/40" />
                <div className="absolute top-14 left-2 right-2 h-2 bg-accent/40" />
                <div className="absolute top-20 left-2 right-2 h-2 bg-accent/40" />
              </div>
              <div className="absolute bottom-0 right-0 w-14 h-36 bg-gradient-to-t from-card to-muted border-2 border-border rounded-t-full">
                <div className="absolute top-6 left-2 right-2 h-2 bg-primary/40" />
                <div className="absolute top-12 left-2 right-2 h-2 bg-primary/40" />
              </div>
              {/* Connecting pipes */}
              <div className="absolute bottom-20 left-10 w-8 h-3 bg-border" />
              <div className="absolute bottom-28 left-10 w-8 h-3 bg-border" />
              {/* Control panel */}
              <div className="absolute bottom-4 left-14 w-8 h-12 bg-card border border-border">
                <div className="w-2 h-2 bg-secondary mx-auto mt-1 animate-pulse" />
                <div className="w-2 h-2 bg-destructive mx-auto mt-1 animate-pulse" />
                <div className="w-2 h-2 bg-primary mx-auto mt-1 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Small structures and details */}
          {pollutionLevel > 30 && (
            <>
              <PixelMachine left="22%" animated />
              <PixelMachine left="75%" />
              <PixelJunk left="18%" bottom="96px" size="lg" />
              <PixelJunk left="58%" bottom="96px" size="md" />
              <PixelJunk left="85%" bottom="96px" size="lg" />
            </>
          )}

          {/* Power transmission lines */}
          {pollutionLevel > 20 && (
            <>
              <div className="absolute top-1/4 left-0 right-0 h-px bg-border/60" />
              <div className="absolute top-[28%] left-0 right-0 h-px bg-border/40" />
              {/* Power pylons */}
              <div className="absolute top-[20%] left-[20%] w-4 h-20 bg-muted border border-border/50" style={{ imageRendering: 'pixelated' }}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-border" />
              </div>
              <div className="absolute top-[20%] right-[25%] w-4 h-20 bg-muted border border-border/50" style={{ imageRendering: 'pixelated' }}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-border" />
              </div>
            </>
          )}

          {/* Ground */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 transition-all duration-1000"
            style={{
              background: pollutionLevel > 20 
                ? 'linear-gradient(180deg, hsl(220 20% 18%) 0%, hsl(220 25% 12%) 50%, hsl(220 20% 8%) 100%)'
                : 'linear-gradient(180deg, hsl(95 60% 50%) 0%, hsl(140 55% 40%) 100%)',
              imageRendering: 'pixelated',
            }}
          >
            {pollutionLevel > 20 && (
              <>
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary/30" />
                <div className="absolute top-3 left-0 right-0 h-px bg-border/30" />
              </>
            )}
          </div>

          {/* Ghibli grass for scene 2 */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 transition-opacity duration-1000 pointer-events-none"
            style={{ opacity: purificationProgress / 100 }}
          >
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 bg-ghibli-grass rounded-t-full"
                style={{
                  left: `${i * 1.7}%`,
                  width: '3px',
                  height: `${12 + Math.random() * 20}px`,
                  opacity: 0.5 + Math.random() * 0.5,
                  transform: `rotate(${-3 + Math.random() * 6}deg)`,
                }}
              />
            ))}
            {/* Flowers */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`flower-${i}`}
                className="absolute bottom-4"
                style={{ left: `${5 + i * 10}%` }}
              >
                <div className="w-2 h-2 bg-accent rounded-full" />
                <div className="w-1 h-4 bg-secondary mx-auto -mt-1" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Atmospheric Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
});

GameScene.displayName = 'GameScene';
