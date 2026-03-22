
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Users, Eye, TrendingUp, IndianRupee } from 'lucide-react';

/* ──────────────────────────────────────────────
   Non-linear 20-step scale generator
   Produces 20 values from `lo` to `hi` with
   exponentially increasing gaps.
   ────────────────────────────────────────────── */
const generateSteps = (lo, hi, count = 20) => {
  const steps = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);               // 0 … 1
    const val = lo + (hi - lo) * (t * t);     // quadratic curve
    steps.push(Math.round(val));
  }
  steps[0] = lo;
  steps[count - 1] = hi;
  return steps;
};

const VIEWERSHIP_STEPS = generateSteps(2_000, 100_000, 20);
const BUDGET_STEPS     = generateSteps(1_000, 100_000, 20);

/* ──────────────────────────────────────────────
   Engagement curve
   Smoothly: 0% at lowest → ~5% at mid → 3% at highest
   Uses piecewise quadratic.
   ────────────────────────────────────────────── */
const getEngagement = (budgetIndex) => {
  // budgetIndex: 0 – 19
  const t = budgetIndex / 19; // 0 … 1
  // Peak at t ≈ 0.45 with value 5%, ends at 3%
  // Piecewise:
  //   0→0.45:  rises from 0 to 5   (parabolic)
  //   0.45→1:  drops from 5 to 3   (parabolic)
  if (t <= 0.45) {
    const s = t / 0.45;            // 0→1 within first segment
    return 5 * (s * (2 - s));      // ease-out quad: quick rise, gentle peak
  } else {
    const s = (t - 0.45) / 0.55;   // 0→1 within second segment
    return 5 - 2 * (s * s);        // ease-in quad: gentle departure, settles at 3
  }
};

/* ──────────────────────────────────────────────
   Animated number hook
   ────────────────────────────────────────────── */
const useAnimatedNumber = (target, duration = 500) => {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    const diff = target - from;
    if (Math.abs(diff) < 0.01) { setDisplay(target); fromRef.current = target; return; }

    const start = performance.now();
    startRef.current = start;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + diff * eased;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return display;
};

/* ──────────────────────────────────────────────
   Format helpers
   ────────────────────────────────────────────── */
const formatIndian = (n) => {
  const num = Math.round(n);
  if (num >= 10_000_000) return (num / 10_000_000).toFixed(1).replace(/\.0$/, '') + ' Cr';
  if (num >= 100_000)    return (num / 100_000).toFixed(1).replace(/\.0$/, '') + ' L';
  if (num >= 1_000)      return num.toLocaleString('en-IN');
  return String(num);
};

const formatRupees = (n) => '₹' + formatIndian(n);

/* ──────────────────────────────────────────────
   Animated Output Card
   ────────────────────────────────────────────── */
const OutputCard = ({ icon: Icon, label, value, formatter, gradient, delay }) => {
  const animated = useAnimatedNumber(value, 600);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="relative overflow-hidden rounded-2xl p-[1px]"
      style={{ background: gradient }}
    >
      <div className="rounded-2xl bg-[hsl(var(--background))]/90 backdrop-blur-xl p-6 h-full flex flex-col items-center justify-center gap-3 text-center">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: gradient }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] tracking-tight" aria-live="polite">
          {formatter(animated)}
        </div>
        <div className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{label}</div>
      </div>
    </motion.div>
  );
};

/* ──────────────────────────────────────────────
   Slider Row
   ────────────────────────────────────────────── */
const SliderInput = ({ icon: Icon, label, value, displayValue, min, max, step, onChange, gradient }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="space-y-4"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: gradient }}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{label}</span>
      </div>
      <span className="text-xl font-bold text-[hsl(var(--foreground))] tabular-nums">{displayValue}</span>
    </div>
    <Slider
      value={[value]}
      onValueChange={(v) => onChange(v[0])}
      min={min}
      max={max}
      step={step}
      className="w-full"
      aria-label={label}
    />
  </motion.div>
);

/* ──────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────── */
const SocialMediaROICalculator = () => {
  // Slider states
  const [followers, setFollowers]           = useState(10_000);
  const [viewershipIndex, setViewershipIndex] = useState(0);
  const [budgetIndex, setBudgetIndex]       = useState(0);

  // Derived values
  const viewership = VIEWERSHIP_STEPS[viewershipIndex];
  const budget     = BUDGET_STEPS[budgetIndex];

  // ── Computations ──
  const targetReach      = viewership + budget / 0.1;
  const targetFollowers  = followers  + budget / 10;
  const targetEngagement = getEngagement(budgetIndex);

  /* ── Gradients ── */
  const G = {
    blue:   'linear-gradient(135deg, #6366f1, #8b5cf6)',
    green:  'linear-gradient(135deg, #10b981, #34d399)',
    orange: 'linear-gradient(135deg, #f59e0b, #f97316)',
    pink:   'linear-gradient(135deg, #ec4899, #f43f5e)',
    cyan:   'linear-gradient(135deg, #06b6d4, #22d3ee)',
    purple: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mb-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Social Media ROI Calculator
            </motion.h2>
            <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
              Estimate your campaign's reach, follower growth, and engagement — all in real time.
            </p>
          </div>

          {/* Glass Card */}
          <div className="glass-card border-glow rounded-2xl p-6 md:p-10 space-y-10">

            {/* ── Inputs ── */}
            <div className="grid gap-8 md:gap-10">
              <SliderInput
                icon={Users}
                label="Current Followers"
                value={followers}
                displayValue={formatIndian(followers)}
                min={10_000}
                max={100_000}
                step={1_000}
                onChange={setFollowers}
                gradient={G.blue}
              />

              <SliderInput
                icon={Eye}
                label="Average Viewership"
                value={viewershipIndex}
                displayValue={formatIndian(viewership)}
                min={0}
                max={19}
                step={1}
                onChange={setViewershipIndex}
                gradient={G.green}
              />

              <SliderInput
                icon={IndianRupee}
                label="Target Budget Spend (₹)"
                value={budgetIndex}
                displayValue={formatRupees(budget)}
                min={0}
                max={19}
                step={1}
                onChange={setBudgetIndex}
                gradient={G.orange}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-[hsl(var(--border))]" />

            {/* ── Outputs ── */}
            <div className="grid sm:grid-cols-3 gap-6">
              <OutputCard
                icon={Eye}
                label="Target Reach"
                value={targetReach}
                formatter={formatIndian}
                gradient={G.cyan}
                delay={0}
              />
              <OutputCard
                icon={Users}
                label="Target Followers"
                value={targetFollowers}
                formatter={formatIndian}
                gradient={G.purple}
                delay={0.1}
              />
              <OutputCard
                icon={TrendingUp}
                label="Target Engagement"
                value={targetEngagement}
                formatter={(v) => v.toFixed(2) + '%'}
                gradient={G.pink}
                delay={0.2}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialMediaROICalculator;
