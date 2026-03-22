
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Globe, Code, Layout, MousePointerClick } from 'lucide-react';
import ServiceHeader from '@/components/ServiceHeader.jsx';
import ServiceOverview from '@/components/ServiceOverview.jsx';
import PortfolioGrid from '@/components/PortfolioGrid.jsx';
import ServiceROICalculator from '@/components/ServiceROICalculator.jsx';
import ServiceCTA from '@/components/ServiceCTA.jsx';
import Footer from '@/components/Footer.jsx';
import { useParallax } from '@/hooks/useParallax.js';

const WebsiteDevelopmentPage = () => {
  const heroRef = useRef(null);
  const y = useParallax(heroRef, 150);

  const portfolioItems = [
    {
      title: "E-Commerce Platform",
      description: "Custom headless Shopify build increasing conversions by 45%.",
      image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "SaaS Marketing Site",
      description: "High-performance React site with sub-second load times.",
      image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=800"
    }
  ];

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
        <div className="absolute inset-0 z-0 bg-[hsl(var(--background))]" />
        
        {/* Code Snippet Background */}
        <div className="absolute inset-0 z-10 opacity-10 font-mono text-sm text-[hsl(var(--primary))] p-8 overflow-hidden whitespace-pre">
          {`function optimizeConversion(traffic) {
  const speed = measureLoadTime();
  if (speed > 1000) return optimizeAssets();
  return traffic.map(user => convert(user));
}

const App = () => (
  <ThemeProvider>
    <Hero />
    <Features />
  </ThemeProvider>
);`}
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

      <ServiceOverview 
        icon={Globe}
        headline="Your website is your best salesperson."
        description="We build modern web applications using React and Next.js that load instantly, rank higher on Google, and guide users seamlessly toward conversion."
      />

      <PortfolioGrid items={portfolioItems} />

      <ServiceROICalculator 
        title="Website Redesign ROI"
        description="See how a faster, better-converting website impacts your bottom line."
        inputs={calcInputs}
        calculateResults={calculateROI}
        resultsConfig={calcResults}
      />

      <ServiceCTA 
        headline="Upgrade your digital storefront."
        subheadline="Let's build a website that works as hard as you do."
      />

      <Footer />
    </div>
  );
};

export default WebsiteDevelopmentPage;
