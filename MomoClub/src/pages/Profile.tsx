import React from 'react';
import FloatingOrbs from '@/components/FloatingOrbs';

import momo1 from '@/assets/momo-1.png';
import momo5 from '@/assets/momo-5.png';
import momo7 from '@/assets/momo-7.png';
import iconLumi from '@/assets/icon-lumi.png';
import iconMori from '@/assets/icon-mori.png';
import iconNami from '@/assets/icon-nami.png';
import profileAvatar from '@/assets/profile-avatar.png';

const ownedMomos = [
  { id: 1, name: 'Nami', type: 'Water', level: 5, image: momo1, acquiredDate: '2024-01-15' },
  { id: 5, name: 'Emi', type: 'Fire', level: 3, image: momo5, acquiredDate: '2024-02-20' },
  { id: 7, name: 'Thorny', type: 'Ice', level: 7, image: momo7, acquiredDate: '2024-01-10' },
];

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen relative pt-24 pb-12 px-6">
      <FloatingOrbs />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-momo-pink to-momo-purple p-1">
              <img 
                src={profileAvatar} 
                alt="Profile Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            
            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold mb-1">MoMo Trainer</h1>
              <p className="text-muted-foreground">Level 12 Collector</p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-momo-pink">{ownedMomos.length}</p>
                <p className="text-sm text-muted-foreground">MoMos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-momo-yellow">500</p>
                <p className="text-sm text-muted-foreground">Tokens</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-momo-cyan">15</p>
                <p className="text-sm text-muted-foreground">Battles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <h2 className="text-xl font-bold mb-6">
          Your MoMo Collection
        </h2>

        {/* MoMo Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownedMomos.map((momo) => (
            <div key={momo.id} className="glass-card p-6 group hover:shadow-glow transition-all duration-300">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-b from-momo-pink/10 to-momo-purple/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src={momo.image} 
                  alt={momo.name}
                  className="w-full aspect-square object-contain transition-transform group-hover:scale-105"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{momo.name}</h3>
                  <span className="glass-panel px-3 py-1 text-sm font-medium">
                    Lv.{momo.level}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{momo.type}</span>
                  <span className="text-muted-foreground">
                    Joined {new Date(momo.acquiredDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Level Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Experience</span>
                    <span>75%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-momo-pink to-momo-purple rounded-full"
                      style={{ width: '75%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty Slot */}
          <div className="glass-card p-6 border-2 border-dashed border-muted flex flex-col items-center justify-center min-h-[300px] opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <span className="text-4xl mb-3">+</span>
            <p className="text-muted-foreground text-center">Mint a new MoMo to fill this slot</p>
          </div>
        </div>

        {/* Activity Section */}
        <h2 className="text-xl font-bold mt-12 mb-6">
          Recent Activity
        </h2>

        <div className="glass-card divide-y divide-border/50">
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-momo-pink/20 flex items-center justify-center">
              <img src={iconLumi} alt="" className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Minted Frost</p>
              <p className="text-sm text-muted-foreground">2 days ago</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-momo-cyan/20 flex items-center justify-center">
              <img src={iconNami} alt="" className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Won a battle with Aqua</p>
              <p className="text-sm text-muted-foreground">5 days ago</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-momo-yellow/20 flex items-center justify-center">
              <img src={iconMori} alt="" className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Ember leveled up to Lv.3</p>
              <p className="text-sm text-muted-foreground">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
