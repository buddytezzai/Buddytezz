
import React from 'react';
import { motion } from 'framer-motion';

const ServiceOverview = ({ headline, description, icon: Icon }) => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {Icon && (
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center mb-8 shadow-lg shadow-[hsl(var(--primary))]/20">
              <Icon className="w-10 h-10 text-white" />
            </div>
          )}
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight text-balance">
            {headline}
          </h2>
          <p className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceOverview;
