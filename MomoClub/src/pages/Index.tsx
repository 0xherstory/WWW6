import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FloatingOrbs from '@/components/FloatingOrbs';
import momoFace from '@/assets/momoface.svg';

const Index: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingOrbs />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Decorative stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse-soft"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto">
        {/* Floating MoMo Character */}
          <div className="relative mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto relative">
              <div className="absolute inset-0 bg-momo-pink/20 rounded-full blur-3xl animate-pulse-soft" />
              <img
                src={momoFace}
                alt="MoMo Character"
                className="relative w-full h-full object-contain animate-bounce-soft drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-foreground">Come and match with</span>
            <br />
            <span className="gradient-text">your MoMo pal</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Discover adorable creatures in a magical world of friendship and adventure
          </p>

          {/* CTA Button */}
          <Button
            variant="hero"
            size="xl"
            onClick={() => window.open('https://momoclub-socialquiz.lovable.app', '_blank')}
            className="group"
          >
            <span>Collect your MoMo</span>
            <svg 
              className="w-5 h-5 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
          onClick={() => navigate('/momo-dex')}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2 hover:border-momo-pink transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
