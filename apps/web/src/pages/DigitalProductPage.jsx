
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Star, Shield, Zap, TrendingUp, BookOpen, Users,
  Target, Clock, Download, ArrowRight, Lock, Mail, Sparkles, ChevronDown
} from 'lucide-react';
import StickyNavBar from '@/components/StickyNavBar.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCheckoutModal from '@/components/ProductCheckoutModal.jsx';
import { Button } from '@/components/ui/button';

// ── Product Config ────────────────────────────────────────────────────────
const PRODUCT = {
  name: 'Personal Budget Tracker Template',
  tagline: 'Take full control of your finances with automated income, expense, savings & investment tracking in one powerful Excel spreadsheet.',
  priceINR: '₹99',
  priceUSD: '$1.99',
  originalPriceINR: '₹499',
  format: 'Excel (.xlsx)',
  pages: 'Automated Spreadsheets',
  instant: true,
};

const whatsInside = [
  { icon: Zap, title: 'Automated Monthly & Annual Dashboards', desc: 'Real-time charts, spending breakdowns, and cash-flow summaries calculated automatically as you enter data.' },
  { icon: Target, title: 'Income & Expense Categorization', desc: 'Customizable spending buckets, recurring bill trackers, and debt payoff planning built right in.' },
  { icon: TrendingUp, title: 'Savings & Net Worth Tracker', desc: 'Track your savings goals, emergency fund, investments, and net worth growth month-over-month.' },
  { icon: BookOpen, title: 'Simple Step-by-Step Instructions', desc: 'Zero Excel expertise needed — clean layout with plug-and-play formulas and guidance notes.' },
  { icon: Users, title: 'Smart Financial Insights', desc: 'Visual progress meters and alerts to help you identify overspending and stay within budget effortlessly.' },
  { icon: Shield, title: '100% Private & Offline Ready', desc: 'No monthly subscriptions or third-party bank access required. Your financial data stays securely on your device.' },
];

const whoItsFor = [
  'Working professionals & freelancers managing personal or business cash flow',
  'Anyone aiming to boost monthly savings and hit financial independence goals',
  'Individuals who want clean, automated expense & investment tracking without subscription apps',
  'Couples and families planning monthly budgets and managing debt payoffs',
  'Anyone wanting clarity, control, and peace of mind over their finances',
];

const testimonials = [
  { quote: 'This template completely changed how I manage my money. The automated dashboards give me instant clarity on where every single rupee goes.', author: 'Shlloka', role: 'Creator & Entrepreneur', rating: 5 },
  { quote: 'No complex setup or formulas to fix. I plugged in my monthly numbers and had a complete financial dashboard ready in 5 minutes.', author: 'Tania Stanly', role: 'Agency Founder', rating: 5 },
  { quote: 'Helped me cut down unnecessary expenses by 30% in month one. The savings goal tracker is super motivating.', author: 'Anupam Saini', role: 'Tech Lead & Investor', rating: 5 },
];

const faqs = [
  { q: 'Can I access the product before purchasing?', a: 'No — the product is gated. You will receive your secure instant download link right after successful payment.' },
  { q: 'How do I receive my purchase?', a: 'Instantly! You will receive an email with a secure download link within seconds of payment confirmation.' },
  { q: 'Is the download link permanent?', a: 'Download links are active for 24 hours. If yours expires, just email buddytezzai@gmail.com with your Payment ID and we will send a fresh one right away.' },
  { q: 'What software do I need to open the file?', a: 'The template is delivered as an Excel (.xlsx) file. It works perfectly in Microsoft Excel (desktop/online), Google Sheets, Apple Numbers, and LibreOffice.' },
  { q: 'Do I need advanced Excel knowledge?', a: 'Not at all! Everything is pre-formatted with built-in formulas, automated charts, and clear instructions so you can start right away.' },
  { q: 'Is payment secure?', a: 'Yes — payments are processed securely via Razorpay with 256-bit SSL encryption. We accept UPI, Cards, Net Banking, and Wallets.' },
];

const DigitalProductPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [showMobileStickyBar, setShowMobileStickyBar] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowMobileStickyBar(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>Personal Budget Tracker Template — Buddy Tezz AI</title>
        <meta name="description" content="Get the Personal Budget Tracker Excel Template. Automated income, expense, savings & investment dashboards with zero monthly fees. Instant download." />
      </Helmet>

      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <StickyNavBar />

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16" aria-label="Product hero">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[hsl(var(--primary))/0.07] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[hsl(var(--accent))/0.05] rounded-full blur-3xl" />
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left — Text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center lg:text-left"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-[hsl(var(--primary))/0.15] text-[hsl(var(--primary))] border border-[hsl(var(--primary))/0.3] mb-6"
                >
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  Excel Template · Instant Digital Download
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Personal Budget{' '}
                  <span className="text-glow bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
                    Tracker Template
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-base sm:text-lg md:text-xl text-[hsl(var(--muted-foreground))] leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
                >
                  {PRODUCT.tagline}
                </motion.p>

                {/* Social proof row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8 text-xs sm:text-sm text-[hsl(var(--muted-foreground))]"
                >
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />)}
                    <span className="ml-1 font-medium text-white">5.0</span>
                  </div>
                  <span className="text-[hsl(var(--border))]">·</span>
                  <span>50+ Happy Buyers</span>
                  <span className="text-[hsl(var(--border))]">·</span>
                  <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" aria-hidden="true" /> Instant Access</span>
                </motion.div>

                {/* Pricing + CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                >
                  <div className="text-center lg:text-left">
                    <div className="flex items-baseline justify-center lg:justify-start gap-3">
                      <span className="text-4xl font-black text-white">{PRODUCT.priceINR}</span>
                      <span className="text-lg text-[hsl(var(--muted-foreground))]">{PRODUCT.priceUSD}</span>
                      <span className="text-base text-[hsl(var(--muted-foreground))] line-through">{PRODUCT.originalPriceINR}</span>
                    </div>
                    <p className="text-xs text-green-400 mt-1 font-semibold">🔥 80% off — Limited time offer</p>
                  </div>

                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto glow-button text-white font-bold px-8 py-6 text-lg rounded-xl group flex-shrink-0"
                    id="hero-buy-btn"
                    aria-label="Buy Personal Budget Tracker Template"
                  >
                    Get Instant Access
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 flex items-center justify-center lg:justify-start gap-2 text-xs text-[hsl(var(--muted-foreground))]"
                >
                  <Shield className="w-3.5 h-3.5 text-green-400 flex-shrink-0" aria-hidden="true" />
                  <span>Secured by Razorpay · Instant email delivery</span>
                </motion.div>
              </motion.div>

              {/* Right — Product Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative flex items-center justify-center mt-6 lg:mt-0 px-2 sm:px-0"
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                  <div className="w-64 sm:w-80 h-64 sm:h-80 bg-[hsl(var(--primary))/0.15] rounded-full blur-3xl" />
                </div>
                <motion.div
                  className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Glow ring */}
                  <div
                    className="absolute inset-0 rounded-3xl"
                    style={{ boxShadow: '0 0 60px hsl(217 91% 60% / 0.25), 0 0 120px hsl(217 91% 60% / 0.1)' }}
                    aria-hidden="true"
                  />
                  <img
                    src="/images/product-mockup.jpg"
                    alt="Personal Budget Tracker Template — digital product mockup"
                    className="relative z-10 w-full rounded-2xl sm:rounded-3xl shadow-2xl"
                    style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
                  />
                  {/* Lock badge */}
                  <div className="absolute -bottom-3 sm:-bottom-4 left-2 sm:-left-4 glass-card border-glow rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-1.5 sm:gap-2 shadow-xl z-20">
                    <Lock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[hsl(var(--primary))]" aria-hidden="true" />
                    <span className="text-xs sm:text-sm font-semibold text-white">Gated · Instant Access</span>
                  </div>
                  {/* Instant tag */}
                  <div className="absolute -top-3 sm:-top-4 right-2 sm:-right-4 glass-card border border-green-500/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-1.5 sm:gap-2 shadow-xl z-20">
                    <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-green-400" aria-hidden="true" />
                    <span className="text-xs sm:text-sm font-semibold text-white">Delivered via Email</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── WHAT'S INSIDE ──────────────────────────────────────────── */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--muted))]" aria-label="What's inside">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What's Inside</h2>
              <p className="text-[hsl(var(--muted-foreground))] text-base sm:text-lg max-w-2xl mx-auto">
                Everything you need to master your personal finances, savings, and investments — in one place.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {whatsInside.map(({ icon: Icon, title, desc }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  className="glass-card rounded-2xl p-6 group hover:-translate-y-2 hover:border-[hsl(var(--primary))/0.4] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[hsl(var(--primary))/0.2]">
                    <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ───────────────────────────────────────────── */}
        <section className="py-20 md:py-24 bg-[hsl(var(--muted))]" aria-label="Who this is for">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Who It's For</h2>
              <p className="text-[hsl(var(--muted-foreground))] text-lg">This playbook is built for serious builders.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 md:p-10 border-glow"
            >
              <ul className="space-y-4" role="list">
                {whoItsFor.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-[hsl(var(--primary))/0.2] border border-[hsl(var(--primary))/0.4] flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--primary))]" aria-hidden="true" />
                    </div>
                    <span className="text-[hsl(var(--foreground))] text-base md:text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────────────────── */}
        <section className="py-20 md:py-24 bg-[hsl(var(--background))]" aria-label="Customer reviews">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Buyers Say</h2>
              <p className="text-[hsl(var(--muted-foreground))] text-lg">Real results from real people.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map(({ quote, author, role, rating }, i) => (
                <motion.div
                  key={author}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-6 flex flex-col"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="text-[hsl(var(--foreground))] text-base leading-relaxed flex-1 mb-4">
                    "{quote}"
                  </blockquote>
                  <footer>
                    <p className="font-semibold text-white">{author}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{role}</p>
                  </footer>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING CTA ────────────────────────────────────────────── */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--muted))]" aria-label="Pricing and purchase">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Instant Access</h2>
              <p className="text-[hsl(var(--muted-foreground))] text-lg">One-time payment. Lifetime value.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl overflow-hidden border border-[hsl(var(--primary))/0.3]"
            >
              {/* Top gradient */}
              <div className="h-1 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))]" aria-hidden="true" />

              <div className="p-8 md:p-10">
                <div className="text-center mb-8">
                  <p className="text-[hsl(var(--muted-foreground))] text-sm line-through mb-1">{PRODUCT.originalPriceINR} regular price</p>
                  <div className="flex items-baseline justify-center gap-3 mb-2">
                    <span className="text-5xl font-black text-white">{PRODUCT.priceINR}</span>
                    <span className="text-xl text-[hsl(var(--muted-foreground))]">{PRODUCT.priceUSD}</span>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold border border-green-500/30">
                    🔥 80% Off — Limited Time Deal
                  </span>
                </div>

                <ul className="space-y-3 mb-8" role="list">
                  {[
                    'Automated Monthly & Annual Income/Expense Dashboards',
                    'Customizable Budget Categories & Bill Trackers',
                    'Savings Goal & Emergency Fund Progress Calculators',
                    'Net Worth & Investment Growth Visualizations',
                    'Step-by-step Quickstart guide (Excel & Google Sheets compatible)',
                    'Lifetime access & 100% private — zero monthly subscriptions',
                    'Instant delivery to your email right after payment',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[hsl(var(--foreground))] text-sm md:text-base">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full glow-button text-white font-bold py-7 text-xl rounded-2xl group"
                  id="pricing-buy-btn"
                  aria-label="Purchase Personal Budget Tracker Template"
                >
                  Buy Now — {PRODUCT.priceINR}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>

                <div className="mt-5 flex flex-col items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-green-400" aria-hidden="true" />
                    <span>Secured by Razorpay · UPI · Cards · Wallets accepted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[hsl(var(--primary))]" aria-hidden="true" />
                    <span>Download link sent to your email within seconds</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <section className="py-20 md:py-24 bg-[hsl(var(--muted))]" aria-label="Frequently asked questions">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            </motion.div>

            <div className="space-y-3">
              {faqs.map(({ q, a }, i) => (
                <motion.div
                  key={q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between px-6 py-5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] rounded-2xl"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                  >
                    <span className="font-semibold text-white text-base pr-4 group-hover:text-[hsl(var(--primary))] transition-colors">{q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[hsl(var(--muted-foreground))] flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {openFaq === i && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-5"
                    >
                      <p className="text-[hsl(var(--muted-foreground))] text-sm md:text-base leading-relaxed border-t border-[hsl(var(--border))] pt-4">{a}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ──────────────────────────────────────────────── */}
        <section className="py-20 md:py-24 bg-[hsl(var(--background))] relative overflow-hidden" aria-label="Final call to action">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[500px] h-[300px] bg-[hsl(var(--primary))/0.08] rounded-full blur-3xl" />
            </div>
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                Take Control of Your{' '}
                <span className="text-glow bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
                  Finances Today
                </span>
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] text-lg mb-8 max-w-xl mx-auto">
                Join 50+ smart savers and professionals managing their budget with ease. Get instant access now for just {PRODUCT.priceINR}.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="glow-button text-white font-bold px-10 py-6 text-xl rounded-2xl group"
                id="final-buy-btn"
                aria-label="Get instant access to Personal Budget Tracker Template"
              >
                Get Instant Access — {PRODUCT.priceINR}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
              <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))]">
                <Shield className="w-3.5 h-3.5 inline mr-1 text-green-400" aria-hidden="true" />
                Secure payment via Razorpay · Instant email delivery
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Checkout Modal */}
      <ProductCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={PRODUCT.name}
        priceINR={PRODUCT.priceINR}
        priceUSD={PRODUCT.priceUSD}
      />
    </>
  );
};

export default DigitalProductPage;
