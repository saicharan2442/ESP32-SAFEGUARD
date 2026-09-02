import { motion } from 'framer-motion';
import { SectionTitle } from './shared/SectionTitle';
import { WORKFLOW_STEPS } from '@/data/sensors';
import { Radar, Database, Wifi, Brain, ScanSearch, BellRing, ToggleRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  radar: Radar,
  database: Database,
  wifi: Wifi,
  brain: Brain,
  'scan-search': ScanSearch,
  'bell-ring': BellRing,
  'toggle-right': ToggleRight,
};

export function Workflow() {
  return (
    <section id="workflow" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="System Pipeline"
          title="System Workflow"
          subtitle="From sensing environmental data to taking automatic safety action — every step in the pipeline."
        />

        <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-7 lg:gap-2">
          {WORKFLOW_STEPS.map((step, i) => {
            const Icon = ICONS[step.icon] ?? Radar;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="group relative"
              >
                {/* Connector arrow */}
                {i < WORKFLOW_STEPS.length - 1 && (
                  <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className="text-cyan-500/40"
                    >
                      →
                    </motion.div>
                  </div>
                )}

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]/80 p-4 backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:bg-cyan-500/5">
                  {/* Step number */}
                  <div className="absolute right-2 top-2 font-mono text-3xl font-bold text-white/5">
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Icon */}
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 transition-all group-hover:scale-110 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Icon className="h-6 w-6 text-cyan-400" />
                  </div>

                  {/* Label */}
                  <div className="text-sm font-bold uppercase tracking-wide text-white">{step.label}</div>
                  <div className="mt-1 text-xs text-gray-500">{step.description}</div>

                  {/* Bottom accent */}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
