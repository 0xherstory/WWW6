import React from 'react';
import momoversePageBg from '@/assets/momoverse-page.png';

const MoMoverse: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-momo-pink/10 via-momo-purple/10 to-momo-blue/10">
      <img 
        src={momoversePageBg} 
        alt="MoMoverse"
        className="w-full max-w-7xl h-auto object-contain px-4 py-8"
      />
    </div>
  );
};

export default MoMoverse;