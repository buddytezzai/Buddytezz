import React from 'react';
import { Instagram, Linkedin, Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const SOCIAL_DATA = [
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://www.instagram.com/buddy_tezz/?hl=en',
    color: 'hover:text-[#E4405F]',
    glow: 'group-hover:shadow-[0_0_15px_rgba(228,64,95,0.4)]'
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/buddy-tezz-3b8466280/',
    color: 'hover:text-[#0A66C2]',
    glow: 'group-hover:shadow-[0_0_15px_rgba(10,102,194,0.4)]'
  },
  {
    name: 'Facebook',
    icon: Facebook,
    href: 'https://www.facebook.com/BuddyTezz',
    color: 'hover:text-[#1877F2]',
    glow: 'group-hover:shadow-[0_0_15px_rgba(24,119,242,0.4)]'
  },
  {
    name: 'X (Twitter)',
    icon: Twitter,
    href: 'https://x.com/BuddyTezz',
    color: 'hover:text-white',
    glow: 'group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]'
  }
];

const SocialLinks = ({ className = "", iconSize = 20, variant = "horizontal" }) => {
  return (
    <div className={`flex ${variant === 'vertical' ? 'flex-col space-y-4' : 'flex-row space-x-4'} ${className}`}>
      {SOCIAL_DATA.map((social) => (
        <motion.a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Follow us on ${social.name}`}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          className={`group relative p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[hsl(var(--muted-foreground))] transition-all duration-300 ${social.color} ${social.glow} hover:bg-white/10 hover:border-white/20`}
        >
          <social.icon size={iconSize} strokeWidth={1.5} />
        </motion.a>
      ))}
    </div>
  );
};

export default SocialLinks;
