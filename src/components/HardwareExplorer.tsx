import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ESP32Board } from './ESP32Model';
import { DataConnection, useContainerSize, pctToPx } from './DataConnection';
import { useSimulation } from '@/simulation/SimulationContext';
import { SENSORS } from '@/data/sensors';
import type { SensorInfo } from '@/types';
import { SectionTitle } from './shared/SectionTitle';
import { X, Cpu, Flame, Wind, Thermometer, Droplet, Scan, Camera } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  flame: Flame, wind: Wind, thermometer: Thermometer, droplet: Droplet, scan: Scan, camera: Camera,
};

// Percentage positions — left column and right column flanking the ESP32
const POSITIONS = [
  { x: 15, y: 20 },   // MQ-2
  { x: 15, y: 50 },   // MQ-135
  { x: 15, y: 80 },   // DHT22 temp
  { x: 85, y: 20 },   // DHT22 humidity
  { x: 85, y: 50 },   // PIR
  { x: 85, y: 80 },   // ESP32-CAM
];

export function HardwareExplorer() {
  const { sensor } = useSimulation();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<SensorInfo | null>(null);
  const { ref, size } = useContainerSize();

  const getVal = (id: string) => {
    switch (id) {
      case 'mq2': return `${Math.round(sensor.mq2)} ppm`;
      case 'mq135': return `${Math.round(sensor.mq135)} ppm`;
      case 'temperature': return `${sensor.temperature.toFixed(1)} °C`;
      case 'humidity': return `${sensor.humidity.toFixed(1)} %`;
      case 'pir': return sensor.pir ? 'DETECTED' : 'CLEAR';
      case 'esp32cam': return sensor.humanDetected ? 'HUMAN' : 'CLEAR';
      default: return '---';
    }
  };

  const center = { x: 50, y: 50 };
  const hasSize = size.width > 0 && size.height > 0;

  return (
    <section id="hardware" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Physical Architecture"
          title="Explore the Hardware"
          subtitle="Six sensors connect to the ESP32 microcontroller, forming a complete industrial safety monitoring network."
        />

        <div ref={ref} className="relative mx-auto h-[500px] max-w-4xl">
          {/* Connection wires — only render once we have measured dimensions */}
          {hasSize && SENSORS.map((s, i) => {
            const from = pctToPx(POSITIONS[i], size);
            const to = pctToPx(center, size);
            return (
              <DataConnection
                key={s.id}
                id={s.id}
                from={from}
                to={to}
                color={s.color}
                active={hovered === s.id || hovered === null}
                delay={i * 0.15}
              />
            );
          })}

          {/* ESP32 center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <ESP32Board size={180} />
          </div>

          {/* Sensor nodes */}
          {SENSORS.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Cpu;
            const pos = POSITIONS[i];
            return (
              <motion.div
                key={s.id}
                onHoverStart={() => setHovered(s.id)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => setSelected(s)}
                animate={{ scale: hovered === s.id ? 1.1 : 1 }}
                className="absolute flex cursor-pointer flex-col items-center gap-2"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 bg-[#0d1117]/90 backdrop-blur-sm transition-all"
                  style={{
                    borderColor: hovered === s.id ? s.color : 'rgba(255,255,255,0.1)',
                    boxShadow: hovered === s.id ? `0 0 25px ${s.color}50` : 'none',
                  }}
                >
                  <Icon className="h-7 w-7" style={{ color: s.color }} />
                  {hovered === s.id && (
                    <div
                      className="absolute -inset-1 rounded-2xl opacity-30 blur-md"
                      style={{ backgroundColor: s.color }}
                    />
                  )}
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-white">{s.shortName}</div>
                  <div className="font-mono text-[10px]" style={{ color: s.color }}>{getVal(s.id)}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info panel */}
        <AnimatePresence>
          {hovered && !selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mx-auto mt-4 max-w-md rounded-xl border border-white/10 bg-[#0d1117]/90 p-4 backdrop-blur-xl"
            >
              {(() => {
                const s = SENSORS.find((x) => x.id === hovered);
                if (!s) return null;
                return (
                  <div className="text-sm text-gray-300">
                    <span className="font-bold" style={{ color: s.color }}>{s.name}</span>
                    <span className="text-gray-500"> — {s.detects}</span>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl border bg-[#0d1117]/95 p-6 backdrop-blur-xl"
              style={{ borderColor: `${selected.color}40` }}
            >
              <button onClick={() => setSelected(null)} className="absolute right-4 top-4 text-gray-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border" style={{ backgroundColor: `${selected.color}15`, borderColor: `${selected.color}50` }}>
                  <div className="h-6 w-6 rounded" style={{ backgroundColor: selected.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selected.shortName}</h3>
                  <p className="text-xs text-gray-500">{selected.name}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">Purpose</span>
                  <p className="mt-0.5 text-gray-300">{selected.detects}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">Current Reading</span>
                  <p className="mt-0.5 font-mono text-lg font-bold" style={{ color: selected.color }}>{getVal(selected.id)}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">Status</span>
                  <p className="mt-0.5 font-mono text-green-400">Online</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">Safety Role</span>
                  <p className="mt-0.5 text-gray-300">{selected.safetyRole}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
