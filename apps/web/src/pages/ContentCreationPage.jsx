
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, Video, PenTool, Clock, DollarSign, Zap } from 'lucide-react';
import ServiceHeader from '@/components/ServiceHeader.jsx';
import ImageShowcase from '@/components/ImageShowcase.jsx';
import ServiceROICalculator from '@/components/ServiceROICalculator.jsx';
import ServiceCTA from '@/components/ServiceCTA.jsx';
import Footer from '@/components/Footer.jsx';
import SocialLinks from '@/components/SocialLinks.jsx';
import { useParallax } from '@/hooks/useParallax.js';
import { floatingAnimation } from '@/lib/animations.js';

const ContentCreationPage = () => {
  const heroRef = useRef(null);
  const y = useParallax(heroRef, 150);


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
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--muted))] to-[hsl(var(--background))]" />
        
        {/* Floating Icons */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[FileText, Video, PenTool, Zap].map((Icon, i) => (
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
            Content at scale.<br/><span className="text-glow text-[hsl(var(--primary))]">Quality uncompromised.</span>
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Leverage AI to generate, edit, and distribute months of high-quality content in days.
          </p>
        </motion.div>
      </section>

      <ImageShowcase 
        title="✨ Creative AI Showcase"
        subtitle="Experience the future of content production with AI-driven visuals and avatars."
        items={[
          {
            type: 'video',
            id: 'tvmjI5nVgIQ',
            title: 'AI Avatar / Clone Video Creation',
            description: 'Hyper-realistic digital clones that deliver your message with perfect precision and scale.'
          },
          {
            type: 'image',
            image: '/images/content_workflow.png',
            title: 'Niche Content Research Using AI & AI Agents',
            description: 'Automated deep-dives into trending topics and audience behavior for maximum reach.'
          }
        ]}
      />

      <ServiceROICalculator 
        title="Content Engine ROI"
        description="Calculate the value of automating your content production pipeline."
        inputs={calcInputs}
        calculateResults={calculateROI}
        resultsConfig={calcResults}
      />

      <ServiceCTA 
        headline="Elevate your content"
        subheadline="Let's create something viral together."
      />

      <section className="py-12 border-t border-white/5 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-6 font-['Outfit']">Follow our journey</h3>
          <SocialLinks className="justify-center" iconSize={24} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContentCreationPage;
