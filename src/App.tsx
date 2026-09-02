import { useState } from 'react';
import { SimulationProvider } from '@/simulation/SimulationContext';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { LiveStatus } from '@/components/LiveStatus';
import { HardwareExplorer } from '@/components/HardwareExplorer';
import { SensorDashboard } from '@/components/SensorDashboard';
import { RiskMeter } from '@/components/RiskMeter';
import { IndustrialEnvironment } from '@/components/IndustrialEnvironment';
import { WorkerDetection } from '@/components/WorkerDetection';
import { SafetyResponse } from '@/components/SafetyResponse';
import { CloudConnection } from '@/components/CloudConnection';
import { Workflow } from '@/components/Workflow';
import { Technology } from '@/components/Technology';
import { SimulationPanel } from '@/components/SimulationPanel';
import { Footer } from '@/components/Footer';

function App() {
  const [simOpen, setSimOpen] = useState(false);

  return (
    <SimulationProvider>
      <div className="min-h-screen bg-[#0a0e14] text-white antialiased">
        <Navbar onLaunchSim={() => setSimOpen(true)} />
        <main>
          <Hero />
          <LiveStatus />
          <HardwareExplorer />
          <SensorDashboard />
          <RiskMeter />
          <IndustrialEnvironment />
          <WorkerDetection />
          <SafetyResponse />
          <CloudConnection />
          <Workflow />
          <Technology />
        </main>
        <Footer />
        <SimulationPanel open={simOpen} onClose={() => setSimOpen(false)} />
      </div>
    </SimulationProvider>
  );
}

export default App;
