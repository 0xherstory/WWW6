import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import momoverseLogo from '@/assets/momoverse-logo.png';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/momo-dex', label: 'MoMo Dex' },
  { path: '/mint', label: 'Mint MoMo' },
  { path: '/profile', label: 'Profile' },
  { path: '/momoverse', label: 'MoMoverse' },
  { path: '/market', label: 'Market' },
];

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={momoverseLogo} alt="MoMoverse" className="h-14" />
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                  location.pathname === item.path
                    ? "bg-momo-pink/20 text-momo-pink"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-xl hover:bg-white/5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
