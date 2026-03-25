
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare } from 'lucide-react';

const ServiceCTA = ({ headline, subheadline }) => {
  const openWhatsApp = () => window.open('https://wa.me/1234567890', '_blank');

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
            <Button className="glow-button text-white font-semibold px-8 py-6 text-lg rounded-xl group w-full sm:w-auto">
              Book a Call
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={openWhatsApp}
              variant="outline" 
              className="bg-[hsl(var(--muted))] text-white border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/80 font-semibold px-8 py-6 text-lg rounded-xl w-full sm:w-auto"
            >
              <MessageSquare className="mr-2 w-5 h-5 text-[#25D366]" />
              WhatsApp Us
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceCTA;
