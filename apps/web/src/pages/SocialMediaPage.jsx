
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Share2, Users, Heart, Eye } from 'lucide-react';
import ServiceHeader from '@/components/ServiceHeader.jsx';
import ServiceOverview from '@/components/ServiceOverview.jsx';
import VideoPortfolio from '@/components/VideoPortfolio.jsx';
import BrandSlider from '@/components/BrandSlider.jsx';
import SocialMediaROICalculator from '@/components/SocialMediaROICalculator.jsx';
import ServiceCTA from '@/components/ServiceCTA.jsx';
import Footer from '@/components/Footer.jsx';
import { useParallax } from '@/hooks/useParallax.js';
import { floatingAnimation } from '@/lib/animations.js';

const SocialMediaPage = () => {
  const heroRef = useRef(null);
  const y = useParallax(heroRef, 150);

  const portfolioItems = [
    {
      title: "Viral TikTok Campaign",
      description: "Grew a lifestyle brand from 0 to 100k followers in 2 months.",
      image: "https://images.unsplash.com/photo-1686061594225-3e92c0cd51b0?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "B2B LinkedIn Strategy",
      description: "Generated 50+ high-ticket leads through organic content.",
      image: "https://images.unsplash.com/photo-1686061594225-3e92c0cd51b0?auto=format&fit=crop&q=80&w=800"
    }
  ];



  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Helmet><title>Social Media Management | Buddy Tezz AI</title></Helmet>
      <ServiceHeader />

      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--muted))] to-[hsl(var(--background))]" />

        {/* Floating Social Icons */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[Share2, Heart, Users, Eye].map((Icon, i) => (
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
            Dominate the feed.<br /><span className="text-glow text-[hsl(var(--primary))]">Capture the culture.</span>
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Data-driven social media strategies that turn passive scrollers into active brand advocates.
          </p>
        </motion.div>
      </section>


      <VideoPortfolio />
      <BrandSlider />

      <SocialMediaROICalculator />

      <ServiceCTA
        headline="Ready to go viral?"
        subheadline="Let's build a social strategy that actually drives revenue."
      />

      <Footer />
    </div>
  );
};

export default SocialMediaPage;
