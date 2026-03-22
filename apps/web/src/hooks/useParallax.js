
import { useScroll, useTransform } from 'framer-motion';

export const useParallax = (ref, distance = 100) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  return useTransform(scrollYProgress, [0, 1], [-distance, distance]);
};
