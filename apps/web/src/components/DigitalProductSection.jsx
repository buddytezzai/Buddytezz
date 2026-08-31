
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Zap, TrendingUp, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const highlights = [
  { icon: Zap, text: 'Automated Monthly & Annual Dashboards' },
  { icon: TrendingUp, text: 'Track Income, Expenses, Bills & Savings Goals' },
  { icon: BookOpen, text: 'Pre-formatted formulas — zero setup needed' },
  { icon: Users, text: '100% private, offline & subscription-free' },
];

const DigitalProductSection = () => {
  return (
    <section
      id="digital-products"
      className="py-20 md:py-28 relative overflow-hidden"
      aria-label="Digital Products"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[hsl(var(--primary))/0.08] rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-[hsl(var(--accent))/0.05] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Label */}
          <div className="flex items-center justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-[hsl(var(--primary))/0.15] text-[hsl(var(--primary))] border border-[hsl(var(--primary))/0.3]">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              Digital Products
            </span>
          </div>

          {/* Card */}
          <div className="relative glass-card rounded-3xl overflow-hidden border border-[hsl(var(--primary))/0.2]">
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--primary))] to-transparent" aria-hidden="true" />

            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left — Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                    <span className="ml-2 text-sm text-[hsl(var(--muted-foreground))]">5.0 · 50+ buyers</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                    Personal Budget{' '}
                    <span className="text-glow bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
                      Tracker Template
                    </span>
                  </h2>
                  <p className="text-[hsl(var(--muted-foreground))] text-base md:text-lg leading-relaxed mb-8">
                    Take full control of your finances. Automated income, expense, and savings dashboards built into an intuitive, plug-and-play Excel spreadsheet.
                  </p>

                  <ul className="space-y-3 mb-8" role="list">
                    {highlights.map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))/0.15] border border-[hsl(var(--primary))/0.25] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-[hsl(var(--primary))]" aria-hidden="true" />
                        </div>
                        <span className="text-[hsl(var(--foreground))] text-sm md:text-base">{text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wide">Starting from</span>
                        <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full border border-green-500/30">80% OFF</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black text-white">₹99</p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] line-through">₹499</p>
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">/ $1.99</span>
                      </div>
                    </div>
                    <Link to="/digital-products" className="flex-shrink-0">
                      <Button
                        className="glow-button text-white font-semibold px-7 py-5 text-base rounded-xl group"
                        aria-label="See all digital products"
                      >
                        Get It Now
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Right — Product Image */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative flex items-center justify-center bg-gradient-to-br from-[hsl(var(--primary))/0.08] to-[hsl(var(--accent))/0.05] p-8 lg:p-12 min-h-[280px]"
              >
                {/* Glow behind image */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                  <div className="w-48 h-48 bg-[hsl(var(--primary))/0.2] rounded-full blur-3xl" />
                </div>
                <motion.img
                  src="/images/product-mockup.jpg"
                  alt="AI Business Automation Playbook digital product mockup"
                  className="relative z-10 w-full max-w-sm rounded-2xl shadow-2xl object-cover"
                  style={{ boxShadow: '0 0 60px hsl(217 91% 60% / 0.25), 0 20px 60px rgba(0,0,0,0.5)' }}
                  whileHover={{ scale: 1.03, rotate: -1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DigitalProductSection;
