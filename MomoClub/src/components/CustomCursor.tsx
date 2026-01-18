import React, { useEffect, useState, useRef } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface TrailPoint extends CursorPosition {
  id: number;
  opacity: number;
  scale: number;
}

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const trailIdRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setPosition(newPos);
      setIsVisible(true);

      // Add new trail point
      trailIdRef.current += 1;
      setTrail(prev => [
        ...prev.slice(-6), // Keep only last 6 trail points
        {
          ...newPos,
          id: trailIdRef.current,
          opacity: 0.6,
          scale: 0.8,
        }
      ]);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Fade out trail points
  useEffect(() => {
    if (trail.length === 0) return;

    const interval = setInterval(() => {
      setTrail(prev => 
        prev
          .map(point => ({
            ...point,
            opacity: point.opacity - 0.1,
            scale: point.scale - 0.08,
          }))
          .filter(point => point.opacity > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [trail.length]);

  if (!isVisible) return null;

  return (
    <>
      {/* Trail */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: point.x - 12,
            top: point.y - 12,
            opacity: point.opacity * (index / trail.length),
            transform: `scale(${point.scale * (0.3 + (index / trail.length) * 0.5)})`,
          }}
        >
          <img
            src="/cursor.png"
            alt=""
            className="w-6 h-6"
            style={{
              filter: `drop-shadow(0 0 6px hsl(320 70% 65% / 0.4)) blur(${(trail.length - index) * 0.3}px)`,
            }}
          />
        </div>
      ))}

      {/* Main cursor */}
      <div
        className="fixed pointer-events-none z-[9999] transition-transform duration-75"
        style={{
          left: position.x - 16,
          top: position.y - 16,
          transform: isClicking ? 'scale(0.8)' : 'scale(1)',
        }}
      >
        <img
          src="/cursor.png"
          alt=""
          className="w-8 h-8 animate-cursor-float drop-shadow-lg"
          style={{
            filter: 'drop-shadow(0 0 8px hsl(320 70% 65% / 0.5))',
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
