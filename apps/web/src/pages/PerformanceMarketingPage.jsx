
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Target, DollarSign, Zap } from 'lucide-react';
import ServiceHeader from '@/components/ServiceHeader.jsx';
import ImageShowcase from '@/components/ImageShowcase.jsx';
import ServiceROICalculator from '@/components/ServiceROICalculator.jsx';
import ServiceCTA from '@/components/ServiceCTA.jsx';
import Footer from '@/components/Footer.jsx';
import { useParallax } from '@/hooks/useParallax.js';
import { floatingAnimation } from '@/lib/animations.js';

const PerformanceMarketingPage = () => {
  const heroRef = useRef(null);
  const y = useParallax(heroRef, 150);


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
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--muted))] to-[hsl(var(--background))]" />
        
        {/* Floating Icons */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[TrendingUp, BarChart3, Target, DollarSign].map((Icon, i) => (
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
            Stop guessing.<br/><span className="text-glow text-[hsl(var(--primary))]">Start scaling.</span>
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Data-driven ad campaigns across Meta, Google, and TikTok designed to maximize your Return on Ad Spend (ROAS).
          </p>
        </motion.div>
      </section>

      <ImageShowcase 
        title="📈 Performance Showcases"
        subtitle="Data-driven growth systems designed for high-performance scaling and customer retention."
        items={[
          {
            image: '/images/ecommerce_funnel.png',
            title: 'High-converting E-commerce Funnel',
            description: 'Optimized multi-stage funnels designed to maximize ROAS and average order value.'
          },
          {
            image: '/images/app_growth.png',
            title: 'App Install Growth System',
            description: 'Scalable user acquisition strategies for mobile apps across Meta, Google, and TikTok.'
          },
          {
            image: '/images/retention_flow.png',
            title: 'Retention & Lifecycle Marketing Flow',
            description: 'Automated loyalty and engagement systems that turn one-time buyers into lifelong fans.'
          }
        ]}
      />

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
