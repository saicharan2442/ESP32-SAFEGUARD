import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '@/simulation/SimulationContext';
import { SectionTitle } from './shared/SectionTitle';
import { MODE_COLORS, getRiskLabel } from '@/lib/utils';
import { ShieldCheck, AlertTriangle, AlertOctagon, Activity, Radar } from 'lucide-react';

function CircularRiskMeter({ risk, color }: { risk: number; color: string }) {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (risk / 100) * circumference;

  return (
    <div className="relative h-[300px] w-[300px]">
      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      >
        <svg className="h-full w-full" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="140" fill="none" stroke={color} strokeWidth="1" strokeDasharray="2 8" opacity="0.3" />
        </svg>
      </motion.div>

      {/* Radar sweep */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-8"
      >
        <svg className="h-full w-full" viewBox="0 0 260 260">
          <defs>
            <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path d="M 130 130 L 130 0 A 130 130 0 0 1 260 130 Z" fill="url(#sweepGrad)" />
        </svg>
      </motion.div>

      {/* Background ring */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 300">
        <circle cx="150" cy="150" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
      </svg>

      {/* Progress ring */}
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 300 300">
        <motion.circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>

      {/* Pulsing rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: color }}
          animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Risk Level</span>
        <motion.span
          key={Math.round(risk)}
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-mono text-6xl font-bold"
          style={{ color }}
        >
          {Math.round(risk)}%
        </motion.span>
        <span className="mt-1 text-sm font-bold uppercase tracking-wider" style={{ color }}>
          Accident Risk
        </span>
      </div>
    </div>
  );
}

export function RiskMeter() {
  const { sensor, mode } = useSimulation();
  const riskLabel = getRiskLabel(sensor.riskLevel);
  const colors = MODE_COLORS[mode];

  const statusConfig = {
    SAFE: { icon: ShieldCheck, label: 'SYSTEM SAFE', color: '#22c55e' },
    WARNING: { icon: AlertTriangle, label: 'WARNING — HAZARD DEVELOPING', color: '#f59e0b' },
    CRITICAL: { icon: AlertOctagon, label: 'ACCIDENT PREDICTED', color: '#ef4444' },
  };
  const status = statusConfig[riskLabel];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Intelligent Analysis"
          title="AI Safety Analysis"
          subtitle="Real-time risk assessment powered by sensor data analysis and predictive safety algorithms."
        />

        <div className="relative overflow-hidden rounded-3xl border bg-[#0a0e14]/80 p-8 backdrop-blur-xl sm:p-12" style={{ borderColor: `${colors.primary}30` }}>
          {/* Background glow */}
          <motion.div
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 blur-[80px]"
            style={{ backgroundColor: colors.primary }}
          />

          {/* Scanning lines */}
          <motion.div
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)` }}
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            {/* Risk meter */}
            <div className="flex justify-center">
              <CircularRiskMeter risk={sensor.riskLevel} color={colors.primary} />
            </div>

            {/* Status panel */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={riskLabel}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 rounded-xl border p-4"
                  style={{ borderColor: `${status.color}40`, backgroundColor: `${status.color}10` }}
                >
                  <status.icon className="h-8 w-8" style={{ color: status.color }} />
                  <div>
                    <div className="text-lg font-bold" style={{ color: status.color }}>{status.label}</div>
                    <div className="text-xs text-gray-500">
                      {riskLabel === 'SAFE' && 'All sensors within normal parameters'}
                      {riskLabel === 'WARNING' && 'Hazardous conditions developing — monitoring closely'}
                      {riskLabel === 'CRITICAL' && 'Emergency response activated — immediate action required'}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Telemetry breakdown */}
              <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
                  <Activity className="h-3.5 w-3.5" /> Risk Factors
                </div>
                {[
                  { label: 'Gas Concentration', value: Math.min(sensor.mq2 / 10, 100), display: `${Math.round(sensor.mq2)} ppm` },
                  { label: 'Air Quality Index', value: Math.min(sensor.mq135 / 10, 100), display: `${Math.round(sensor.mq135)} ppm` },
                  { label: 'Thermal Stress', value: Math.min((sensor.temperature - 25) * 4, 100), display: `${sensor.temperature.toFixed(1)} °C` },
                  { label: 'Human Presence', value: sensor.humanDetected ? 100 : 0, display: sensor.humanDetected ? 'DETECTED' : 'CLEAR' },
                ].map((factor) => (
                  <div key={factor.label} className="flex items-center gap-3">
                    <span className="w-32 text-xs text-gray-400">{factor.label}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: colors.primary }}
                        animate={{ width: `${factor.value}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="w-20 text-right font-mono text-xs" style={{ color: colors.primary }}>{factor.display}</span>
                  </div>
                ))}
              </div>

              {/* Radar indicator */}
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-gray-400">
                <Radar className="h-4 w-4" style={{ color: colors.primary }} />
                <span>AI prediction model analyzing {Math.round(sensor.riskLevel)}% risk probability</span>
                <span className="ml-auto flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: colors.primary }} />
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
