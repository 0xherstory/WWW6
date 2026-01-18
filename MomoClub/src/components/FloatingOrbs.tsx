import React from 'react';

const FloatingOrbs: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Pink orb */}
      <div 
        className="absolute w-96 h-96 rounded-full bg-momo-pink/20 blur-3xl animate-float"
        style={{ top: '10%', left: '5%' }}
      />
      {/* Purple orb */}
      <div 
        className="absolute w-80 h-80 rounded-full bg-momo-purple/15 blur-3xl animate-float-delayed"
        style={{ top: '60%', right: '10%' }}
      />
      {/* Cyan orb */}
      <div 
        className="absolute w-72 h-72 rounded-full bg-momo-cyan/10 blur-3xl animate-float"
        style={{ bottom: '20%', left: '30%', animationDelay: '-4s' }}
      />
      {/* Yellow orb */}
      <div 
        className="absolute w-64 h-64 rounded-full bg-momo-yellow/10 blur-3xl animate-float-delayed"
        style={{ top: '30%', right: '25%' }}
      />
      {/* Lavender orb */}
      <div 
        className="absolute w-56 h-56 rounded-full bg-momo-lavender/15 blur-3xl animate-float"
        style={{ top: '50%', left: '60%', animationDelay: '-6s' }}
      />
    </div>
  );
};

export default FloatingOrbs;
