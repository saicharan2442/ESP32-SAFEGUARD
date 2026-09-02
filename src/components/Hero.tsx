import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ESP32Board } from './ESP32Model';
import { SensorNode } from './SensorNode';
import { DataConnection } from './DataConnection';
import { useSimulation } from '@/simulation/SimulationContext';
import { SENSORS } from '@/data/sensors';
import type { SensorInfo } from '@/types';
import { X, Cpu } from 'lucide-react';

export function Hero() {
  const { sensor, mode } = useSimulation();
  const [hoveredSensor, setHoveredSensor] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<SensorInfo | null>(null);
  const [hoveringESP32, setHoveringESP32] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const sensorRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [wireAnchors, setWireAnchors] = useState<Record<string, { from: { x: number; y: number }; to: { x: number; y: number } }>>({});

  const updateWireAnchors = useCallback(() => {
    const container = containerRef.current;
    const board = boardRef.current;
    if (!container || !board) return;

    const containerRect = container.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    const boardLeft = boardRect.left - containerRect.left;
    const boardRight = boardRect.right - containerRect.left;
    const boardTop = boardRect.top - containerRect.top;
    const boardBottom = boardRect.bottom - containerRect.top;

    const nextAnchors: Record<string, { from: { x: number; y: number }; to: { x: number; y: number } }> = {};

    SENSORS.forEach((s) => {
      const node = sensorRefs.current[s.id];
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const centerY = rect.top - containerRect.top + rect.height / 2;
      const side = s.position.x < 0 ? 'left' : 'right';
      const sensorOrder = side === 'left' ? SENSORS.filter((item) => item.position.x < 0).findIndex((item) => item.id === s.id) : SENSORS.filter((item) => item.position.x > 0).findIndex((item) => item.id === s.id);
      const targetY = boardTop + (boardBottom - boardTop) * (0.2 + sensorOrder * 0.28);

      nextAnchors[s.id] = {
        from: {
          x: side === 'left' ? rect.right - containerRect.left + 12 : rect.left - containerRect.left - 12,
          y: centerY,
        },
        to: {
          x: side === 'left' ? boardLeft + 12 : boardRight - 12,
          y: targetY,
        },
      };
    });

    setWireAnchors(nextAnchors);
  }, []);

  useEffect(() => {
    updateWireAnchors();
    const resizeObserver = new ResizeObserver(updateWireAnchors);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', updateWireAnchors);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWireAnchors);
    };
  }, [updateWireAnchors]);

  const getSensorValue = (id: string): string => {
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

  const leftSensors = SENSORS.filter((_, i) => i < 3);
  const rightSensors = SENSORS.filter((_, i) => i >= 3);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#0a0e14]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1520] via-[#0a0e14] to-[#0a0e14]" />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Volumetric glow */}
      <div className="absolute left-1/2 top-1/3 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="absolute right-10 top-1/2 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-cyan-400/30"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Left: Text */}
          <div className="z-10 pt-8 lg:pt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              Industrial IoT Safety System
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              ESP32 Industrial Safety
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                & Accident Prediction System
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-4 text-lg font-medium text-gray-300"
            >
              Real-Time Industrial Pollution Monitoring, Human Detection & Automated Safety Response
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-3 max-w-lg text-sm text-gray-500"
            >
              Monitor harmful gases, air quality, temperature, humidity and human presence using ESP32, cloud connectivity and intelligent safety automation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 flex gap-3"
            >
              <a
                href="#hardware"
                className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                Explore Hardware
              </a>
              <a
                href="#monitor"
                className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-gray-300 transition-all hover:border-white/20 hover:bg-white/10"
              >
                Live Monitor
              </a>
            </motion.div>
          </div>

          {/* Right: ESP32 + sensors */}
          <div className="relative flex items-center justify-center py-8 lg:py-16">
            <div ref={containerRef} className="relative h-[420px] w-full max-w-[640px]">
              {/* Connection lines container */}
              <div className="absolute inset-0">
                {SENSORS.map((s, i) => {
                  const anchor = wireAnchors[s.id] ?? {
                    from: { x: s.position.x < 0 ? 80 : 560, y: 60 + i * 55 },
                    to: { x: 320, y: 210 },
                  };

                  return (
                    <DataConnection
                      key={s.id}
                      id={`hero-${s.id}`}
                      from={anchor.from}
                      to={anchor.to}
                      color={s.color}
                      active={hoveredSensor === s.id || hoveredSensor === null}
                      delay={i * 0.2}
                    />
                  );
                })}
              </div>

              {/* Left sensors */}
              <div className="absolute left-0 top-0 flex flex-col gap-3">
                {leftSensors.map((s) => (
                  <SensorNode
                    key={s.id}
                    sensor={s}
                    value={getSensorValue(s.id)}
                    status="ONLINE"
                    hovered={hoveredSensor === s.id}
                    onHover={setHoveredSensor}
                    onClick={setSelectedSensor}
                    side="left"
                    nodeRef={(node) => {
                      sensorRefs.current[s.id] = node;
                    }}
                  />
                ))}
              </div>

              {/* Right sensors */}
              <div className="absolute right-0 top-0 flex flex-col gap-3">
                {rightSensors.map((s) => (
                  <SensorNode
                    key={s.id}
                    sensor={s}
                    value={getSensorValue(s.id)}
                    status="ONLINE"
                    hovered={hoveredSensor === s.id}
                    onHover={setHoveredSensor}
                    onClick={setSelectedSensor}
                    side="right"
                    nodeRef={(node) => {
                      sensorRefs.current[s.id] = node;
                    }}
                  />
                ))}
              </div>

              {/* ESP32 center */}
              <motion.div
                ref={boardRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                onHoverStart={() => setHoveringESP32(true)}
                onHoverEnd={() => setHoveringESP32(false)}
              >
                <ESP32Board size={200} />
              </motion.div>

              {/* ESP32 hover tooltip */}
              <AnimatePresence>
                {hoveringESP32 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-1/2 top-[calc(50%+90px)] z-20 w-56 -translate-x-1/2 rounded-xl border border-cyan-500/30 bg-[#0d1117]/95 p-3 backdrop-blur-xl"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-bold text-white">ESP32 CONTROLLER</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div className="flex justify-between"><span>Sensors Connected</span><span className="font-mono text-green-400">6/6</span></div>
                      <div className="flex justify-between"><span>Wi-Fi</span><span className="font-mono text-green-400">CONNECTED</span></div>
                      <div className="flex justify-between"><span>Cloud</span><span className="font-mono text-green-400">CONNECTED</span></div>
                      <div className="flex justify-between"><span>System</span><span className="font-mono text-green-400">ONLINE</span></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sensor hover tooltip */}
              <AnimatePresence>
                {hoveredSensor && !hoveringESP32 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-0 left-1/2 z-20 w-64 -translate-x-1/2 rounded-xl border border-white/10 bg-[#0d1117]/95 p-3 backdrop-blur-xl"
                  >
                    {(() => {
                      const s = SENSORS.find((x) => x.id === hoveredSensor);
                      if (!s) return null;
                      return (
                        <>
                          <div className="mb-1 text-sm font-bold" style={{ color: s.color }}>{s.name}</div>
                          <div className="space-y-1 text-xs text-gray-400">
                            <div className="flex justify-between"><span>Value</span><span className="font-mono text-white">{getSensorValue(s.id)}</span></div>
                            <div className="flex justify-between"><span>Status</span><span className="font-mono text-green-400">ONLINE</span></div>
                            <div className="flex justify-between"><span>Signal</span><span className="font-mono text-cyan-400">Strong</span></div>
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor detail modal */}
      <AnimatePresence>
        {selectedSensor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedSensor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl border bg-[#0d1117]/95 p-6 backdrop-blur-xl"
              style={{ borderColor: `${selectedSensor.color}40` }}
            >
              <button
                onClick={() => setSelectedSensor(null)}
                className="absolute right-4 top-4 text-gray-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl border"
                  style={{ backgroundColor: `${selectedSensor.color}15`, borderColor: `${selectedSensor.color}50` }}
                >
                  <div className="h-6 w-6 rounded" style={{ backgroundColor: selectedSensor.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedSensor.shortName}</h3>
                  <p className="text-xs text-gray-500">{selectedSensor.name}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">What it detects</span>
                  <p className="mt-0.5 text-gray-300">{selectedSensor.detects}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">Current Reading</span>
                  <p className="mt-0.5 font-mono text-lg font-bold" style={{ color: selectedSensor.color }}>
                    {getSensorValue(selectedSensor.id)}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">Status</span>
                  <p className="mt-0.5 font-mono text-green-400">ONLINE</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">Safety Role</span>
                  <p className="mt-0.5 text-gray-300">{selectedSensor.safetyRole}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-gray-600">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-8 w-5 rounded-full border border-gray-700"
          >
            <div className="mx-auto mt-1.5 h-1.5 w-1 rounded-full bg-gray-600" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
