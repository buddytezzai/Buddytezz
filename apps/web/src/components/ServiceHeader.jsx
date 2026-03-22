
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ServiceHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-card shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="https://horizons-cdn.hostinger.com/e8899cff-47c0-4fa0-a3d5-02b5278d01c4/f9785657bb3b62a1888faa1e5159e176.png" 
              alt="Buddy Tezz AI Logo" 
              className="h-12 w-auto md:h-16 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-xl md:text-2xl font-bold text-white hidden sm:block">Buddy Tezz AI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] font-medium transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white p-2">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-[hsl(var(--border))]"
          >
            <div className="px-4 py-4 space-y-3">
              <Link to="/" className="block w-full text-left text-white hover:text-[hsl(var(--primary))] font-medium py-3 text-lg flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" /> Back to Home
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ServiceHeader;
