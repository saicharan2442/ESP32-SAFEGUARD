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

  return (
    <div className="relative z-10 border-y border-white/10 bg-[#0d1117]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          {items.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ backgroundColor: item.color }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </span>
              <item.icon className="h-4 w-4" style={{ color: item.color }} />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] uppercase tracking-wider text-gray-500">{item.label}</span>
                <span className="text-xs font-bold tracking-wide" style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
