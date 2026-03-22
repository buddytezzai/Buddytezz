
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import RegionSelector from '@/components/RegionSelector.jsx';
import { useRegion } from '@/hooks/useRegion.js';

const ServiceROICalculator = ({ title, description, inputs, calculateResults, resultsConfig }) => {
  const { config } = useRegion();
  const m = config.multiplier;

  // State holds base USD values
  const [values, setValues] = useState(() => {
    const initial = {};
    inputs.forEach(input => { initial[input.id] = input.default; });
    return initial;
  });

  const [results, setResults] = useState({});

  useEffect(() => {
    setResults(calculateResults(values));
  }, [values, calculateResults]);

  const handleValueChange = (id, val, isCurrency) => {
    // Convert scaled slider value back to base USD value for state
    const baseValue = isCurrency ? val[0] / m : val[0];
    setValues(prev => ({ ...prev, [id]: baseValue }));
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="glass-card border-glow">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-white">{title}</CardTitle>
              <CardDescription className="text-lg text-[hsl(var(--muted-foreground))] mt-2">{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-6 md:p-10">
              
              <RegionSelector />

              <div className="grid md:grid-cols-3 gap-8">
                {inputs.map((input) => {
                  const scaledValue = input.isCurrency ? values[input.id] * m : values[input.id];
                  const displayValue = input.isCurrency 
                    ? config.formatCurrency(scaledValue) 
                    : `${input.prefix || ''}${config.formatNumber(scaledValue)}${input.suffix || ''}`;

                  return (
                    <div key={input.id} className="space-y-4">
                      <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{input.label}</Label>
                      <div className="text-2xl font-bold text-[hsl(var(--primary))]">
                        {displayValue}
                      </div>
                      <Slider
                        value={[scaledValue]}
                        onValueChange={(val) => handleValueChange(input.id, val, input.isCurrency)}
                        min={input.isCurrency ? input.min * m : input.min}
                        max={input.isCurrency ? input.max * m : input.max}
                        step={input.isCurrency ? input.step * m : input.step}
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-[hsl(var(--border))]">
                {resultsConfig.map((res, idx) => {
                  const Icon = res.icon;
                  const rawResult = results[res.id] || 0;
                  const scaledResult = res.isCurrency ? rawResult * m : rawResult;
                  const displayResult = res.isCurrency 
                    ? config.formatCurrency(scaledResult)
                    : `${res.prefix || ''}${config.formatNumber(scaledResult)}${res.suffix || ''}`;

                  return (
                    <motion.div key={idx} whileHover={{ scale: 1.02 }} className="glass-card p-6 rounded-xl text-center space-y-3 bg-[hsl(var(--muted))/30]">
                      <Icon className={`w-8 h-8 mx-auto ${res.colorClass || 'text-[hsl(var(--primary))]'}`} />
                      <div className="text-3xl font-bold text-white text-glow">
                        {displayResult}
                      </div>
                      <div className="text-sm text-[hsl(var(--muted-foreground))] font-medium">{res.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceROICalculator;
