
import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const targetFrameRef = useRef(1);
  const interpolatedFrameRef = useRef(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Upgrade to 211 frames for new sequence (0-210)
  const frameCount = 211;
  // Easing factor (lower = smoother/more weight, higher = more responsive)
  const easing = 0.08;

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const loadBatchSize = 10; // Load in small batches to keep UI responsive
    let loadedCount = 0;

    const preloadImages = async () => {
      const loadedImages = [];
      for (let i = 0; i < frameCount; i++) {
        // Mobile Optimization: On mobile, we can skip every 2nd frame to save memory/bandwidth
        // if you have a huge number of frames. For 211, we'll try to load all but monitor performance.
        const img = new Image();
        img.src = `/hero-sequence/${i}.webp`;

        if (i === 0) {
          img.onload = () => {
            imagesRef.current[0] = img;
            requestAnimationFrame(() => drawFrame(1));
          };
        }
        loadedImages.push(img);
      }
      imagesRef.current = loadedImages;

      // Track overall loading for a potential progress bar or "ready" state
      let complete = 0;
      loadedImages.forEach(img => {
        img.onload = () => {
          complete++;
          if (complete === frameCount) setIsLoaded(true);
        };
      });
    };

    preloadImages();

    // The Render Loop: This is what makes it "Fluid"
    // We don't just jump to a frame; we "lerp" toward the target frame index.
    let rafId;
    const renderLoop = () => {
      const distance = targetFrameRef.current - interpolatedFrameRef.current;

      // Only redraw if we haven't reached the target
      if (Math.abs(distance) > 0.01) {
        interpolatedFrameRef.current += distance * easing;
        drawFrame(Math.round(interpolatedFrameRef.current));
      }

      rafId = requestAnimationFrame(renderLoop);
    };
    rafId = requestAnimationFrame(renderLoop);

    const handleResize = () => {
      requestAnimationFrame(() => drawFrame(Math.round(interpolatedFrameRef.current)));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Safety check for array bounds
    const idx = Math.max(0, Math.min(frameCount - 1, frameIndex - 1));
    const img = imagesRef.current[idx];

    if (!img || !img.complete) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Progress 0-1 maps to frames 1-210
    const rawIndex = latest * (frameCount - 1) + 1;
    targetFrameRef.current = rawIndex;
  });

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={containerRef} id="home" className="relative h-[600vh] bg-[#0A0A0A]" aria-label="Hero Section">
      {/* Sticky wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

        {/* Sequence Images */}
        <div className="absolute inset-0 z-0 bg-[#0A0A0A]">
          <canvas ref={canvasRef} className="w-full h-full object-cover" aria-hidden="true" />
        </div>

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50 z-0 pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border-glow"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" aria-hidden="true" />
              <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                AI-Powered Business Automation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold text-[hsl(var(--foreground))] leading-tight"
              style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}
            >
              Automate your business with{' '}
              <span className="text-glow bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
                AI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-3xl mx-auto leading-relaxed"
            >
              We help brands scale with AI automation, content systems and growth strategies
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <Button
                onClick={scrollToContact}
                className="glow-button text-white font-semibold px-8 py-6 text-lg rounded-xl group"
                aria-label="Get free consultation"
              >
                Get free consultation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
              </Button>
              <Button
                onClick={scrollToServices}
                variant="outline"
                className="bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/80 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-200"
                aria-label="View our services"
              >
                View services
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-70" aria-hidden="true">
          <span className="text-white text-xs uppercase tracking-widest mb-3 font-semibold">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-white/40 flex items-start justify-center p-1"
          >
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 rounded-full bg-white"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
