import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import LandingScreen from '@/components/LandingScreen';
import OrderSelectionScreen from '@/components/OrderSelectionScreen';
import TransitionScreen from '@/components/TransitionScreen';
import GameScreen from '@/components/GameScreen';
import BackgroundMusic from '@/components/BackgroundMusic';
import { WitchOrder } from '@/components/WitchOrderCard';

type GameState = 'landing' | 'order-selection' | 'transition' | 'game';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('landing');
  const [selectedOrder, setSelectedOrder] = useState<WitchOrder | null>(null);

  const handleEnterIsland = () => {
    setGameState('order-selection');
  };

  const handleSelectOrder = (order: WitchOrder) => {
    setSelectedOrder(order);
    setGameState('transition');
  };

  const handleStartGame = () => {
    setGameState('game');
  };

  const handleGoHome = () => {
    setGameState('landing');
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      <BackgroundMusic src="/audio/background-music.mp3" />
      
      <AnimatePresence mode="wait">
        {gameState === 'landing' && (
          <LandingScreen key="landing" onEnter={handleEnterIsland} />
        )}
        
        {gameState === 'order-selection' && (
          <OrderSelectionScreen key="order-selection" onSelect={handleSelectOrder} />
        )}
        
        {gameState === 'transition' && selectedOrder && (
          <TransitionScreen 
            key="transition" 
            selectedOrder={selectedOrder} 
            onContinue={handleStartGame} 
          />
        )}
        
        {gameState === 'game' && selectedOrder && (
          <GameScreen key="game" selectedOrder={selectedOrder} onGoHome={handleGoHome} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
