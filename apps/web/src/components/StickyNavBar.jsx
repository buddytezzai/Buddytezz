
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import SocialLinks from '@/components/SocialLinks.jsx';

const StickyNavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Services', href: '#services' },
    { label: 'Results', href: '#results' },
    { label: 'ROI Calculator', href: '#roi-calculator' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href) => {
    setIsMobileMenuOpen(false);
    
    // If it's an absolute path, navigate there perfectly using React Router
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }

    // Otherwise scroll smoothly
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If we are on a subpage and click a hash link, go to home page first
      navigate('/');
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'glass-card shadow-lg py-2' : 'bg-transparent py-4'
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-24">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] rounded-lg"
            onClick={handleLogoClick}
            aria-label="Go to Home"
          >
            <img 
              src="https://horizons-cdn.hostinger.com/e8899cff-47c0-4fa0-a3d5-02b5278d01c4/f9785657bb3b62a1888faa1e5159e176.png" 
              alt="Buddy Tezz AI Logo" 
              className="h-16 w-auto md:h-20 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            />
            <span className="text-xl md:text-2xl font-bold text-white font-['Outfit'] whitespace-nowrap tracking-tight">
              Buddy Tezz AI
            </span>
          </motion.button>

          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(item.href)}
                className="text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] rounded px-2 py-1"
                role="menuitem"
              >
                {item.label}
              </motion.button>
            ))}
            <div className="h-8 w-px bg-white/10 mx-2" />
            <SocialLinks iconSize={18} />
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[hsl(var(--foreground))] p-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] rounded-lg"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
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
            <div className="px-4 py-4 space-y-3" role="menu">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] font-medium py-3 text-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] rounded px-2"
                  role="menuitem"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-6 border-t border-white/10 flex justify-center">
                <SocialLinks iconSize={20} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default StickyNavBar;
