'use client';
import { motion } from 'motion/react';
import { useNovaMotion } from '@/components/ui/motion-provider';
export function SuccessMark() {
  const { reduced, ease } = useNovaMotion();
  return (
    <motion.div
      className="success-check"
      data-motion-success
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : 0.4, ease }}
    >
      <svg viewBox="0 0 40 40" width="38" height="38" fill="none" aria-hidden="true">
        <motion.path
          d="m10 20 7 7 14-15"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.12, ease }}
        />
      </svg>
    </motion.div>
  );
}
