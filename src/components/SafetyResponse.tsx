import { motion } from 'framer-motion';
import { useSimulation } from '@/simulation/SimulationContext';
import { MODE_COLORS } from '@/lib/utils';
import { SectionTitle } from './shared/SectionTitle';
import { AlertOctagon, Cpu, Brain, ToggleRight, Fan, Bell } from 'lucide-react';

const STAGES = [
  { id: 'hazard', label: 'Hazard Detected', icon: AlertOctagon, color: '#ef4444' },
  { id: 'esp32', label: 'ESP32 Analysis', icon: Cpu, color: '#06b6d4' },
  { id: 'risk', label: 'Risk Identified', icon: Brain, color: '#f59e0b' },
  { id: 'relay', label: 'Relay Activated', icon: ToggleRight, color: '#ec4899' },
  { id: 'fan', label: 'Exhaust Fan ON', icon: Fan, color: '#3b82f6' },
  { id: 'alarm', label: 'Alarm Activated', icon: Bell, color: '#ef4444' },
];

export function SafetyResponse() {
  const { sensor, mode } = useSimulation();
  const colors = MODE_COLORS[mode];
  const isDanger = mode === 'danger';

  const stageActive = (id: string): boolean => {
    if (mode === 'safe') return false;
    if (mode === 'warning') return id === 'hazard' || id === 'esp32' || id === 'risk';
    return true;
  };

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Emergency Protocol"
          title="Automatic Safety Response"
          subtitle="When danger is detected, the ESP32 triggers a coordinated emergency response — from analysis to physical actuation."
        />

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0e14]/80 p-8 backdrop-blur-xl sm:p-12">
          {/* Background glow when danger */}
          {isDanger && (
            <motion.div
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 bg-red-500 blur-[100px]"
            />
          )}

          {/* Pipeline */}
          <div className="relative flex flex-col items-center gap-0">
            {STAGES.map((stage, i) => {
              const active = stageActive(stage.id);
              return (
                <div key={stage.id} className="flex flex-col items-center">
                  {/* Node */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 1.5, repeat: Infinity }}
                    animate={{
                      scale: active ? [1, 1.05, 1] : 1,
                      boxShadow: active ? `0 0 25px ${stage.color}60` : 'none',
                    }}
                    className="relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 bg-[#0d1117] transition-colors"
                    style={{
                      borderColor: active ? stage.color : 'rgba(255,255,255,0.1)',
                      backgroundColor: active ? `${stage.color}10` : '#0d1117',
                    }}
                  >
                    <stage.icon
                      className={`h-8 w-8 ${stage.id === 'fan' && active ? 'animate-spin' : ''}`}
                      style={{
                        color: active ? stage.color : '#444',
                        animationDuration: '0.6s',
                      }}
                    />

                    {/* Active pulse */}
                    {active && (
                      <motion.div
                        animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl border-2"
                        style={{ borderColor: stage.color }}
                      />
                    )}

                    {/* Status dot */}
                    <div
                      className="absolute -right-1 -top-1 h-3 w-3 rounded-full"
                      style={{ backgroundColor: active ? stage.color : '#333' }}
                    />
                  </motion.div>

                  {/* Label */}
                  <div className="my-2 text-center">
                    <div className="text-sm font-bold" style={{ color: active ? stage.color : '#666' }}>
                      {stage.label}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-gray-600">
                      {active ? 'ACTIVE' : 'STANDBY'}
                    </div>
                  </div>

                  {/* Connector with particle */}
                  {i < STAGES.length - 1 && (
                    <div className="relative h-12 w-0.5">
                      <div className="absolute inset-0 bg-white/10" />
                      <motion.div
                        className="absolute inset-x-0"
                        animate={{ height: active && stageActive(STAGES[i + 1].id) ? ['0%', '100%'] : '0%' }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                        style={{ backgroundColor: stage.color }}
                      />
                      {/* Traveling particle */}
                      {active && stageActive(STAGES[i + 1].id) && (
                        <motion.div
                          className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
                          style={{ backgroundColor: stage.color, filter: `drop-shadow(0 0 4px ${stage.color})` }}
                          animate={{ top: ['0%', '100%'] }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom status */}
          <div className="mt-6 flex items-center justify-center">
            <motion.div
              animate={{ opacity: isDanger ? [0.7, 1, 0.7] : 1 }}
              transition={{ duration: 1, repeat: isDanger ? Infinity : 0 }}
              className="rounded-full border px-6 py-2 text-sm font-bold uppercase tracking-wide"
              style={{
                borderColor: `${colors.primary}40`,
                color: colors.primary,
                backgroundColor: `${colors.primary}10`,
              }}
            >
              {mode === 'safe' && '✓ System Safe — No Response Needed'}
              {mode === 'warning' && '⚠ Monitoring — Analysis Active'}
              {mode === 'danger' && '⚠ Emergency Response Activated'}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
