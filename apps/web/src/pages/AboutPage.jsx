import React from 'react';
import { Helmet } from 'react-helmet';
import ServiceHeader from '@/components/ServiceHeader.jsx';
import Footer from '@/components/Footer.jsx';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Helmet>
        <title>About Us | Buddy Tezz AI</title>
        <meta name="description" content="Buddy Tezz AI is a growth-focused digital agency built to help businesses scale faster using AI, automation, and smart content systems." />
      </Helmet>

      <ServiceHeader />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-['Outfit'] text-white mb-6">
            About Buddy Tezz AI
          </h1>
          <div className="w-24 h-1 bg-[hsl(var(--primary))] mx-auto rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
        </div>

        <div className="space-y-8 text-lg md:text-xl text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl mx-auto">
          <p>
            Buddy Tezz AI is a growth-focused digital agency built to help businesses scale faster using AI, automation, and smart content systems.
          </p>

          <p>
            We work with brands, creators, and small businesses to simplify their marketing and operations. From social media management and content creation to performance marketing and website development, we focus on building systems that drive real results, not just vanity metrics.
          </p>

          <div className="p-8 my-10 bg-[hsl(var(--muted))] border border-[hsl(var(--primary))/20] rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[hsl(var(--primary))] shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
            <p className="text-white italic relative z-10">
              Our approach is simple, we don't just create content or run ads. We design structured growth engines where every part of your business works together, content, automation, and strategy.
            </p>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[hsl(var(--primary))] opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-500"></div>
          </div>

          <p>
            At Buddy Tezz AI, the goal is to turn scattered efforts into a clear, scalable brand that generates consistent reach, engagement, and revenue.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
