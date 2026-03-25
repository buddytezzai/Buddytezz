import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoItem = ({ videoId, title, description, isActive, onHover, onLeave }) => {
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    let player;
    const initPlayer = () => {
      player = new window.YT.Player(`player-${videoId}`, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          mute: 1,
          loop: 1,
          playlist: videoId,
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
      const checkYT = setInterval(() => {
        if (window.YT && window.YT.Player) {
          initPlayer();
          clearInterval(checkYT);
        }
      }, 100);
    }

    return () => {
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [videoId]);

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
      className="relative aspect-[4/3] overflow-hidden rounded-3xl glass-card cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Thumbnail */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Video Content */}
      <div className="absolute inset-0 z-0">
        <div id={`player-${videoId}`} className="w-full h-full" />
      </div>

      {/* Info Overlay */}
      <div className={`absolute inset-0 z-20 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
        <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
        {description && <p className="text-sm text-gray-300 line-clamp-2">{description}</p>}
      </div>

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

const ImageShowcase = ({ items, title, subtitle }) => {
  const [activeMedia, setActiveMedia] = useState(null);

  return (
    <section className="py-24 bg-[hsl(var(--background))] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`}>
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {item.type === 'video' ? (
                <VideoItem
                  videoId={item.id}
                  title={item.title}
                  description={item.description}
                  isActive={activeMedia === `video-${item.id}`}
                  onHover={() => setActiveMedia(`video-${item.id}`)}
                  onLeave={() => setActiveMedia(null)}
                />
              ) : (
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl glass-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageShowcase;
