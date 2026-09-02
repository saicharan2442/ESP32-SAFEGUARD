import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '@/simulation/SimulationContext';
import type { SystemMode } from '@/types';
import { MODE_COLORS } from '@/lib/utils';
import { ShieldCheck, AlertTriangle, AlertOctagon, X, Play, Fan, Bell, ToggleRight } from 'lucide-react';

const MODE_BUTTONS: { mode: SystemMode; label: string; icon: typeof ShieldCheck; color: string }[] = [
  { mode: 'safe', label: 'SAFE MODE', icon: ShieldCheck, color: '#22c55e' },
  { mode: 'warning', label: 'WARNING MODE', icon: AlertTriangle, color: '#f59e0b' },
  { mode: 'danger', label: 'DANGER MODE', icon: AlertOctagon, color: '#ef4444' },
];

export function SimulationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { mode, setMode, sensor } = useSimulation();
  const colors = MODE_COLORS[mode];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border bg-[#0a0e14]/95 backdrop-blur-xl"
            style={{ borderColor: `${colors.primary}40` }}
          >
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: colors.primary }} />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5" style={{ color: colors.primary }} />
                <h3 className="text-lg font-bold text-white">Live Simulation Control</h3>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mode buttons */}
            <div className="grid grid-cols-3 gap-3 p-5">
              {MODE_BUTTONS.map((btn) => {
                const isActive = mode === btn.mode;
                return (
                  <button
                    key={btn.mode}
                    onClick={() => setMode(btn.mode)}
                    className="group relative overflow-hidden rounded-xl border p-4 text-center transition-all"
                    style={{
                      borderColor: isActive ? btn.color : 'rgba(255,255,255,0.1)',
                      backgroundColor: isActive ? `${btn.color}15` : 'transparent',
                    }}
                  >
                    <btn.icon className="mx-auto h-7 w-7 mb-2" style={{ color: btn.color }} />
                    <div className="text-xs font-bold uppercase tracking-wide" style={{ color: isActive ? btn.color : '#888' }}>
                      {btn.label}
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="modeActive"
                        className="absolute inset-0 rounded-xl"
                        style={{ boxShadow: `0 0 20px ${btn.color}40` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Status display */}
            <div className="px-5 pb-5">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border p-4"
                style={{ borderColor: `${colors.primary}30`, backgroundColor: `${colors.primary}08` }}
              >
                {mode === 'safe' && (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-green-400" />
                    <span className="text-base font-bold text-green-400">SAFE ENVIRONMENT</span>
                  </div>
                )}
                {mode === 'warning' && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-amber-400" />
                    <span className="text-base font-bold text-amber-400">WARNING — HAZARD DEVELOPING</span>
                  </div>
                )}
                {mode === 'danger' && (
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="h-6 w-6 text-red-400" />
                    <span className="text-base font-bold text-red-400">ACCIDENT PREDICTED</span>
                  </div>
                )}
              </motion.div>

              {/* Live readings */}
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: 'MQ-2', value: `${Math.round(sensor.mq2)} ppm` },
                  { label: 'MQ-135', value: `${Math.round(sensor.mq135)} ppm` },
                  { label: 'TEMP', value: `${sensor.temperature.toFixed(1)}°C` },
                  { label: 'HUMIDITY', value: `${sensor.humidity.toFixed(1)}%` },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/10 bg-black/30 p-2 text-center">
                    <div className="text-[10px] uppercase text-gray-500">{item.label}</div>
                    <div className="font-mono text-sm font-bold text-white">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Actuator status */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: 'RELAY', active: sensor.relay, icon: ToggleRight },
                  { label: 'EXHAUST FAN', active: sensor.fan, icon: Fan },
                  { label: 'ALARM', active: sensor.alarm, icon: Bell },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-1 rounded-lg border p-2.5 transition-colors"
                    style={{
                      borderColor: item.active ? colors.primary : 'rgba(255,255,255,0.1)',
                      backgroundColor: item.active ? `${colors.primary}10` : 'transparent',
                    }}
                  >
                    <item.icon
                      className={`h-5 w-5 ${item.active && item.label === 'EXHAUST FAN' ? 'animate-spin' : ''}`}
                      style={{ color: item.active ? colors.primary : '#666', animationDuration: '0.5s' }}
                    />
                    <span className="text-[10px] font-bold uppercase" style={{ color: item.active ? colors.primary : '#666' }}>
                      {item.label}
                    </span>
                    <span className="text-[9px] font-mono" style={{ color: item.active ? colors.primary : '#555' }}>
                      {item.active ? 'ON' : 'OFF'}
                    </span>
                  </div>
                ))}
              </div>

              {/* PIR / Human */}
              <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-black/30 p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sensor.humanDetected ? '#ef4444' : '#22c55e' }} />
                  <span className="text-xs text-gray-400">PIR / Human Detection</span>
                </div>
                <span className="font-mono text-xs font-bold" style={{ color: sensor.humanDetected ? '#ef4444' : '#22c55e' }}>
                  {sensor.humanDetected ? 'WORKER DETECTED' : 'AREA CLEAR'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
