
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Palette, Target, Sparkles, Award, Users, Zap } from 'lucide-react';
import ServiceHeader from '@/components/ServiceHeader.jsx';
import VideoPortfolio from '@/components/VideoPortfolio.jsx';
import ImageShowcase from '@/components/ImageShowcase.jsx';
import BrandSlider from '@/components/BrandSlider.jsx';
import ServiceROICalculator from '@/components/ServiceROICalculator.jsx';
import ServiceCTA from '@/components/ServiceCTA.jsx';
import Footer from '@/components/Footer.jsx';
import { useParallax } from '@/hooks/useParallax.js';
import { floatingAnimation } from '@/lib/animations.js';

const BrandingStrategyPage = () => {
  const heroRef = useRef(null);
  const y = useParallax(heroRef, 150);


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
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--muted))] to-[hsl(var(--background))]" />
        
        {/* Floating Icons */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[Palette, Target, Sparkles, Award].map((Icon, i) => (
            <motion.div
              key={i}
              variants={floatingAnimation}
              initial="initial"
              animate="animate"
              style={{
                position: 'absolute',
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 0.5}s`
              }}
              className="p-4 glass-card rounded-2xl text-[hsl(var(--primary))] opacity-50"
            >
              <Icon size={32} />
            </motion.div>
          ))}
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

      <ImageShowcase 
        title="💎 Branding Showcases"
        subtitle="Crafting unique identities that capture attention and command respect across all mediums."
        items={[
          {
            image: 'https://images.unsplash.com/photo-1542713133-722522731057?auto=format&fit=crop&q=80&w=2000',
            title: 'OOH Branding',
            description: 'High-impact offline campaigns for mass visibility.'
          },
          {
            image: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&q=80&w=2000',
            title: 'Digital Branding',
            description: 'Consistent identity across all digital platforms.'
          },
          {
            image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=2000',
            title: 'Influencer Marketing',
            description: 'Strategic collaborations for audience trust.'
          },
          {
            image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2000',
            title: 'Social Media Branding',
            description: 'A cohesive visual language for your social presence.'
          },
          {
            image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2000',
            title: 'Content Marketing',
            description: 'Strategic content that positions you as an industry leader.'
          }
        ]}
      />

      <VideoPortfolio />
      <BrandSlider />

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
