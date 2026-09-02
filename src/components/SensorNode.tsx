import { motion } from 'framer-motion';
import type { SensorInfo } from '@/types';
import { Flame, Wind, Thermometer, Droplet, Scan, Camera } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  flame: Flame,
  wind: Wind,
  thermometer: Thermometer,
  droplet: Droplet,
  scan: Scan,
  camera: Camera,
};

interface SensorNodeProps {
  sensor: SensorInfo;
  value: string;
  status: 'ONLINE' | 'OFFLINE';
  hovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (sensor: SensorInfo) => void;
  side: 'left' | 'right';
  nodeRef?: (node: HTMLDivElement | null) => void;
}

export function SensorNode({ sensor, value, status, hovered, onHover, onClick, side, nodeRef }: SensorNodeProps) {
  const Icon = ICONS[sensor.icon] ?? Flame;

  return (
    <motion.div
      ref={nodeRef}
      onHoverStart={() => onHover(sensor.id)}
      onHoverEnd={() => onHover(null)}
      onClick={() => onClick(sensor)}
      animate={{
        scale: hovered ? 1.08 : 1,
      }}
      className="group relative cursor-pointer"
      style={{ transformOrigin: side === 'left' ? 'right center' : 'left center' }}
    >
      {/* Glow */}
      <motion.div
        animate={{ opacity: hovered ? 0.5 : 0.15 }}
        className="absolute -inset-2 rounded-2xl blur-lg"
        style={{ backgroundColor: sensor.color }}
      />

      {/* Card */}
      <div
        className="relative flex items-center gap-3 rounded-xl border bg-[#0d1117]/90 p-3 backdrop-blur-sm transition-colors"
        style={{
          borderColor: hovered ? sensor.color : 'rgba(255,255,255,0.1)',
          boxShadow: hovered ? `0 0 20px ${sensor.color}40` : 'none',
        }}
      >
        {/* Icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
          style={{
            backgroundColor: `${sensor.color}15`,
            borderColor: `${sensor.color}50`,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: sensor.color }} />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white">{sensor.shortName}</span>
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: sensor.color, animation: 'pulse 2s infinite' }}
            />
          </div>
          <div className="truncate text-[10px] uppercase tracking-wide text-gray-500">{sensor.valueLabel}</div>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs font-mono font-bold" style={{ color: sensor.color }}>
              {value}
            </span>
            <span className="text-[9px] uppercase text-gray-600">{status}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
