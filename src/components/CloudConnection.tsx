import { motion } from 'framer-motion';
import { useSimulation } from '@/simulation/SimulationContext';
import { SectionTitle } from './shared/SectionTitle';
import { Cpu, Wifi, Cloud, Database, Monitor } from 'lucide-react';

const STAGES = [
  { label: 'ESP32', icon: Cpu, color: '#06b6d4' },
  { label: 'Wi-Fi', icon: Wifi, color: '#3b82f6' },
  { label: 'AWS Cloud', icon: Cloud, color: '#f59e0b' },
  { label: 'Database', icon: Database, color: '#22c55e' },
  { label: 'Dashboard', icon: Monitor, color: '#ec4899' },
];

export function CloudConnection() {
  const { packets, latency, lastSync } = useSimulation();

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Cloud Infrastructure"
          title="AWS Cloud Data Flow"
          subtitle="Telemetry packets travel from the ESP32 through Wi-Fi to AWS Cloud for storage, analytics, and dashboard visualization."
        />

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0e14]/80 p-8 backdrop-blur-xl sm:p-12">
          {/* Pipeline */}
          <div className="relative flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
            {STAGES.map((stage, i) => (
              <div key={stage.label} className="flex flex-1 flex-col items-center sm:flex-row">
                {/* Node */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative flex flex-col items-center"
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 bg-[#0d1117]"
                    style={{ borderColor: stage.color, boxShadow: `0 0 15px ${stage.color}30` }}
                  >
                    <stage.icon className="h-7 w-7" style={{ color: stage.color }} />
                  </div>
                  <span className="mt-2 text-xs font-bold uppercase tracking-wide" style={{ color: stage.color }}>
                    {stage.label}
                  </span>

                  {/* Pulsing ring */}
                  <motion.div
                    animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="absolute inset-0 rounded-2xl border-2"
                    style={{ borderColor: stage.color }}
                  />
                </motion.div>

                {/* Connector */}
                {i < STAGES.length - 1 && (
                  <div className="relative h-12 w-0.5 sm:h-0.5 sm:flex-1">
                    <div className="absolute inset-0 bg-white/10" />
                    {/* Traveling packets */}
                    {[0, 0.5].map((offset) => (
                      <motion.div
                        key={offset}
                        className="absolute h-2 w-2 rounded-full"
                        style={{ backgroundColor: '#06b6d4', filter: 'drop-shadow(0 0 4px #06b6d4)' }}
                        animate={{
                          top: ['0%', '100%'],
                          left: ['50%', '50%'],
                          opacity: [0, 1, 0],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: offset + i * 0.2, ease: 'linear' }}
                        // On desktop, animate horizontally
                        custom={i}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Packets', value: packets.toLocaleString(), color: '#06b6d4' },
              { label: 'Latency', value: `${latency} ms`, color: '#22c55e' },
              { label: 'Cloud Status', value: 'CONNECTED', color: '#f59e0b' },
              { label: 'Last Sync', value: lastSync, color: '#ec4899' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-white/10 bg-black/30 p-4 text-center"
              >
                <div className="text-[10px] uppercase tracking-wide text-gray-500">{stat.label}</div>
                <div className="mt-1 font-mono text-lg font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
