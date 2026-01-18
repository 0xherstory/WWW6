import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import FloatingOrbs from '@/components/FloatingOrbs';
import { useNavigate } from 'react-router-dom';

import momo1 from '@/assets/momo-mint-001.png';
import momo3 from '@/assets/momo-3.png';
import momo5 from '@/assets/momo-5.png';
import momo7 from '@/assets/momo-7.png';
import momoWorldVideo from '@/assets/momoverse-world.mp4';
import momoCoin from '@/assets/momo-coin.png';

const availableMomos = [
  { id: 1, name: 'Lumi', image: momo1, cost: 100 },
  { id: 3, name: 'Nami', image: momo3, cost: 250 },
  { id: 5, name: 'Haze', image: momo5, cost: 150 },
  { id: 7, name: 'Zizi', image: momo7, cost: 200 },
];

const MintMomo: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMomo, setSelectedMomo] = useState(availableMomos[0]);
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [tokens] = useState(500); // Mock token balance

  const handleMint = () => {
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
      setIsMinted(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen relative pt-24 pb-12 px-6">
      <FloatingOrbs />
      
      {/* Token Display */}
      <div className="fixed top-24 right-6 z-20">
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <img src={momoCoin} alt="MoMo Coin" className="w-5 h-5" />
          <span className="font-bold">{tokens}</span>
          <span className="text-sm text-muted-foreground">MoMo Tokens</span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-4">Mint MoMo</h1>
          <p className="text-muted-foreground">Bring a new MoMo pal into your collection</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mint Panel */}
          <div className="flex-1">
            <div className="glass-card p-8">
              {!isMinted ? (
                <>
                  <h2 className="text-xl font-bold mb-6">Choose your MoMo</h2>
                  
                  {/* MoMo Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {availableMomos.map((momo) => (
                      <button
                        key={momo.id}
                        onClick={() => setSelectedMomo(momo)}
                        className={`glass-panel p-4 transition-all duration-300 hover:scale-105 ${
                          selectedMomo.id === momo.id 
                            ? 'ring-2 ring-momo-pink' 
                            : ''
                        }`}
                      >
                        <img 
                          src={momo.image} 
                          alt={momo.name}
                          className="w-full aspect-square object-contain"
                        />
                        <p className="text-center mt-2 font-medium text-sm">{momo.name}</p>
                        <p className="text-center text-xs text-momo-pink flex items-center justify-center gap-1">{momo.cost} <img src={momoCoin} alt="" className="w-3 h-3 inline" /></p>
                      </button>
                    ))}
                  </div>

                  {/* Selected MoMo Preview */}
                  <div className="glass-panel p-6 mb-6">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={selectedMomo.image} 
                          alt={selectedMomo.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{selectedMomo.name}</h3>
                        <p className="text-muted-foreground text-sm">Ready to join your adventure</p>
                        <p className="text-momo-pink font-semibold mt-1">{selectedMomo.cost} MoMo Tokens</p>
                      </div>
                    </div>
                  </div>

                  {/* Mint Button */}
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handleMint}
                    disabled={isMinting}
                  >
                    {isMinting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Minting...
                      </span>
                    ) : (
                      `Mint ${selectedMomo.name}`
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-40 h-40 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-momo-pink/30 rounded-full blur-2xl animate-pulse" />
                    <img 
                      src={selectedMomo.image} 
                      alt={selectedMomo.name}
                      className="relative w-full h-full object-contain animate-bounce-soft"
                    />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">🎉 Congratulations!</h2>
                  <p className="text-muted-foreground mb-6">
                    {selectedMomo.name} is now part of your collection!
                  </p>
                  <Button
                    variant="hero"
                    onClick={() => navigate('/profile')}
                  >
                    View in Profile
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* MoMoverse Visual */}
          <div className="lg:w-1/2">
            <div className="glass-card p-4 overflow-hidden">
              <div className="relative rounded-2xl overflow-hidden">
                <video 
                  src={momoWorldVideo} 
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold">The MoMoverse awaits</h3>
                  <p className="text-sm text-muted-foreground">A magical world where your MoMo pals come to life</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintMomo;
