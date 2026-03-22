
import { motion } from 'framer-motion';

export const floatingAnimation = {
  animate: {
    y: [0, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  }
};

export const pulseGlowAnimation = {
  animate: {
    boxShadow: [
      "0 0 20px hsl(var(--primary) / 0.4)",
      "0 0 40px hsl(var(--primary) / 0.8)",
      "0 0 20px hsl(var(--primary) / 0.4)"
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};

export const dataFlowAnimation = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { 
    pathLength: 1, 
    opacity: [0, 1, 0],
    transition: { duration: 2, repeat: Infinity, ease: "linear" }
  }
};

export const shapeMorphAnimation = {
  animate: {
    borderRadius: ["20%", "50%", "30%", "20%"],
    rotate: [0, 90, 180, 360],
    transition: { duration: 8, repeat: Infinity, ease: "linear" }
  }
};
