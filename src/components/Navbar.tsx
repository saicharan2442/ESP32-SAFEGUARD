import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Home, Wrench, Activity, ScanLine, Workflow, Layers, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '#hero', icon: Home },
  { label: 'Hardware', href: '#hardware', icon: Wrench },
  { label: 'Live Monitor', href: '#monitor', icon: Activity },
  { label: 'Detection', href: '#detection', icon: ScanLine },
  { label: 'Workflow', href: '#workflow', icon: Workflow },
  { label: 'Technology', href: '#technology', icon: Layers },
];

export function Navbar({ onLaunchSim }: { onLaunchSim: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-[#0a0e14]/85 py-2.5 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent py-4'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10">
              <Cpu className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="absolute inset-0 animate-pulse rounded-lg border border-cyan-400/30" />
          </div>
          <div className="leading-none">
            <span className="block text-sm font-bold tracking-wide text-white">ESP32 SAFEGUARD</span>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">Industrial Safety</span>
          </div>
        </a>

        {/* Nav links */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-cyan-400"
            >
              <item.icon className="h-3.5 w-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onLaunchSim}
          className="group relative flex items-center gap-2 overflow-hidden rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          <Zap className="h-4 w-4" />
          <span className="relative z-10">LIVE SIMULATION</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </div>
    </motion.nav>
  );
}
