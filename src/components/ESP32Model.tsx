import { motion } from 'framer-motion';
import { useState } from 'react';

export function ESP32Board({ size = 200 }: { size?: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative"
      style={{ width: size, height: size * 0.7 }}
    >
      {/* Scanning effect */}
      {hovered && (
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: size * 0.7, opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        />
      )}

      {/* Glow halo */}
      <motion.div
        animate={{ scale: hovered ? 1.15 : 1, opacity: hovered ? 0.6 : 0.3 }}
        className="absolute inset-0 rounded-2xl bg-cyan-500/20 blur-2xl"
      />

      {/* Board body */}
      <svg viewBox="0 0 200 140" className="relative h-full w-full drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        <defs>
          <linearGradient id="boardGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2a1a" />
            <stop offset="100%" stopColor="#0d1a0d" />
          </linearGradient>
          <linearGradient id="chipGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#111" />
          </linearGradient>
        </defs>

        {/* PCB */}
        <rect x="10" y="15" width="180" height="110" rx="4" fill="url(#boardGrad)" stroke="#3a5a3a" strokeWidth="1" />
        <rect x="10" y="15" width="180" height="110" rx="4" fill="none" stroke="#4a7a4a" strokeWidth="0.5" opacity="0.5" />

        {/* Solder pads texture */}
        {Array.from({ length: 18 }).map((_, i) => (
          <circle key={`pad-${i}`} cx={18 + i * 10} cy={20} r="1" fill="#8a8a5a" opacity="0.4" />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <circle key={`pad2-${i}`} cx={18 + i * 10} cy={120} r="1" fill="#8a8a5a" opacity="0.4" />
        ))}

        {/* ESP32 chip */}
        <rect x="65" y="50" width="70" height="40" rx="2" fill="url(#chipGrad)" stroke="#555" strokeWidth="0.5" />
        <text x="100" y="73" textAnchor="middle" fill="#aaa" fontSize="6" fontFamily="monospace" fontWeight="bold">ESP32</text>

        {/* Chip pins */}
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={`pin-${i}`} x={68 + i * 4.6} y={48} width="2" height="3" fill="#999" />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={`pin2-${i}`} x={68 + i * 4.6} y={89} width="2" height="3" fill="#999" />
        ))}

        {/* Antenna */}
        <rect x="150" y="55" width="25" height="30" rx="1" fill="#1a3a1a" stroke="#3a6a3a" strokeWidth="0.5" />
        <path d="M155 60 L170 60 M155 65 L170 65 M155 70 L170 70 M155 75 L170 75" stroke="#c0c060" strokeWidth="0.3" opacity="0.6" />

        {/* USB port */}
        <rect x="15" y="55" width="15" height="30" rx="1" fill="#444" stroke="#666" strokeWidth="0.5" />
        <rect x="17" y="60" width="11" height="20" fill="#222" />

        {/* Status LEDs */}
        <circle cx="100" cy="35" r="3" fill="#22c55e">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="115" cy="35" r="3" fill="#06b6d4">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
        </circle>

        {/* Header pins */}
        {Array.from({ length: 15 }).map((_, i) => (
          <rect key={`hp-${i}`} x={20 + i * 11} y={113} width="6" height="8" rx="1" fill="#2a2a2a" stroke="#555" strokeWidth="0.3" />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <rect key={`hp2-${i}`} x={20 + i * 11} y={19} width="6" height="8" rx="1" fill="#2a2a2a" stroke="#555" strokeWidth="0.3" />
        ))}

        {/* Capacitors */}
        <circle cx="30" cy="95" r="4" fill="#2a2a2a" stroke="#555" strokeWidth="0.5" />
        <circle cx="170" cy="95" r="4" fill="#2a2a2a" stroke="#555" strokeWidth="0.5" />
      </svg>
    </motion.div>
  );
}
