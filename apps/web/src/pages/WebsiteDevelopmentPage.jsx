
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Globe, Code, Layout, MousePointerClick, Zap } from 'lucide-react';
import ServiceHeader from '@/components/ServiceHeader.jsx';
import ImageShowcase from '@/components/ImageShowcase.jsx';
import ServiceROICalculator from '@/components/ServiceROICalculator.jsx';
import ServiceCTA from '@/components/ServiceCTA.jsx';
import Footer from '@/components/Footer.jsx';
import SocialLinks from '@/components/SocialLinks.jsx';
import { useParallax } from '@/hooks/useParallax.js';
import { floatingAnimation } from '@/lib/animations.js';

const WebsiteDevelopmentPage = () => {
  const heroRef = useRef(null);
  const y = useParallax(heroRef, 150);


  const calcInputs = [
    { id: 'visitors', label: 'Monthly Visitors', min: 1000, max: 500000, step: 1000, default: 50000, prefix: '', suffix: '' },
    { id: 'conversion', label: 'Current Conversion', min: 0.1, max: 10, step: 0.1, default: 1.5, prefix: '', suffix: '%' },
    { id: 'aov', label: 'Average Order Value', min: 10, max: 1000, step: 10, default: 100, isCurrency: true }
  ];

  const calculateROI = (vals) => {
    const currentRev = vals.visitors * (vals.conversion / 100) * vals.aov;
    const newConversion = vals.conversion * 1.4; // 40% improvement
    const newRev = vals.visitors * (newConversion / 100) * vals.aov;
    return {
      monthly_revenue: Math.round(newRev),
      conversion_improvement: 40,
      roi_percentage: Math.round(((newRev - currentRev) / currentRev) * 100)
    };
  };

  const calcResults = [
    { id: 'monthly_revenue', label: 'Projected Revenue', icon: Globe, isCurrency: true },
    { id: 'conversion_improvement', label: 'Conversion Lift', icon: MousePointerClick, prefix: '+', suffix: '%' },
    { id: 'roi_percentage', label: 'Revenue Growth', icon: Layout, prefix: '+', suffix: '%', colorClass: 'text-[hsl(var(--accent))]' }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Helmet><title>Website Development | Buddy Tezz AI</title></Helmet>
      <ServiceHeader />
      
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--muted))] to-[hsl(var(--background))]" />
        
        {/* Floating Icons */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[Globe, Code, Layout, MousePointerClick].map((Icon, i) => (
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
            Digital experiences that<br/><span className="text-glow text-[hsl(var(--primary))]">convert on contact.</span>
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Lightning-fast, SEO-optimized websites engineered for maximum performance and user engagement.
          </p>
        </motion.div>
      </section>

      <ImageShowcase 
        title="🌐 Website Showcases"
        subtitle="High-performance, conversion-focused websites tailored for different business needs."
        items={[
          {
            image: '/images/ecommerce_mockup.png',
            title: 'E-commerce Website',
            description: 'Built for conversions and seamless checkout experience.'
          },
          {
            image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=2000',
            title: 'Portfolio / Personal Brand Website',
            description: 'Clean portfolio design focused on personal branding.'
          },
          {
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000',
            title: 'Service-Based Business Website',
            description: 'Lead-focused service website with strong CTA structure.'
          }
        ]}
      />

      <ServiceROICalculator 
        title="Website Redesign ROI"
        description="See how a faster, better-converting website impacts your bottom line."
        inputs={calcInputs}
        calculateResults={calculateROI}
        resultsConfig={calcResults}
      />

      <ServiceCTA 
        headline="Build your digital future"
        subheadline="Premium web experiences that convert."
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

export default WebsiteDevelopmentPage;
