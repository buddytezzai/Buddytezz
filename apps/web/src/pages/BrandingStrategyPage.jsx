
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Palette, Target, Sparkles, Award, Users } from 'lucide-react';
import ServiceHeader from '@/components/ServiceHeader.jsx';
import ServiceOverview from '@/components/ServiceOverview.jsx';
import PortfolioGrid from '@/components/PortfolioGrid.jsx';
import ServiceROICalculator from '@/components/ServiceROICalculator.jsx';
import ServiceCTA from '@/components/ServiceCTA.jsx';
import Footer from '@/components/Footer.jsx';
import { useParallax } from '@/hooks/useParallax.js';
import { shapeMorphAnimation } from '@/lib/animations.js';

const BrandingStrategyPage = () => {
  const heroRef = useRef(null);
  const y = useParallax(heroRef, 150);

  const portfolioItems = [
    {
      title: "Fintech Rebrand",
      description: "Complete visual identity overhaul for a Series A startup.",
      image: "https://images.unsplash.com/photo-1495224814653-94f36c0a31ea?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "DTC Brand Launch",
      description: "Strategy and packaging design for a premium wellness brand.",
      image: "https://images.unsplash.com/photo-1495224814653-94f36c0a31ea?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const calcInputs = [
    { id: 'awareness', label: 'Current Brand Awareness', min: 1, max: 100, step: 1, default: 15, prefix: '', suffix: '%' },
    { id: 'target', label: 'Target Awareness', min: 10, max: 100, step: 1, default: 40, prefix: '', suffix: '%' },
    { id: 'market', label: 'Total Market Size', min: 10000, max: 10000000, step: 10000, default: 500000, prefix: '', suffix: '' }
  ];

  const calculateROI = (vals) => {
    const currentReach = vals.market * (vals.awareness / 100);
    const targetReach = vals.market * (vals.target / 100);
    return {
      awareness_growth: vals.target - vals.awareness,
      market_reach: Math.round(targetReach - currentReach),
      brand_value_increase: 250 // Example multiplier
    };
  };

  const calcResults = [
    { id: 'awareness_growth', label: 'Awareness Lift', icon: Target, prefix: '+', suffix: '%' },
    { id: 'market_reach', label: 'New Audience Reached', icon: Users, prefix: '', suffix: '' },
    { id: 'brand_value_increase', label: 'Est. Equity Growth', icon: Award, prefix: '+', suffix: '%', colorClass: 'text-[hsl(var(--accent))]' }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Helmet><title>Branding & Strategy | Buddy Tezz AI</title></Helmet>
      <ServiceHeader />
      
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[hsl(var(--background))]" />
        
        {/* Morphing Shapes */}
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-20 pointer-events-none">
          <motion.div variants={shapeMorphAnimation} animate="animate" className="w-96 h-96 bg-gradient-to-tr from-[hsl(var(--primary))] to-[hsl(var(--accent))] blur-3xl" />
        </div>

        <motion.div style={{ y }} className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Stand out.<br/><span className="text-glow text-[hsl(var(--primary))]">Mean something.</span>
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Strategic brand positioning and visual identities that capture attention and command premium pricing.
          </p>
        </motion.div>
      </section>

      <ServiceOverview 
        icon={Palette}
        headline="Design is how it looks. Strategy is how it works."
        description="We don't just make pretty logos. We define your unique value proposition, target audience, and visual language to create a brand that dominates your category."
      />

      <PortfolioGrid items={portfolioItems} />

      <ServiceROICalculator 
        title="Brand Equity Calculator"
        description="Measure the impact of stronger brand positioning on your market share."
        inputs={calcInputs}
        calculateResults={calculateROI}
        resultsConfig={calcResults}
      />

      <ServiceCTA 
        headline="Ready to redefine your industry?"
        subheadline="Let's build a brand that people actually care about."
      />

      <Footer />
    </div>
  );
};

export default BrandingStrategyPage;
