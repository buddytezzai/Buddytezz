
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Target, DollarSign } from 'lucide-react';
import ServiceHeader from '@/components/ServiceHeader.jsx';
import ServiceOverview from '@/components/ServiceOverview.jsx';
import PortfolioGrid from '@/components/PortfolioGrid.jsx';
import ServiceROICalculator from '@/components/ServiceROICalculator.jsx';
import ServiceCTA from '@/components/ServiceCTA.jsx';
import Footer from '@/components/Footer.jsx';
import { useParallax } from '@/hooks/useParallax.js';

const PerformanceMarketingPage = () => {
  const heroRef = useRef(null);
  const y = useParallax(heroRef, 150);

  const portfolioItems = [
    {
      title: "Meta Ads Scaling",
      description: "Scaled ad spend from $10k to $100k/mo while maintaining 3.5x ROAS.",
      image: "https://images.unsplash.com/photo-1625296276703-3fbc924f07b5?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Google Search Dominance",
      description: "Decreased CPA by 45% for a B2B SaaS company.",
      image: "https://images.unsplash.com/photo-1625296276703-3fbc924f07b5?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const calcInputs = [
    { id: 'spend', label: 'Monthly Ad Spend', min: 1000, max: 100000, step: 1000, default: 10000, isCurrency: true },
    { id: 'cpa', label: 'Target CPA', min: 10, max: 500, step: 5, default: 50, isCurrency: true },
    { id: 'clv', label: 'Customer Lifetime Value', min: 100, max: 5000, step: 50, default: 500, isCurrency: true }
  ];

  const calculateROI = (vals) => {
    const customers = vals.spend / vals.cpa;
    const revenue = customers * vals.clv;
    const profit = revenue - vals.spend;
    return {
      revenue_generated: Math.round(revenue),
      roi_percentage: Math.round((profit / vals.spend) * 100),
      cost_per_acquisition: vals.cpa
    };
  };

  const calcResults = [
    { id: 'revenue_generated', label: 'Projected Revenue', icon: DollarSign, isCurrency: true },
    { id: 'cost_per_acquisition', label: 'Target CPA', icon: Target, isCurrency: true },
    { id: 'roi_percentage', label: 'Estimated ROAS', icon: TrendingUp, prefix: '', suffix: '%', colorClass: 'text-[hsl(var(--accent))]' }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Helmet><title>Performance Marketing | Buddy Tezz AI</title></Helmet>
      <ServiceHeader />
      
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[hsl(var(--background))]" />
        
        {/* Chart Animation Background */}
        <div className="absolute inset-0 z-10 flex items-end justify-center opacity-20 pointer-events-none pb-20">
          <div className="flex items-end gap-4 h-64">
            {[40, 60, 45, 80, 65, 100].map((height, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                className="w-16 bg-gradient-to-t from-[hsl(var(--primary))] to-[hsl(var(--accent))] rounded-t-md"
              />
            ))}
          </div>
        </div>

        <motion.div style={{ y }} className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Stop guessing.<br/><span className="text-glow text-[hsl(var(--primary))]">Start scaling.</span>
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Data-driven ad campaigns across Meta, Google, and TikTok designed to maximize your Return on Ad Spend (ROAS).
          </p>
        </motion.div>
      </section>

      <ServiceOverview 
        icon={BarChart3}
        headline="We treat your ad spend like our own."
        description="Through rigorous A/B testing, AI-powered audience targeting, and compelling creative, we build scalable acquisition funnels that predictably turn clicks into customers."
      />

      <PortfolioGrid items={portfolioItems} />

      <ServiceROICalculator 
        title="Ad Spend ROI Predictor"
        description="Calculate your potential revenue based on target acquisition costs."
        inputs={calcInputs}
        calculateResults={calculateROI}
        resultsConfig={calcResults}
      />

      <ServiceCTA 
        headline="Ready to scale your revenue?"
        subheadline="Let's audit your current ad accounts and find the hidden profit."
      />

      <Footer />
    </div>
  );
};

export default PerformanceMarketingPage;
