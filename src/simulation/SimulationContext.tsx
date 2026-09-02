import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import type { SystemMode, SensorState } from '@/types';

interface SimulationContextValue {
  mode: SystemMode;
  setMode: (mode: SystemMode) => void;
  sensor: SensorState;
  packets: number;
  latency: number;
  lastSync: string;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

const MODE_TARGETS: Record<SystemMode, Partial<SensorState>> = {
  safe: {
    mq2: 280,
    mq135: 310,
    temperature: 32.7,
    humidity: 62.8,
    pir: false,
    humanDetected: false,
    riskLevel: 18,
    relay: false,
    fan: false,
    alarm: false,
  },
  warning: {
    mq2: 620,
    mq135: 580,
    temperature: 41.2,
    humidity: 71.5,
    pir: false,
    humanDetected: false,
    riskLevel: 58,
    relay: false,
    fan: false,
    alarm: false,
  },
  danger: {
    mq2: 890,
    mq135: 820,
    temperature: 48.6,
    humidity: 78.3,
    pir: true,
    humanDetected: true,
    riskLevel: 82,
    relay: true,
    fan: true,
    alarm: true,
  },
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SystemMode>('safe');
  const [sensor, setSensor] = useState<SensorState>({
    mq2: 280,
    mq135: 310,
    temperature: 32.7,
    humidity: 62.8,
    pir: false,
    humanDetected: false,
    riskLevel: 18,
    relay: false,
    fan: false,
    alarm: false,
  });
  const [packets, setPackets] = useState(1284);
  const [latency, setLatency] = useState(42);
  const [lastSync, setLastSync] = useState('JUST NOW');

  const currentRef = useRef(sensor);
  currentRef.current = sensor;

  useEffect(() => {
    const interval = setInterval(() => {
      const target = MODE_TARGETS[mode];
      setSensor((prev) => {
        const jitter = () => (Math.random() - 0.5) * 6;
        const next = { ...prev };

        next.mq2 = Math.max(0, lerp(prev.mq2, (target.mq2 ?? prev.mq2) + jitter(), 0.08));
        next.mq135 = Math.max(0, lerp(prev.mq135, (target.mq135 ?? prev.mq135) + jitter(), 0.08));
        next.temperature = lerp(prev.temperature, (target.temperature ?? prev.temperature) + jitter() * 0.3, 0.06);
        next.humidity = Math.max(0, Math.min(100, lerp(prev.humidity, (target.humidity ?? prev.humidity) + jitter() * 0.4, 0.06)));
        next.riskLevel = Math.max(0, Math.min(100, lerp(prev.riskLevel, target.riskLevel ?? prev.riskLevel, 0.05)));

        // Boolean transitions with slight delay for realism
        next.pir = target.pir ?? prev.pir;
        next.humanDetected = target.humanDetected ?? prev.humanDetected;
        next.relay = target.relay ?? prev.relay;
        next.fan = target.fan ?? prev.fan;
        next.alarm = target.alarm ?? prev.alarm;

        return next;
      });

      setPackets((p) => p + Math.floor(Math.random() * 4) + 1);
      setLatency(() => 38 + Math.floor(Math.random() * 12));
      setLastSync('JUST NOW');
    }, 1200);

    return () => clearInterval(interval);
  }, [mode]);

  return (
    <SimulationContext.Provider value={{ mode, setMode, sensor, packets, latency, lastSync }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation(): SimulationContextValue {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
}
