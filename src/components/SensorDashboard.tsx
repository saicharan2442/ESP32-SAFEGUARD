import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useSimulation } from '@/simulation/SimulationContext';
import { SectionTitle } from './shared/SectionTitle';
import { Flame, Wind, Thermometer, Droplet, Scan } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CardConfig {
  id: string;
  label: string;
  sublabel: string;
  icon: LucideIcon;
  color: string;
  getValue: (s: ReturnType<typeof useSimulation>['sensor']) => string;
  getStatus: (s: ReturnType<typeof useSimulation>['sensor']) => string;
  getGraphValue: (s: ReturnType<typeof useSimulation>['sensor']) => number;
  maxGraph: number;
}

const CARDS: CardConfig[] = [
  {
    id: 'mq2', label: 'MQ-2', sublabel: 'Gas / Smoke', icon: Flame, color: '#f97316',
    getValue: (s) => `${Math.round(s.mq2)} ppm`,
    getStatus: (s) => s.mq2 < 400 ? 'NORMAL' : s.mq2 < 700 ? 'ELEVATED' : 'CRITICAL',
    getGraphValue: (s) => s.mq2, maxGraph: 1000,
  },
  {
    id: 'mq135', label: 'MQ-135', sublabel: 'Air Quality', icon: Wind, color: '#06b6d4',
    getValue: (s) => `${Math.round(s.mq135)} ppm`,
    getStatus: (s) => s.mq135 < 400 ? 'NORMAL' : s.mq135 < 700 ? 'ELEVATED' : 'CRITICAL',
    getGraphValue: (s) => s.mq135, maxGraph: 1000,
  },
  {
    id: 'temperature', label: 'Temperature', sublabel: 'Ambient', icon: Thermometer, color: '#ef4444',
    getValue: (s) => `${s.temperature.toFixed(2)} °C`,
    getStatus: (s) => s.temperature < 38 ? 'NORMAL' : s.temperature < 45 ? 'ELEVATED' : 'CRITICAL',
    getGraphValue: (s) => s.temperature, maxGraph: 60,
  },
  {
    id: 'humidity', label: 'Humidity', sublabel: 'Relative', icon: Droplet, color: '#3b82f6',
    getValue: (s) => `${s.humidity.toFixed(2)} %`,
    getStatus: (s) => s.humidity < 70 ? 'NORMAL' : s.humidity < 80 ? 'ELEVATED' : 'CRITICAL',
    getGraphValue: (s) => s.humidity, maxGraph: 100,
  },
  {
    id: 'pir', label: 'PIR', sublabel: 'Human Detection', icon: Scan, color: '#eab308',
    getValue: (s) => s.pir ? 'DETECTED' : 'NOT DETECTED',
    getStatus: (s) => s.pir ? 'DETECTED' : 'CLEAR',
    getGraphValue: (s) => s.pir ? 100 : 0, maxGraph: 100,
  },
];

function MiniGraph({ values, color, max }: { values: number[]; color: string; max: number }) {
  const width = 120;
  const height = 40;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - (Math.min(v, max) / max) * height;
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.8"
      />
      <polyline
        points={`0,${height} ${points.join(' ')} ${width},${height}`}
        fill={color}
        opacity="0.08"
      />
    </svg>
  );
}

function SensorCard({ config, index }: { config: CardConfig; index: number }) {
  const { sensor } = useSimulation();
  const [history, setHistory] = useState<number[]>(() => Array(20).fill(config.getGraphValue(sensor)));
  const prevRef = useRef(sensor);

  useEffect(() => {
    if (prevRef.current !== sensor) {
      setHistory((h) => [...h.slice(1), config.getGraphValue(sensor)]);
      prevRef.current = sensor;
    }
  }, [sensor, config]);

  const status = config.getStatus(sensor);
  const statusColor = status === 'NORMAL' || status === 'CLEAR' ? '#22c55e' : status === 'ELEVATED' ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]/80 p-5 backdrop-blur-xl transition-colors hover:border-white/20"
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: config.color, opacity: 0.6 }} />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border" style={{ backgroundColor: `${config.color}15`, borderColor: `${config.color}40` }}>
            <config.icon className="h-4.5 w-4.5" style={{ color: config.color }} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{config.label}</div>
            <div className="text-[10px] uppercase tracking-wide text-gray-500">{config.sublabel}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: statusColor }} />
          <span className="text-[10px] font-bold uppercase" style={{ color: statusColor }}>{status}</span>
        </div>
      </div>

      {/* Value */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="font-mono text-2xl font-bold" style={{ color: config.color }}>
            {config.getValue(sensor)}
          </div>
        </div>
        <MiniGraph values={history} color={config.color} max={config.maxGraph} />
      </div>

      {/* Bottom bar */}
      <div className="mt-3 flex items-center justify-between text-[10px] text-gray-600">
        <span className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: config.color }} />
          CONNECTED
        </span>
        <span className="font-mono">CH{index + 1}</span>
      </div>

      {/* Hover glow */}
      <div
        className="absolute -inset-0.5 -z-10 rounded-2xl opacity-0 blur-lg transition-opacity group-hover:opacity-20"
        style={{ backgroundColor: config.color }}
      />
    </motion.div>
  );
}

export function SensorDashboard() {
  return (
    <section id="monitor" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1520]/30 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Real-Time Telemetry"
          title="Live Environmental Monitoring"
          subtitle="Industrial-grade sensor instruments streaming live telemetry from the ESP32 controller."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CARDS.map((config, i) => (
            <SensorCard key={config.id} config={config} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
