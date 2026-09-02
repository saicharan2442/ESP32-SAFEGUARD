export type SystemMode = 'safe' | 'warning' | 'danger';

export interface SensorState {
  mq2: number;
  mq135: number;
  temperature: number;
  humidity: number;
  pir: boolean;
  humanDetected: boolean;
  riskLevel: number;
  relay: boolean;
  fan: boolean;
  alarm: boolean;
}

export interface SensorInfo {
  id: string;
  name: string;
  shortName: string;
  detects: string;
  unit: string;
  valueLabel: string;
  safetyRole: string;
  icon: string;
  color: string;
  position: { x: number; y: number };
}

export interface TechItem {
  name: string;
  description: string;
  icon: string;
  color: string;
}
