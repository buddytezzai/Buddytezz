import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videos = [
  {
    id: 'iwg3oRZ-piw',
    title: 'Shlloka',
    description: 'Scaled from zero through strategic content planning, high-quality editing production, and effective SEO optimization.'
  },
  {
    id: 'zar9yeQBUhI',
    title: 'Sshruti Tandra',
    description: 'Generated high traffic with best content.'
  },
  {
    id: 'qCEGLKYRzKY',
    title: 'Yogic Life Sadhguru',
    description: 'Generated 2 million revenue for yogic programs through social channels.'
  },
  {
    id: 'FfkWWmhCZ-8',
    title: 'Celestevolve Podcast',
    description: 'Helped expand consciousness, soul remembrance, and awakening of the true self.'
  },
  {
    id: 'kIPHYCeXS1A',
    title: 'Anurag Rishi',
    description: 'Supported their initial journey in motivating people and building revenue streams.'
  },
  {
    id: '1iSzxWFHnaI',
    title: 'A2 Motivation',
    description: 'Grew the channel to 13 million subscribers with a 3 shorts per day strategy.'
  }
];

const VideoCard = ({ video, isActive, onHover, onLeave }) => {
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    let player;
    const initPlayer = () => {
      player = new window.YT.Player(`player-${video.id}`, {
        height: '100%',
        width: '100%',
        videoId: video.id,
        playerVars: {
          autoplay: 0,
          mute: 1,
          loop: 1,
          playlist: video.id, // required for loop
          controls: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          iv_load_policy: 3,
          fs: 0
        },
        events: {
          onReady: () => setIsReady(true),
        }
      });
      playerRef.current = player;
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        // This is tricky if multiple cards are initializing
        // A better approach is to check periodically or use a central manager
      };
      
      // Fallback for multiple initializations
      const checkYT = setInterval(() => {
        if (window.YT && window.YT.Player) {
          initPlayer();
          clearInterval(checkYT);
        }
      }, 100);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [video.id]);

  useEffect(() => {
    if (isReady && playerRef.current) {
      if (isActive) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
        playerRef.current.seekTo(0);
      }
    }
  }, [isActive, isReady]);

  return (
    <motion.div
      className="relative glass-card rounded-3xl overflow-hidden aspect-video cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Thumbnail Layer */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <img
          src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      {/* Video Layer */}
      <div className="absolute inset-0 z-0">
        <div id={`player-${video.id}`} className="w-full h-full" />
      </div>

      {/* Info Overlay */}
      <div className={`absolute inset-0 z-20 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
        <h4 className="text-xl font-bold text-white mb-2">{video.title}</h4>
        <p className="text-sm text-gray-300 line-clamp-2">{video.description}</p>
      </div>

      {/* Playing Overlay (Optional subtle indicator) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 pointer-events-none border-2 border-[hsl(var(--primary))]/30 rounded-3xl"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const VideoPortfolio = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="py-24 bg-[hsl(var(--background))] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[hsl(var(--primary))]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            🎥 Video Showcase
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto"
          >
            Explore our curated portfolio of viral content and strategic narrative building.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isActive={activeVideo === video.id}
              onHover={() => setActiveVideo(video.id)}
              onLeave={() => setActiveVideo(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoPortfolio;
