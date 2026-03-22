
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description, href, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={href} className="block h-full">
        <Card className="glass-card h-full group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50">
          <CardHeader className="space-y-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[hsl(var(--primary))]/20">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <CardTitle asChild>
                  <h3 className="text-xl font-semibold text-white leading-snug group-hover:text-[hsl(var(--primary))] transition-colors">
                    {title}
                  </h3>
                </CardTitle>
                <ArrowUpRight className="w-5 h-5 text-[hsl(var(--primary))] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
              </div>
              <CardDescription className="text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                {description}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;
