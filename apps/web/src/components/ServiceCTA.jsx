
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ServiceCTA = ({ headline, subheadline }) => {
  const navigate = useNavigate();

  const handleBookCall = () => {
    // Navigate to home page contact section with smooth scroll
    navigate('/#contact');
    setTimeout(() => {
      const element = document.querySelector('#contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))/10] to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-10 md:p-16 rounded-3xl border-glow"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{headline}</h2>
          <p className="text-lg text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl mx-auto">{subheadline}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleBookCall}
              className="glow-button text-white font-semibold px-8 py-6 text-lg rounded-xl group w-full sm:w-auto"
            >
              Book a Call
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceCTA;
