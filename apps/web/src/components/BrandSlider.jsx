import React from 'react';
import { motion } from 'framer-motion';

const BrandSlider = () => {
  const brands = [
    "Sri Mandir",
    "Eloelo App",
    "Story TV",
    "Connecto App",
    "Wanderly.ai",
    "Master App"
  ];

  // Duplicate brands for infinite scroll
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-12 bg-black/40 overflow-hidden border-y border-white/5">
      <div className="relative flex whitespace-nowrap">
        <motion.div
          className="flex gap-12 md:gap-24 items-center"
          animate={{
            x: [0, -100 + '%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {duplicatedBrands.map((brand, index) => (
            <span
              key={index}
              className="text-xl md:text-3xl font-bold text-white/30 hover:text-[hsl(var(--primary))] transition-colors duration-300 cursor-default"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandSlider;
