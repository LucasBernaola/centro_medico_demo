'use client';
import { Children, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useNovaMotion } from '@/components/ui/motion-provider';
export function HeroCopy({ children }: { children: ReactNode }) {
  const { reduced, compact, ease } = useNovaMotion();
  return (
    <motion.div
      className="hero-copy"
      data-motion-intro
      initial={reduced ? false : 'hidden'}
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.085 } } }}
    >
      {Children.map(children, (child) => (
        <motion.div
          className="hero-enter-item"
          variants={{ hidden: { opacity: 0, y: compact ? 15 : 24 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: reduced ? 0 : 0.6, ease }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
export function HeroVisual({ children }: { children: ReactNode }) {
  const { reduced, compact, ease } = useNovaMotion();
  return (
    <motion.div
      className="hero-visual"
      data-motion-intro
      initial={reduced ? false : { opacity: 0, scale: 0.98, x: compact ? 15 : 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : 0.18, ease }}
    >
      {children}
    </motion.div>
  );
}
