'use client';
import { motion } from 'motion/react';
import { Children, useState, type ReactNode, type AriaRole } from 'react';
import { useNovaMotion } from './motion-provider';
export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  role,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
  role?: AriaRole;
  'aria-label'?: string;
}) {
  const { reduced, ease } = useNovaMotion();
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
              x: direction === 'left' ? -28 : direction === 'right' ? 28 : 0,
              y: direction === 'up' ? 24 : 0,
            }
      }
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -24px 0px' }}
      onViewportEnter={() => setEntered(true)}
      transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : delay, ease }}
    >
      {children}
    </motion.div>
  );
}
export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  const { reduced, ease } = useNovaMotion();
  return (
    <motion.div
      data-reveal-group
      className={className}
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.06 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.065 } } }}
    >
      {Children.map(children, (child) => (
        <motion.div
          className="reveal-item"
          data-reveal
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: reduced ? 0 : 0.45, ease }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
