
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Zap, Cpu, Settings, Target } from 'lucide-react';
import ServiceHeader from '@/components/ServiceHeader.jsx';
import VideoPortfolio from '@/components/VideoPortfolio.jsx';
import BrandSlider from '@/components/BrandSlider.jsx';
import ServiceROICalculator from '@/components/ServiceROICalculator.jsx';
import ServiceCTA from '@/components/ServiceCTA.jsx';
import Footer from '@/components/Footer.jsx';
import { useParallax } from '@/hooks/useParallax.js';
import { floatingAnimation } from '@/lib/animations.js';

const AIAutomationPage = () => {
  const heroRef = useRef(null);
  const y = useParallax(heroRef, 150);


  const calcInputs = [
    { id: 'tasks', label: 'Monthly Tasks', min: 100, max: 10000, step: 100, default: 1000, prefix: '', suffix: '' },
    { id: 'hours', label: 'Hours per Task', min: 0.1, max: 5, step: 0.1, default: 0.5, prefix: '', suffix: 'h' },
    { id: 'rate', label: 'Hourly Rate', min: 10, max: 150, step: 5, default: 25, isCurrency: true }
  ];

  const calculateROI = (vals) => {
    const totalHours = vals.tasks * vals.hours;
    const hoursSaved = totalHours * 0.8; // Assume 80% automation
    const costSaved = hoursSaved * vals.rate;
    return {
      time_saved: Math.round(hoursSaved),
      cost_savings: Math.round(costSaved),
      roi_percentage: 350 // Fixed example ROI
    };
  };

  const calcResults = [
    { id: 'time_saved', label: 'Hours Saved / Mo', icon: Settings, prefix: '', suffix: 'h' },
    { id: 'cost_savings', label: 'Cost Savings / Mo', icon: Target, isCurrency: true },
    { id: 'roi_percentage', label: 'Estimated ROI', icon: Zap, prefix: '', suffix: '%', colorClass: 'text-[hsl(var(--accent))]' }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Helmet><title>AI Automation Systems | Buddy Tezz AI</title></Helmet>
      <ServiceHeader />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--muted))] to-[hsl(var(--background))]" />
        
        {/* Floating Icons */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[Zap, Cpu, Settings, Target].map((Icon, i) => (
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
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-glow mb-6">
            <Zap className="w-4 h-4 text-[hsl(var(--primary))]" />
            <span className="text-sm font-medium text-white">Intelligent Workflows</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Automate the mundane.<br/><span className="text-glow text-[hsl(var(--primary))]">Accelerate the extraordinary.</span>
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Custom AI agents and automation pipelines that work 24/7, eliminating human error and scaling your operations infinitely.
          </p>
        </motion.div>
      </section>

      <VideoPortfolio />
      <BrandSlider />

      <ServiceROICalculator 
        title="AI Automation ROI Calculator"
        description="See how much time and money you can save by automating repetitive tasks."
        inputs={calcInputs}
        calculateResults={calculateROI}
        resultsConfig={calcResults}
      />

      <ServiceCTA 
        headline="Ready to put your business on autopilot?"
        subheadline="Book a free discovery call to identify the best automation opportunities in your workflow."
      />

      <Footer />
    </div>
  );
};

export default AIAutomationPage;
