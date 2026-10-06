'use client';
import { motion } from 'motion/react';
import { Children, useState, type ReactNode, type AriaRole } from 'react';
import { useNovaMotion } from './motion-provider';
export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  image = false,
  role,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
  image?: boolean;
  role?: AriaRole;
  'aria-label'?: string;
}) {
  const { reduced, compact, ease } = useNovaMotion();
  const [entered, setEntered] = useState(false);
  return (
    <motion.div
      data-reveal
      data-reveal-direction={direction}
      data-revealed={entered || reduced}
      className={className}
      role={role}
      aria-label={ariaLabel}
      initial={
        reduced
          ? false
          : {
              opacity: 0,
              x:
                direction === 'left'
                  ? compact
                    ? -15
                    : -20
                  : direction === 'right'
                    ? compact
                      ? 15
                      : 20
                    : 0,
              y: direction === 'up' ? (compact ? 15 : 24) : 0,
              scale: image ? 0.98 : 1,
            }
      }
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -24px 0px' }}
      onViewportEnter={() => setEntered(true)}
      transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : delay, ease }}
    >
      {children}
    </motion.div>
  );
}
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const { reduced, compact, ease } = useNovaMotion();
  return (
    <motion.div
      data-reveal-group
      className={className}
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.06 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : stagger } } }}
    >
      {Children.map(children, (child) => (
        <motion.div
          className="reveal-item"
          data-reveal
          variants={{ hidden: { opacity: 0, y: compact ? 15 : 24 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: reduced ? 0 : 0.55, ease }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
