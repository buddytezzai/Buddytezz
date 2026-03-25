import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICES = [
  { label: 'AI Automation', href: '/services/ai-automation' },
  { label: 'Social Media', href: '/services/social-media' },
  { label: 'Content Creation', href: '/services/content-creation' },
  { label: 'Web Development', href: '/services/website-development' },
  { label: 'Branding & Strategy', href: '/services/branding-strategy' },
  { label: 'Performance Marketing', href: '/services/performance-marketing' }
];

const ServiceHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter out the current service to avoid self-linking
  const otherServices = SERVICES.filter(service => service.href !== location.pathname);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-card shadow-lg py-1' : 'bg-transparent py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img 
              src="https://horizons-cdn.hostinger.com/e8899cff-47c0-4fa0-a3d5-02b5278d01c4/f9785657bb3b62a1888faa1e5159e176.png" 
              alt="Buddy Tezz AI Logo" 
              className="h-10 w-auto md:h-12 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-lg md:text-xl font-bold text-white hidden lg:block">Buddy Tezz AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {otherServices.map((service) => (
              <Link 
                key={service.href} 
                to={service.href}
                className="px-3 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-white transition-colors hover:bg-white/5 rounded-lg whitespace-nowrap"
              >
                {service.label}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-white/10 mx-2 hidden lg:block" />
            
            <Link to="/" className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] transition-all flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 glass-card border-t border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 bg-[hsl(var(--background))]/95 backdrop-blur-xl">
              <div className="text-[hsl(var(--muted-foreground))] text-xs font-bold uppercase tracking-wider mb-2 px-2">
                Our Services
              </div>
              <div className="grid grid-cols-1 gap-2">
                {otherServices.map((service) => (
                  <Link
                    key={service.href}
                    to={service.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl transition-all text-white hover:bg-white/10 border border-transparent"
                  >
                    <span className="font-medium">{service.label}</span>
                    <ChevronRight size={18} className="opacity-50" />
                  </Link>
                ))}
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <Link 
                  to="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 w-full bg-white/5 text-white rounded-xl font-semibold border border-white/10 hover:bg-white/10 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" /> Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ServiceHeader;
