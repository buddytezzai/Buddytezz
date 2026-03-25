
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceCTA = ({ headline, subheadline }) => {
  const navigate = useNavigate();
  
  const handleBookCall = () => {
    // Navigate to homepage and scroll to contact
    navigate('/', { state: { scrollTo: 'contact' } });
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
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              onClick={handleBookCall}
              className="glow-button text-white font-semibold px-10 py-7 text-xl rounded-2xl group w-full sm:w-auto shadow-xl hover:shadow-[hsl(var(--primary))/20] transition-all"
            >
              Book a free discovery Call
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceCTA;
