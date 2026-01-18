import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FloatingOrbs from '@/components/FloatingOrbs';

import momo1 from '@/assets/momo-card-001.png';
import momo2 from '@/assets/momo-2.png';
import momo3 from '@/assets/momo-3.png';
import momo4 from '@/assets/momo-4.png';
import momo5 from '@/assets/momo-card-005.png';
import momo6 from '@/assets/momo-6.png';
import momo7 from '@/assets/momo-card-007.png';
import momo8 from '@/assets/momo-8.png';
import momo9 from '@/assets/momo-9.png';
import momoIdentityCard from '@/assets/momo-identity-card.png';

const momos = [
  { id: 1, name: 'MoMo 001', type: 'Water', rarity: 'Common', hp: 120, atk: 45, def: 60, image: momo1 },
  { id: 2, name: 'MoMo 002', type: 'Light', rarity: 'Uncommon', hp: 100, atk: 55, def: 50, image: momo2 },
  { id: 3, name: 'MoMo 003', type: 'Dream', rarity: 'Rare', hp: 90, atk: 70, def: 40, image: momo3 },
  { id: 4, name: 'MoMo 004', type: 'Nature', rarity: 'Common', hp: 130, atk: 40, def: 65, image: momo4 },
  { id: 5, name: 'MoMo 005', type: 'Fire', rarity: 'Uncommon', hp: 95, atk: 75, def: 35, image: momo5 },
  { id: 6, name: 'MoMo 006', type: 'Cosmic', rarity: 'Legendary', hp: 150, atk: 80, def: 70, image: momo6 },
  { id: 7, name: 'MoMo 007', type: 'Ice', rarity: 'Rare', hp: 110, atk: 50, def: 75, image: momo7 },
  { id: 8, name: 'MoMo 008', type: 'Rainbow', rarity: 'Epic', hp: 120, atk: 65, def: 55, image: momo8 },
  { id: 9, name: 'MoMo 009', type: 'Golden', rarity: 'Legendary', hp: 140, atk: 85, def: 65, image: momo9 },
];

const rarityColors: Record<string, string> = {
  Common: 'text-muted-foreground',
  Uncommon: 'text-momo-cyan',
  Rare: 'text-momo-blue',
  Epic: 'text-momo-purple',
  Legendary: 'text-momo-yellow',
};

const MomoDex: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMomo, setSelectedMomo] = useState(momos[0]);

  return (
    <div className="min-h-screen relative pt-24 pb-12 px-6">
      <FloatingOrbs />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-4">MoMo Dex</h1>
          <p className="text-muted-foreground">Discover all the adorable MoMo creatures</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* MoMo Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-4">
              {momos.map((momo) => (
                <button
                  key={momo.id}
                  onClick={() => setSelectedMomo(momo)}
                  className={`glass-card p-4 transition-all duration-300 hover:scale-105 ${
                    selectedMomo.id === momo.id 
                      ? 'ring-2 ring-momo-pink shadow-glow' 
                      : 'hover:shadow-lg'
                  }`}
                >
                  <div className="aspect-square relative">
                    <img 
                      src={momo.image} 
                      alt={momo.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-center mt-2 font-semibold text-sm">{momo.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Identity Card */}
          <div className="lg:w-[500px]">
            <div className="sticky top-24">
              <img 
                src={momoIdentityCard} 
                alt="MoMo Identity Card"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Fight Button Section */}
        <div className="mt-12 text-center">
          <Button
            variant="hero"
            size="lg"
            onClick={() => window.open('https://gemini.google.com/share/7903773248a9', '_blank')}
          >
            Start Battle
          </Button>
          <p className="mt-4 text-muted-foreground">Fight with your pal!</p>
        </div>
      </div>
    </div>
  );
};

export default MomoDex;
