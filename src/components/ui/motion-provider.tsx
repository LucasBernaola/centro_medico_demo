'use client';
import { MotionConfig, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
export const novaEase = [0.22, 1, 0.36, 1] as const;
export function NovaMotion({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.5, ease: novaEase }}>
      {children}
    </MotionConfig>
  );
}
export function useNovaMotion() {
  return { reduced: !!useReducedMotion(), ease: novaEase };
}
