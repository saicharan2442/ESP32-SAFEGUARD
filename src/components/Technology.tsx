import { motion } from 'framer-motion';
import { SectionTitle } from './shared/SectionTitle';
import { TECH_STACK } from '@/data/sensors';
import { Cpu, Flame, Wind, Camera, Cloud, Smartphone, Wifi, ToggleRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  cpu: Cpu,
  flame: Flame,
  wind: Wind,
  camera: Camera,
  cloud: Cloud,
  smartphone: Smartphone,
  wifi: Wifi,
  'toggle-right': ToggleRight,
};

export function Technology() {
  return (
    <section id="technology" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Built With"
          title="Technology Stack"
          subtitle="Industrial-grade hardware and cloud technologies powering the safety monitoring system."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {TECH_STACK.map((tech, i) => {
            const Icon = ICONS[tech.icon] ?? Cpu;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]/80 p-5 backdrop-blur-xl transition-all"
                style={{ '--tech-color': tech.color } as React.CSSProperties}
              >
                {/* Top accent */}
                <div
                  className="absolute inset-x-0 top-0 h-0.5 opacity-50 transition-opacity group-hover:opacity-100"
                  style={{ backgroundColor: tech.color }}
                />

                {/* Glow on hover */}
                <div
                  className="absolute -inset-0.5 -z-10 rounded-2xl opacity-0 blur-lg transition-opacity group-hover:opacity-20"
                  style={{ backgroundColor: tech.color }}
                />

                {/* Icon */}
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border transition-all group-hover:scale-110"
                  style={{
                    backgroundColor: `${tech.color}15`,
                    borderColor: `${tech.color}40`,
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: tech.color }} />
                </div>

                {/* Name */}
                <div className="text-base font-bold text-white">{tech.name}</div>
                <div className="mt-1 text-xs text-gray-500">{tech.description}</div>

                {/* Hover detail */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  whileHover={{ height: 'auto', opacity: 1 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 flex items-center gap-1.5 text-[10px]" style={{ color: tech.color }}>
                    <span className="h-1 w-1 rounded-full" style={{ backgroundColor: tech.color }} />
                    <span className="uppercase tracking-wide">Integrated</span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
