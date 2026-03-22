
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, Video, PenTool, Clock, DollarSign } from 'lucide-react';
import ServiceHeader from '@/components/ServiceHeader.jsx';
import ServiceOverview from '@/components/ServiceOverview.jsx';
import PortfolioGrid from '@/components/PortfolioGrid.jsx';
import ServiceROICalculator from '@/components/ServiceROICalculator.jsx';
import ServiceCTA from '@/components/ServiceCTA.jsx';
import Footer from '@/components/Footer.jsx';
import { useParallax } from '@/hooks/useParallax.js';

const ContentCreationPage = () => {
  const heroRef = useRef(null);
  const y = useParallax(heroRef, 150);

  const portfolioItems = [
    {
      title: "AI Blog Network",
      description: "Generated 100+ SEO-optimized articles per month.",
      image: "https://images.unsplash.com/photo-1546663250-e28569a9706d?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Video Repurposing",
      description: "Turned 1 podcast into 30 pieces of micro-content.",
      image: "https://images.unsplash.com/photo-1546663250-e28569a9706d?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const calcInputs = [
    { id: 'pieces', label: 'Content Pieces / Mo', min: 10, max: 500, step: 10, default: 50, prefix: '', suffix: '' },
    { id: 'hours', label: 'Hours per Piece', min: 1, max: 10, step: 0.5, default: 3, prefix: '', suffix: 'h' },
    { id: 'rate', label: 'Creator Hourly Rate', min: 20, max: 200, step: 10, default: 50, isCurrency: true }
  ];

  const calculateROI = (vals) => {
    const totalManualHours = vals.pieces * vals.hours;
    const aiHours = totalManualHours * 0.2; // AI takes 20% of the time
    const hoursSaved = totalManualHours - aiHours;
    return {
      total_hours_saved: Math.round(hoursSaved),
      cost_savings: Math.round(hoursSaved * vals.rate),
      content_output_increase: 500 // 5x output
    };
  };

  const calcResults = [
    { id: 'total_hours_saved', label: 'Hours Saved', icon: Clock, prefix: '', suffix: 'h' },
    { id: 'cost_savings', label: 'Cost Savings', icon: DollarSign, isCurrency: true },
    { id: 'content_output_increase', label: 'Output Increase', icon: FileText, prefix: '', suffix: '%', colorClass: 'text-[hsl(var(--accent))]' }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Helmet><title>Content Creation Automation | Buddy Tezz AI</title></Helmet>
      <ServiceHeader />
      
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[hsl(var(--background))]" />
        
        {/* Sliding Content Cards Background */}
        <div className="absolute inset-0 z-10 overflow-hidden opacity-20 flex gap-4 transform -rotate-12 scale-150">
          {[1,2,3].map((col) => (
            <motion.div 
              key={col}
              animate={{ y: col % 2 === 0 ? [0, -1000] : [-1000, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex flex-col gap-4"
            >
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-64 h-40 glass-card rounded-xl" />
              ))}
            </motion.div>
          ))}
        </div>

        <motion.div style={{ y }} className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Content at scale.<br/><span className="text-glow text-[hsl(var(--primary))]">Quality uncompromised.</span>
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Leverage AI to generate, edit, and distribute months of high-quality content in days.
          </p>
        </motion.div>
      </section>

      <ServiceOverview 
        icon={FileText}
        headline="Feed the algorithm without burning out."
        description="We build automated content engines that turn your core ideas into blogs, social posts, newsletters, and videos automatically."
      />

      <PortfolioGrid items={portfolioItems} />

      <ServiceROICalculator 
        title="Content Engine ROI"
        description="Calculate the value of automating your content production pipeline."
        inputs={calcInputs}
        calculateResults={calculateROI}
        resultsConfig={calcResults}
      />

      <ServiceCTA 
        headline="Never run out of content again."
        subheadline="Let's build your automated content machine."
      />

      <Footer />
    </div>
  );
};

export default ContentCreationPage;
