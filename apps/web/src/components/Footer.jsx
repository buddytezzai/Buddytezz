
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const quickLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Results', href: '#results' },
    { label: 'ROI Calculator', href: '#roi-calculator' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="bg-[hsl(var(--background))] border-t border-[hsl(var(--border))] py-16" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://horizons-cdn.hostinger.com/e8899cff-47c0-4fa0-a3d5-02b5278d01c4/f9785657bb3b62a1888faa1e5159e176.png" 
                alt="Buddy Tezz AI Logo" 
                className="h-16 w-auto md:h-20 object-contain"
              />
              <span className="text-xl md:text-2xl font-bold text-white font-['Outfit'] whitespace-nowrap tracking-tight">
                Buddy Tezz AI
              </span>
            </div>
            <p className="text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-sm">
              AI-powered business automation and growth strategies for modern brands.
            </p>
          </div>

          <div>
            <p className="font-semibold text-lg text-[hsl(var(--foreground))] mb-6">Quick links</p>
            <nav className="space-y-3" aria-label="Footer Navigation">
              {quickLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="block text-base text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] rounded px-1 -ml-1"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-semibold text-lg text-[hsl(var(--foreground))] mb-6">Connect with us</p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={`Follow us on ${social.label}`}
                  className="w-12 h-12 rounded-xl bg-[hsl(var(--muted))] flex items-center justify-center text-[hsl(var(--foreground))] hover:bg-[hsl(var(--primary))] hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]"
                >
                  <social.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
            <a
              href="mailto:hello@buddytezz.ai"
              className="flex items-center space-x-3 mt-6 text-base text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] rounded px-1 -ml-1 w-fit"
              aria-label="Email us at hello@buddytezz.ai"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              <span>hello@buddytezz.ai</span>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-[hsl(var(--border))] flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            © 2026 Buddy Tezz AI. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] rounded px-1">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] rounded px-1">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
