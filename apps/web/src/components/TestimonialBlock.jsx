
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const TestimonialBlock = ({ quote, author, role, company, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="glass-card h-full border-[hsl(var(--border))] hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6 space-y-4">
          <Quote className="w-10 h-10 text-[hsl(var(--primary))] opacity-50" aria-hidden="true" />
          <blockquote className="text-base text-[hsl(var(--foreground))] leading-relaxed">
            "{quote}"
          </blockquote>
          <div className="pt-4 border-t border-[hsl(var(--border))]">
            <cite className="not-italic">
              <p className="font-semibold text-[hsl(var(--foreground))]">{author}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {role} at {company}
              </p>
            </cite>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialBlock;
