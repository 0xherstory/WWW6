import React from 'react';
import marketPageBg from '@/assets/marketpage.png';

const Market: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-momo-pink/10 via-momo-purple/10 to-momo-blue/10">
      <img 
        src={marketPageBg} 
        alt="MoMo Market"
        className="w-full max-w-7xl h-auto object-contain px-4 py-8"
      />
    </div>
  );
};

export default Market;
