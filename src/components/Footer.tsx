import { Cpu, Github, Mail, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#0a0e14] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo & description */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10">
                <Cpu className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">ESP32 SAFEGUARD</span>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">Industrial Safety</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Real-time industrial pollution monitoring, human detection, and automated safety response powered by ESP32 and cloud connectivity.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">System</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#hardware" className="hover:text-cyan-400 transition-colors">Hardware Architecture</a></li>
              <li><a href="#monitor" className="hover:text-cyan-400 transition-colors">Live Monitoring</a></li>
              <li><a href="#detection" className="hover:text-cyan-400 transition-colors">Worker Detection</a></li>
              <li><a href="#workflow" className="hover:text-cyan-400 transition-colors">System Workflow</a></li>
              <li><a href="#technology" className="hover:text-cyan-400 transition-colors">Technology Stack</a></li>
            </ul>
          </div>

          {/* Safety badge */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Certification</h4>
            <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/5 p-3">
              <ShieldCheck className="h-6 w-6 text-green-400" />
              <div>
                <div className="text-sm font-bold text-green-400">Safety Certified</div>
                <div className="text-xs text-gray-500">Industrial IoT Compliant</div>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-500 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-500 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-gray-600">
          ESP32 Industrial Safety & Accident Prediction System — Built with ESP32, AWS Cloud, and intelligent safety automation.
        </div>
      </div>
    </footer>
  );
}
