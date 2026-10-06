import { HeartPulse, Plus, Baby, ScanFace, Bone, Flower2 } from 'lucide-react';
import type { Specialty } from '@/types';
const icons = {
  heart: HeartPulse,
  cross: Plus,
  baby: Baby,
  skin: ScanFace,
  bone: Bone,
  flower: Flower2,
};
export function SpecialtyIcon({ type, size = 27 }: { type: Specialty['icon']; size?: number }) {
  const Icon = icons[type];
  return <Icon size={size} strokeWidth={1.45} aria-hidden="true" />;
}
