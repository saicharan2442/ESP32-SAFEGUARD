import { motion } from 'framer-motion';

export function GlassPanel({
  children,
  className = '',
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl ${className}`}
    >
      {glow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent" />
      )}
      {children}
    </div>
  );
}

export function GlowDot({ color = '#22c55e', size = 8 }: { color?: string; size?: number }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      <span
        className="absolute inline-flex animate-ping rounded-full opacity-75"
        style={{ width: size, height: size, backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{ width: size, height: size, backgroundColor: color }}
      />
    </span>
  );
}

export function AnimatedNumber({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  return (
    <motion.span
      key={Math.round(value * 100)}
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {value.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}
