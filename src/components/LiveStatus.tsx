import { motion } from 'framer-motion';
import { useSimulation } from '@/simulation/SimulationContext';
import { Wifi, Cloud, Activity, Scan, ToggleRight } from 'lucide-react';

const STATUS_ITEMS = [
  { key: 'system', label: 'SYSTEM', value: 'ONLINE', icon: Activity, color: '#22c55e' },
  { key: 'esp32', label: 'ESP32', value: 'CONNECTED', icon: Wifi, color: '#06b6d4' },
  { key: 'cloud', label: 'AWS CLOUD', value: 'CONNECTED', icon: Cloud, color: '#f59e0b' },
  { key: 'sensors', label: 'SENSORS', value: '6 ACTIVE', icon: Activity, color: '#3b82f6' },
  { key: 'human', label: 'HUMAN DETECTION', value: 'ACTIVE', icon: Scan, color: '#eab308' },
  { key: 'relay', label: 'RELAY', value: 'READY', icon: ToggleRight, color: '#ec4899' },
];

export function LiveStatus() {
  const { sensor } = useSimulation();

  const items = STATUS_ITEMS.map((item) => {
    let value = item.value;
    if (item.key === 'relay') value = sensor.relay ? 'ACTIVE' : 'READY';
    if (item.key === 'sensors') value = '6 ACTIVE';
    return { ...item, value };
  });

  const marqueeItems = [...items, ...items];

  return (
    <div className="relative z-10 overflow-hidden border-y border-white/10 bg-[#0d1117]/80 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#0d1117] via-[#0d1117]/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#0d1117] via-[#0d1117]/80 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex w-max items-center gap-8 py-3"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          {marqueeItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={`${item.key}-${index}`}
                initial={{ opacity: 0.7 }}
                animate={{
                  opacity: [0.9, 1, 0.9],
                  scale: [1, 1.04, 1],
                  filter: ['drop-shadow(0 0 0 rgba(255,255,255,0))', `drop-shadow(0 0 10px ${item.color}80)`, 'drop-shadow(0 0 0 rgba(255,255,255,0))'],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.12 }}
                className="flex shrink-0 items-center gap-2.5"
              >
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-80"
                    style={{ backgroundColor: item.color }}
                  />
                  <span
                    className="relative inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 12px ${item.color}` }}
                  />
                </span>

                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.9, 1, 0.9] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Icon className="h-4 w-4" style={{ color: item.color }} />
                </motion.div>

                <div className="flex flex-col leading-none">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500">{item.label}</span>
                  <span className="text-xs font-bold tracking-wide" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
