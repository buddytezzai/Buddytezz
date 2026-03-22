
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const PortfolioGrid = ({ items }) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--muted))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-4">Featured Projects</h3>
          <p className="text-[hsl(var(--muted-foreground))]">See how we've helped brands achieve their goals.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50 transition-colors duration-300">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-semibold text-white">{item.title}</h4>
                    <ArrowUpRight className="w-5 h-5 text-[hsl(var(--primary))] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </div>
                  <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed mb-4 flex-1">
                    {item.description}
                  </p>
                  <div className="text-[hsl(var(--primary))] text-sm font-medium">
                    View Case Study →
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioGrid;
