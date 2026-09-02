import { motion } from 'framer-motion';
import { useSimulation } from '@/simulation/SimulationContext';
import { MODE_COLORS } from '@/lib/utils';
import { SectionTitle } from './shared/SectionTitle';
import { Fan, Wind, Cpu, Camera, Activity } from 'lucide-react';

export function IndustrialEnvironment() {
  const { sensor, mode } = useSimulation();
  const colors = MODE_COLORS[mode];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Smart Factory"
          title="Industrial Environment"
          subtitle="The factory floor reacts in real-time to safety conditions — ventilation, lighting, and alerts respond automatically."
        />

        <div
          className="relative overflow-hidden rounded-3xl border bg-[#0a0e14]/80 p-8 backdrop-blur-xl transition-colors duration-700"
          style={{ borderColor: `${colors.primary}30` }}
        >
          {/* Ambient glow */}
          <motion.div
            animate={{ opacity: mode === 'safe' ? 0.05 : mode === 'warning' ? 0.12 : 0.2 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 blur-[100px]"
            style={{ backgroundColor: colors.primary }}
          />

          {/* Grid floor */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 opacity-20"
            style={{
              backgroundImage: `linear-gradient(${colors.primary}40 1px, transparent 1px), linear-gradient(90deg, ${colors.primary}40 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
              transform: 'perspective(400px) rotateX(60deg)',
              transformOrigin: 'bottom',
            }}
          />

          {/* Gas particles */}
          {Array.from({ length: mode === 'safe' ? 5 : mode === 'warning' ? 12 : 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: colors.primary,
                left: `${10 + Math.random() * 80}%`,
                bottom: '10%',
              }}
              animate={{
                y: [0, -200 - Math.random() * 100],
                opacity: [0, 0.6, 0],
                x: [0, (Math.random() - 0.5) * 50],
              }}
              transition={{
                duration: mode === 'safe' ? 4 : mode === 'warning' ? 2.5 : 1.5,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}

          {/* Machines & pipes */}
          <div className="relative flex items-end justify-between" style={{ height: '280px' }}>
            {/* Left machine block */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-24 w-20 flex-col items-center justify-center rounded-lg border border-white/10 bg-[#1a1e24]">
                <Cpu className="h-6 w-6 text-gray-500" />
                <span className="mt-1 text-[8px] uppercase text-gray-600">Unit A</span>
              </div>
              <div className="h-3 w-24 rounded bg-gray-800" />
            </div>

            {/* Center: Exhaust fan */}
            <div className="flex flex-col items-center gap-2">
              {/* Pipe */}
              <div className="h-16 w-4 rounded-t bg-gray-700" />
              {/* Fan housing */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 bg-[#1a1e24]" style={{ borderColor: sensor.fan ? colors.primary : '#333' }}>
                <motion.div
                  animate={{ rotate: sensor.fan ? 360 : 0 }}
                  transition={{ duration: sensor.fan ? (mode === 'danger' ? 0.4 : 0.8) : 0, repeat: Infinity, ease: 'linear' }}
                >
                  <Fan className="h-10 w-10" style={{ color: sensor.fan ? colors.primary : '#555' }} />
                </motion.div>
                {/* Airflow particles */}
                {sensor.fan && [0, 0.3, 0.6].map((offset) => (
                  <motion.div
                    key={offset}
                    className="absolute h-1 w-1 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: [-40, -80], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: offset }}
                  />
                ))}
              </div>
              <span className="text-[9px] uppercase text-gray-500">Exhaust</span>
            </div>

            {/* Right: Camera + sensor */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-24 w-20 flex-col items-center justify-center rounded-lg border border-white/10 bg-[#1a1e24]">
                <Camera className="h-6 w-6" style={{ color: sensor.humanDetected ? colors.primary : '#555' }} />
                <span className="mt-1 text-[8px] uppercase text-gray-600">ESP32-CAM</span>
                {sensor.humanDetected && (
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"
                  />
                )}
              </div>
              <div className="h-3 w-24 rounded bg-gray-800" />
            </div>
          </div>

          {/* Status bar */}
          <div className="relative mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" style={{ color: colors.primary }} />
              <span className="text-xs text-gray-400">Environment Status:</span>
              <span className="text-xs font-bold uppercase" style={{ color: colors.primary }}>
                {mode === 'safe' ? 'NORMAL' : mode === 'warning' ? 'ELEVATED' : 'CRITICAL'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><Wind className="h-3 w-3" /> Vent: {sensor.fan ? 'ON' : 'OFF'}</span>
              <span className="flex items-center gap-1"><Camera className="h-3 w-3" /> Cam: {sensor.humanDetected ? 'ACTIVE' : 'STANDBY'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
