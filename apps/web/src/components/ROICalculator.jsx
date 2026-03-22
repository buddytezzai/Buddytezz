
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, DollarSign, Users } from 'lucide-react';
import RegionSelector from '@/components/RegionSelector.jsx';
import { useRegion } from '@/hooks/useRegion.js';

const ROICalculator = () => {
  const { config } = useRegion();
  const m = config.multiplier;

  // State holds base USD values
  const [monthlySpend, setMonthlySpend] = useState(5000);
  const [monthlyLeads, setMonthlyLeads] = useState(100);
  const [conversionRate, setConversionRate] = useState(5);

  const [roi, setRoi] = useState({ revenue: 0, growth: 0, customers: 0 });

  useEffect(() => {
    const avgDealValue = 500; // Base USD deal value
    const customers = Math.floor((monthlyLeads * conversionRate) / 100);
    const revenue = customers * avgDealValue;
    const growth = ((revenue - monthlySpend) / monthlySpend) * 100;

    setRoi({
      revenue: revenue,
      growth: Math.max(growth, 0),
      customers: customers
    });
  }, [monthlySpend, monthlyLeads, conversionRate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="glass-card border-glow max-w-4xl mx-auto">
        <CardHeader className="text-center pb-2">
          <CardTitle asChild>
            <h2 className="text-3xl font-bold text-[hsl(var(--foreground))]">
              Calculate your ROI
            </h2>
          </CardTitle>
          <CardDescription className="text-lg text-[hsl(var(--muted-foreground))] mt-2">
            See how AI automation can transform your business growth
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6 md:p-8">
          
          <RegionSelector />

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <Label htmlFor="monthly-spend" className="text-base font-medium text-[hsl(var(--foreground))]">
                Monthly marketing spend
              </Label>
              <div className="text-2xl font-bold text-[hsl(var(--primary))]" aria-live="polite">
                {config.formatCurrency(monthlySpend * m)}
              </div>
              <Slider
                id="monthly-spend"
                value={[monthlySpend * m]}
                onValueChange={(value) => setMonthlySpend(value[0] / m)}
                min={1000 * m}
                max={50000 * m}
                step={500 * m}
                className="w-full"
                aria-label="Monthly marketing spend slider"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="monthly-leads" className="text-base font-medium text-[hsl(var(--foreground))]">
                Monthly leads
              </Label>
              <div className="text-2xl font-bold text-[hsl(var(--primary))]" aria-live="polite">
                {config.formatNumber(monthlyLeads)}
              </div>
              <Slider
                id="monthly-leads"
                value={[monthlyLeads]}
                onValueChange={(value) => setMonthlyLeads(value[0])}
                min={10}
                max={1000}
                step={10}
                className="w-full"
                aria-label="Monthly leads slider"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="conversion-rate" className="text-base font-medium text-[hsl(var(--foreground))]">
                Conversion rate
              </Label>
              <div className="text-2xl font-bold text-[hsl(var(--primary))]" aria-live="polite">
                {config.formatNumber(conversionRate)}%
              </div>
              <Slider
                id="conversion-rate"
                value={[conversionRate]}
                onValueChange={(value) => setConversionRate(value[0])}
                min={1}
                max={20}
                step={0.5}
                className="w-full"
                aria-label="Conversion rate slider"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-[hsl(var(--border))]" aria-live="polite">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 rounded-xl text-center space-y-3 bg-[hsl(var(--muted))/30]"
            >
              <DollarSign className="w-8 h-8 text-[hsl(var(--primary))] mx-auto" aria-hidden="true" />
              <div className="text-3xl font-bold text-[hsl(var(--foreground))] text-glow">
                {config.formatCurrency(roi.revenue * m)}
              </div>
              <div className="text-sm text-[hsl(var(--muted-foreground))] font-medium">
                Projected monthly revenue
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 rounded-xl text-center space-y-3 bg-[hsl(var(--muted))/30]"
            >
              <TrendingUp className="w-8 h-8 text-[hsl(var(--accent))] mx-auto" aria-hidden="true" />
              <div className="text-3xl font-bold text-[hsl(var(--foreground))] text-glow">
                {config.formatNumber(roi.growth)}%
              </div>
              <div className="text-sm text-[hsl(var(--muted-foreground))] font-medium">
                ROI growth rate
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 rounded-xl text-center space-y-3 bg-[hsl(var(--muted))/30]"
            >
              <Users className="w-8 h-8 text-[hsl(var(--primary))] mx-auto" aria-hidden="true" />
              <div className="text-3xl font-bold text-[hsl(var(--foreground))] text-glow">
                {config.formatNumber(roi.customers)}
              </div>
              <div className="text-sm text-[hsl(var(--muted-foreground))] font-medium">
                New customers per month
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ROICalculator;
