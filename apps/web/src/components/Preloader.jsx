
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 800); // Wait for fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible && false) return null; // Keep in DOM for exit animation

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(var(--background))] overflow-hidden pointer-events-none"
      role="progressbar"
      aria-label="Loading Buddy Tezz AI"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-[40vw] h-[40vw] rounded-full bg-[hsl(var(--primary))] blur-[100px] opacity-30"
        />
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center flex flex-col items-center"
      >
        <motion.div
          animate={{
            filter: [
              'drop-shadow(0 0 15px hsl(var(--primary) / 0.4))',
              'drop-shadow(0 0 30px hsl(var(--primary) / 0.8))',
              'drop-shadow(0 0 15px hsl(var(--primary) / 0.4))'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex flex-col md:flex-row items-center gap-4 md:gap-6"
        >
          <img 
            src="https://horizons-cdn.hostinger.com/e8899cff-47c0-4fa0-a3d5-02b5278d01c4/f9785657bb3b62a1888faa1e5159e176.png" 
            alt="Buddy Tezz AI Logo" 
            className="h-32 w-auto md:h-48 object-contain"
          />
          <span className="text-3xl md:text-5xl font-bold text-white font-['Outfit'] whitespace-nowrap tracking-tight">
            Buddy Tezz AI
          </span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 md:mt-12"
        >
          <div className="h-1.5 w-48 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-[hsl(var(--primary))] to-transparent"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Preloader;
