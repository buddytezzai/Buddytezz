
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Preloader from '@/components/Preloader.jsx';
import StickyNavBar from '@/components/StickyNavBar.jsx';
import HeroSection from '@/components/HeroSection.jsx';
import ServiceCard from '@/components/ServiceCard.jsx';
import StatCounter from '@/components/StatCounter.jsx';
import TestimonialBlock from '@/components/TestimonialBlock.jsx';
import ROICalculator from '@/components/ROICalculator.jsx';
import ConsultationForm from '@/components/ConsultationForm.jsx';
import FloatingCTA from '@/components/FloatingCTA.jsx';
import Footer from '@/components/Footer.jsx';
import { Toaster } from '@/components/ui/sonner';
import { Zap, Share2, FileText, Globe, Palette, TrendingUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const services = [
    {
      icon: Zap,
      title: 'AI automation systems',
      description: 'Streamline your operations with intelligent automation that saves time and reduces costs.',
      href: '/services/ai-automation'
    },
    {
      icon: Share2,
      title: 'Social media management',
      description: 'Build your brand presence with data-driven social strategies and consistent engagement.',
      href: '/services/social-media'
    },
    {
      icon: FileText,
      title: 'Content creation automation',
      description: 'Generate high-quality content at scale with AI-powered writing and design tools.',
      href: '/services/content-creation'
    },
    {
      icon: Globe,
      title: 'Website development',
      description: 'Create fast, modern websites that convert visitors into customers.',
      href: '/services/website-development'
    },
    {
      icon: Palette,
      title: 'Branding & strategy',
      description: 'Develop a compelling brand identity that resonates with your target audience.',
      href: '/services/branding-strategy'
    },
    {
      icon: TrendingUp,
      title: 'Performance marketing & ads',
      description: 'Drive measurable results with optimized ad campaigns across all major platforms.',
      href: '/services/performance-marketing'
    }
  ];

  const stats = [
    { end: 400, suffix: 'M+', label: 'Total views generated', duration: 2500 },
    { end: 200, suffix: '%', label: 'Average growth rate', duration: 2000 },
    { end: 50, suffix: '+', label: 'Satisfied clients', duration: 2200 },
    { end: 10, suffix: '+', label: 'Brands scaled', duration: 1800 }
  ];

  const testimonials = [
    {
      quote: 'Thanks to their content strategy and social media management, we achieved real growth, crossed 1M+ followers, and generated strong revenue system.',
      author: 'Shlloka',
      role: 'Founder & Creator',
      company: 'Yogic Life Shop'
    },
    {
      quote: 'The AI automation systems saved us 23 hours per week. Our team can now focus on strategy instead of repetitive tasks.',
      author: 'Tania Stanly',
      role: 'Founder',
      company: 'Celestevolve'
    },
    {
      quote: 'ROI increased by 183% within the first quarter. The performance marketing campaigns exceeded all our expectations.',
      author: 'Anupam Saini',
      role: 'Founder',
      company: 'Wonderly.ai'
    }
  ];

  const openWhatsApp = () => window.open('https://wa.me/1234567890', '_blank');

  if (isLoading) {
    return <Preloader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <>
      <Helmet>
        <title>Buddy Tezz AI - Automate Your Business with AI</title>
        <meta name="description" content="We help brands scale with AI automation, content systems and growth strategies." />
      </Helmet>

      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <StickyNavBar />
        <HeroSection />
        <FloatingCTA />

        <section id="services" className="py-20 md:py-24 bg-[hsl(var(--background))]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our services</h2>
              <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
                Comprehensive AI-powered solutions to scale your business
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {services.map((service, index) => (
                <ServiceCard key={service.title} {...service} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section id="results" className="py-20 md:py-24 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--muted))]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat) => <StatCounter key={stat.label} {...stat} />)}
            </div>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((testimonial, index) => <TestimonialBlock key={testimonial.author} {...testimonial} index={index} />)}
            </div>
          </div>
        </section>

        <section id="roi-calculator" className="py-20 md:py-24 bg-[hsl(var(--background))]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ROICalculator />
          </div>
        </section>

        <section id="contact" className="py-20 md:py-24 bg-[hsl(var(--background))]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ConsultationForm />
          </div>
        </section>

        <Footer />
        <Toaster />
      </div>
    </>
  );
};

export default HomePage;
