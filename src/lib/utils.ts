import type { SystemMode } from '@/types';

export const MODE_COLORS: Record<SystemMode, { primary: string; glow: string; text: string; border: string; bg: string }> = {
  safe: {
    primary: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.35)',
    text: 'text-green-400',
    border: 'border-green-500/40',
    bg: 'bg-green-500/10',
  },
  warning: {
    primary: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.35)',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
  },
  danger: {
    primary: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.35)',
    text: 'text-red-400',
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
  },
};

export function getRiskLabel(risk: number): 'SAFE' | 'WARNING' | 'CRITICAL' {
  if (risk < 40) return 'SAFE';
  if (risk < 70) return 'WARNING';
  return 'CRITICAL';
}

export function getGasStatus(value: number): 'NORMAL' | 'ELEVATED' | 'CRITICAL' {
  if (value < 400) return 'NORMAL';
  if (value < 700) return 'ELEVATED';
  return 'CRITICAL';
}

export function getAirQualityStatus(value: number): 'NORMAL' | 'ELEVATED' | 'CRITICAL' {
  if (value < 400) return 'NORMAL';
  if (value < 700) return 'ELEVATED';
  return 'CRITICAL';
}
