import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DataConnectionProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  active: boolean;
  delay?: number;
  id: string;
}

export function DataConnection({ from, to, color, active, delay = 0, id }: DataConnectionProps) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / dist;
  const ny = dy / dist;

  const startGap = 38;
  const endGap = 95;
  const sx = from.x + nx * startGap;
  const sy = from.y + ny * startGap;
  const ex = to.x - nx * endGap;
  const ey = to.y - ny * endGap;

  const midX = (sx + ex) / 2;
  const midY = (sy + ey) / 2 - 25;
  const path = `M ${sx} ${sy} Q ${midX} ${midY} ${ex} ${ey}`;
  const pathId = `p-${id}`;
  const gradId = `g-${id}`;
  const glowId = `glow-${id}`;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <path id={pathId} d={path} fill="none" />
        <linearGradient id={gradId} x1={sx} y1={sy} x2={ex} y2={ey} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="50%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Glow halo behind the wire */}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={active ? 6 : 3}
        opacity={active ? 0.12 : 0.04}
        strokeLinecap="round"
        animate={{ opacity: active ? [0.12, 0.22, 0.12] : 0.04 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Base wire */}
      <motion.path
        d={path}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={active ? 2 : 1}
        opacity={active ? 0.7 : 0.2}
        strokeLinecap="round"
      />

      {/* Animated dashed overlay */}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={active ? 1.5 : 0.75}
        opacity={active ? 0.5 : 0.15}
        strokeDasharray="3 7"
        strokeLinecap="round"
        animate={{ strokeDashoffset: active ? [0, -20] : 0 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />

      {/* Data packets traveling along the wire */}
      {active && [0, 0.33, 0.66].map((offset, i) => (
        <g key={i}>
          {/* Packet trail */}
          <circle r="5" fill={color} opacity="0.15" filter={`url(#${glowId})`}>
            <animateMotion
              dur="1.8s"
              repeatCount="indefinite"
              begin={`${delay + offset * 1.8}s`}
              keyPoints="0;1"
              keyTimes="0;1"
            >
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>
          {/* Packet core */}
          <circle r="2.5" fill={color} filter={`url(#${glowId})`}>
            <animateMotion
              dur="1.8s"
              repeatCount="indefinite"
              begin={`${delay + offset * 1.8}s`}
              keyPoints="0;1"
              keyTimes="0;1"
            >
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>
        </g>
      ))}

      {/* Connection endpoint at sensor side */}
      <circle cx={sx} cy={sy} r={active ? 3 : 2} fill={color} opacity={active ? 0.8 : 0.3}>
        <animate
          attributeName="r"
          values={active ? '2;4;2' : '2;2;2'}
          dur="2s"
          repeatCount="indefinite"
          begin={`${delay}s`}
        />
      </circle>

      {/* Connection endpoint at ESP32 side */}
      <circle cx={ex} cy={ey} r={active ? 3 : 2} fill={color} opacity={active ? 0.8 : 0.3}>
        <animate
          attributeName="r"
          values={active ? '2;4;2' : '2;2;2'}
          dur="2s"
          repeatCount="indefinite"
          begin={`${delay + 0.5}s`}
        />
      </circle>
    </svg>
  );
}

/** Hook to measure a container's pixel dimensions */
export function useContainerSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const update = () => setSize({ width: el.offsetWidth, height: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, size };
}

/** Helper to convert percentage positions to pixel coordinates */
export function pctToPx(pct: { x: number; y: number }, size: { width: number; height: number }) {
  return {
    x: (pct.x / 100) * size.width,
    y: (pct.y / 100) * size.height,
  };
}
