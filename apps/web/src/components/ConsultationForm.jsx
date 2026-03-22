
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, CheckCircle2 } from 'lucide-react';

const ConsultationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    service: ''
  });

  const services = [
    'AI Automation Systems',
    'Social Media Management',
    'Content Creation Automation',
    'Website Development',
    'Branding & Strategy',
    'Performance Marketing & Ads'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.service) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submissions = JSON.parse(localStorage.getItem('consultationSubmissions') || '[]');
      submissions.push({
        ...formData,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('consultationSubmissions', JSON.stringify(submissions));

      toast({
        title: "Consultation request received",
        description: "We'll contact you within 24 hours to schedule your free AI strategy call."
      });

      setFormData({
        name: '',
        businessName: '',
        phone: '',
        email: '',
        service: ''
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="glass-card border-glow max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle asChild>
            <h3 className="text-3xl font-bold text-[hsl(var(--foreground))]">
              Book your free AI strategy call
            </h3>
          </CardTitle>
          <CardDescription className="text-lg text-[hsl(var(--muted-foreground))]">
            Let's discuss how AI can transform your business
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6" aria-label="Consultation booking form">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium text-[hsl(var(--foreground))]">
                Your name <span className="text-[hsl(var(--destructive))]" aria-hidden="true">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Maya Chen"
                className="bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:ring-[hsl(var(--primary))]"
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-base font-medium text-[hsl(var(--foreground))]">
                Business name
              </Label>
              <Input
                id="businessName"
                type="text"
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                placeholder="Meridian Labs"
                className="bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:ring-[hsl(var(--primary))]"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium text-[hsl(var(--foreground))]">
                  Phone number <span className="text-[hsl(var(--destructive))]" aria-hidden="true">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:ring-[hsl(var(--primary))]"
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium text-[hsl(var(--foreground))]">
                  Email address <span className="text-[hsl(var(--destructive))]" aria-hidden="true">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="maya@meridian.com"
                  className="bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:ring-[hsl(var(--primary))]"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service" className="text-base font-medium text-[hsl(var(--foreground))]">
                Service interested in <span className="text-[hsl(var(--destructive))]" aria-hidden="true">*</span>
              </Label>
              <Select value={formData.service} onValueChange={(value) => handleChange('service', value)} required>
                <SelectTrigger id="service" className="bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] focus:ring-[hsl(var(--primary))]" aria-label="Select a service">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full glow-button text-white font-semibold py-6 text-lg rounded-xl group"
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CheckCircle2 className="mr-2 w-5 h-5 animate-spin" aria-hidden="true" />
                  Submitting...
                </>
              ) : (
                <>
                  Book free AI strategy call
                  <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConsultationForm;
