'use client';
import { MotionConfig, useReducedMotion } from 'motion/react';
import { useSyncExternalStore, type ReactNode } from 'react';
const compactQuery = '(max-width: 767px)';
function subscribeCompact(update: () => void) {
  const media = window.matchMedia(compactQuery);
  media.addEventListener('change', update);
  return () => media.removeEventListener('change', update);
}
const compactSnapshot = () => window.matchMedia(compactQuery).matches;
const serverCompactSnapshot = () => true;
export const novaEase = [0.22, 1, 0.36, 1] as const;
export function NovaMotion({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.5, ease: novaEase }}>
      {children}
    </MotionConfig>
  );
}
export function useNovaMotion() {
  const compact = useSyncExternalStore(subscribeCompact, compactSnapshot, serverCompactSnapshot);
  return { reduced: !!useReducedMotion(), compact, ease: novaEase };
}
