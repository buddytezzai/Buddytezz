
import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(1);
  const frameCount = 40;

  useEffect(() => {
    // Preload images into memory for zero-latency scroll painting
    const loadedImages = [];
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = `/hero-sequence/${i}.webp`; // Changed to .webp for highest clarity
        img.onload = () => {
            // Paint first frame immediately as soon as it loads
            if (i === 1) requestAnimationFrame(() => drawFrame(1));
        };
        loadedImages.push(img);
    }
    imagesRef.current = loadedImages;

    const handleResize = () => {
        requestAnimationFrame(() => drawFrame(currentFrameRef.current));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[frameIndex - 1];

    if (!img || !img.complete) return;

    // Use native device dimensions combined with devicePixelRatio mapping to ensure 
    // canvas resolution stays razor-sharp on Retina/High-DPI displays!
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    // Calculate object-fit: cover equivalent bounds
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Explicitly enable high-quality smoothing for any required upscaling
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
    // Map scroll progress (0 to 1) safely to 1-40 with equal distribution
    const calculatedIndex = Math.min(frameCount, Math.max(1, Math.floor(latest * (frameCount - 0.01)) + 1));
    if (currentFrameRef.current !== calculatedIndex) {
        currentFrameRef.current = calculatedIndex;
        requestAnimationFrame(() => drawFrame(calculatedIndex));
    }
  });

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={containerRef} id="home" className="relative h-[400vh] bg-[#0A0A0A]" aria-label="Hero Section">
      {/* Sticky wrapper pinning the content while the section continues to scroll */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Sequence Images loaded via high-performance HTML5 Canvas */}
        <div className="absolute inset-0 z-0 bg-[#0A0A0A]">
          <canvas ref={canvasRef} className="w-full h-full object-cover" aria-hidden="true" />
        </div>
        
        {/* Subtle overlay gradients to ensure text remains readable without obscuring the bright robot image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-0 pointer-events-none" aria-hidden="true" />

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
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(var(--foreground))] leading-tight"
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

      {/* Bounce scroll indicator to imply scrolling */}
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
