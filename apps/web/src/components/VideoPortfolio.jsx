import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

const videos = [
  { 
    title: "Shlloka", 
    description: "Scaled from zero through strategic content planning, high-quality editing production, and effective SEO optimization.", 
    id: "iwg3oRZ-piw" 
  },
  { 
    title: "Sshruti Tandra", 
    description: "Generated high traffic with best content.", 
    id: "zar9yeQBUhI" 
  },
  { 
    title: "Yogic Life Sadhguru", 
    description: "Generated 2 million revenue for yogic programs through social channels.", 
    id: "qCEGLKYRzKY" 
  },
  { 
    title: "Celestevolve Podcast", 
    description: "Helped expand consciousness, soul remembrance, and awakening of the true self.", 
    id: "FfkWWmhCZ-8" 
  },
  { 
    title: "Anurag Rishi", 
    description: "Supported their initial journey in motivating people and building revenue streams.", 
    id: "kIPHYCeXS1A" 
  },
  { 
    title: "A2 Motivation", 
    description: "Grew the channel to 13 million subscribers with a 3 shorts per day strategy.", 
    id: "1iSzxWFHnaI" 
  }
];

const VideoCard = ({ video, isActive, onActivate, onDeactivate }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (isActive) {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      } else {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    }
  }, [isActive]);

  return (
    <motion.div 
      className="relative rounded-2xl overflow-hidden group cursor-pointer bg-[hsl(var(--card))] border border-[hsl(var(--border))]/50 shadow-sm"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="aspect-video relative bg-[hsl(var(--muted))]">
        <AnimatePresence>
          {!isActive && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-10"
            >
              <img 
                src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} 
                alt={video.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors duration-300">
                 <Play className="text-white w-12 h-12 opacity-80" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Iframe Layer */}
        <iframe
          ref={iframeRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1&autoplay=0&mute=1&loop=1&controls=0&modestbranding=1&rel=0&playlist=${video.id}`}
          allow="autoplay; encrypted-media"
          title={video.title}
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-[hsl(var(--foreground))]">{video.title}</h3>
        <p className="text-[hsl(var(--muted-foreground))] text-sm">{video.description}</p>
      </div>
    </motion.div>
  );
};

const VideoPortfolio = () => {
  const [activeVideoId, setActiveVideoId] = useState(null);

  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-[hsl(var(--foreground))]"
          >
            Video Showcase
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto"
          >
            A curated selection of our high-performing video campaigns and transformations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <VideoCard
                video={video}
                isActive={activeVideoId === video.id}
                onActivate={() => setActiveVideoId(video.id)}
                onDeactivate={() => {
                  if (activeVideoId === video.id) {
                    setActiveVideoId(null);
                  }
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoPortfolio;
