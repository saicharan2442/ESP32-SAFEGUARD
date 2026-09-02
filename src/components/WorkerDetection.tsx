import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '@/simulation/SimulationContext';
import { SectionTitle } from './shared/SectionTitle';
import { Scan, Camera, User, Radar, Video, VideoOff, Loader2, AlertCircle } from 'lucide-react';

type CamStatus = 'idle' | 'connecting' | 'live' | 'error';

export function WorkerDetection() {
  const { sensor } = useSimulation();
  const detected = sensor.humanDetected;

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camStatus, setCamStatus] = useState<CamStatus>('idle');
  const [camError, setCamError] = useState<string>('');

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCamStatus('idle');
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCamError('Camera not available. This feature requires HTTPS or localhost. In Bolt preview, camera access may be restricted.');
      setCamStatus('error');
      return;
    }

    setCamStatus('connecting');
    setCamError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;

      // Wait for the next render tick so the video element ref is available
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCamStatus('live');
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (msg.includes('Permission') || msg.includes('NotAllowed') || msg.includes('denied')) {
        setCamError('Camera access denied. Please allow camera permissions in your browser settings and try again.');
      } else if (msg.includes('NotFound') || msg.includes('DevicesNotFound') || msg.includes('No camera')) {
        setCamError('No camera found on this device.');
      } else if (msg.includes('NotReadable') || msg.includes('track')) {
        setCamError('Camera is in use by another application. Please close it and try again.');
      } else {
        setCamError(`Camera error: ${msg}`);
      }
      setCamStatus('error');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const showVideo = camStatus === 'live' || camStatus === 'connecting';

  return (
    <section id="detection" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Computer Vision"
          title="Worker Safety Monitoring"
          subtitle="ESP32-CAM and PIR sensors work together to detect worker presence in hazardous zones. Click 'Start Camera' to view a live feed."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Camera view */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e14]/80 backdrop-blur-xl">
            {/* Camera header */}
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">ESP32-CAM FEED</span>
              </div>
              <div className="flex items-center gap-2">
                {camStatus === 'live' && (
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    <span className="text-[10px] font-mono text-red-400">REC</span>
                  </div>
                )}
                <button
                  onClick={camStatus === 'live' ? stopCamera : startCamera}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                    camStatus === 'live'
                      ? 'border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                  }`}
                >
                  {camStatus === 'connecting' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : camStatus === 'live' ? (
                    <VideoOff className="h-3.5 w-3.5" />
                  ) : (
                    <Video className="h-3.5 w-3.5" />
                  )}
                  {camStatus === 'connecting' ? 'CONNECTING...' : camStatus === 'live' ? 'STOP CAMERA' : 'START CAMERA'}
                </button>
              </div>
            </div>

            {/* Camera viewport */}
            <div className="relative h-[320px] bg-gradient-to-b from-[#0d1520] to-[#0a0e14]">
              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Real video feed — always in DOM so ref is available, hidden when not active */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  camStatus === 'live' ? 'opacity-90' : 'opacity-0 pointer-events-none'
                }`}
              />

              {/* Scanning line — only when live */}
              {camStatus === 'live' && (
                <motion.div
                  animate={{ y: [0, 320, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none"
                />
              )}

              {/* Detection box overlay — only when live and detected */}
              <AnimatePresence mode="wait">
                {detected && camStatus === 'live' && (
                  <motion.div
                    key="worker-detected"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <motion.div
                      animate={{ borderColor: ['#ef4444', '#f87171', '#ef4444'] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="relative h-32 w-24 rounded-lg border-2"
                    >
                      {/* Corner markers */}
                      <div className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-red-400" />
                      <div className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-red-400" />
                      <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-red-400" />
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-red-400" />

                      {/* Label */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        PERSON: 0.94
                      </div>

                      {/* Tracking pulse */}
                      <motion.div
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-lg border-2 border-red-400"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Idle / placeholder state */}
              {camStatus === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/5">
                    <Video className="h-7 w-7 text-cyan-400/60" />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-gray-600">Camera Standby</span>
                  <span className="text-[10px] text-gray-700">Click "Start Camera" to view live feed</span>
                </div>
              )}

              {/* Connecting state */}
              {camStatus === 'connecting' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400/60" />
                  <span className="text-xs uppercase tracking-widest text-gray-500">Connecting to camera...</span>
                </div>
              )}

              {/* Error state */}
              {camStatus === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <AlertCircle className="h-8 w-8 text-red-400/60" />
                  <span className="max-w-xs text-xs text-red-400/80">{camError}</span>
                </div>
              )}

              {/* Corner HUD — always visible */}
              <div className="absolute left-3 top-3 font-mono text-[10px] text-cyan-400/60 pointer-events-none">
                CAM_01 | ZONE_A
              </div>
              <div className="absolute right-3 top-3 font-mono text-[10px] text-cyan-400/60 pointer-events-none">
                {new Date().toLocaleTimeString()}
              </div>
              {camStatus === 'live' && (
                <div className="absolute bottom-3 left-3 font-mono text-[10px] text-green-400/60 pointer-events-none">
                  ● LIVE FEED
                </div>
              )}
            </div>

            {/* Camera footer */}
            <div className="flex items-center justify-between border-t border-white/10 p-3">
              <span className="text-[10px] text-gray-500">
                {camStatus === 'live' ? 'FEED: LIVE WEBCAM' : 'FEED: STANDBY'}
              </span>
              <span className="flex items-center gap-1.5 text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: detected ? '#ef4444' : '#22c55e' }} />
                <span style={{ color: detected ? '#ef4444' : '#22c55e' }}>
                  {detected ? 'WORKER DETECTED' : 'AREA CLEAR'}
                </span>
              </span>
            </div>
          </div>

          {/* Detection status panel */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={detected ? 'detected' : 'clear'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center gap-3 rounded-2xl border p-5 ${
                  detected ? 'border-red-500/40 bg-red-500/10' : 'border-green-500/40 bg-green-500/10'
                }`}
              >
                {detected ? (
                  <>
                    <User className="h-8 w-8 text-red-400" />
                    <div>
                      <div className="text-lg font-bold text-red-400">WORKER DETECTED</div>
                      <div className="text-xs text-gray-500">Human presence confirmed in monitored zone</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Scan className="h-8 w-8 text-green-400" />
                    <div>
                      <div className="text-lg font-bold text-green-400">AREA CLEAR</div>
                      <div className="text-xs text-gray-500">No human presence detected</div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Sensor status cards */}
            <div className="grid grid-cols-1 gap-3">
              <div className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${sensor.pir ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 bg-black/20'}`}>
                <div className="flex items-center gap-2">
                  <Radar className={`h-5 w-5 ${sensor.pir ? 'text-red-400' : 'text-gray-500'}`} />
                  <span className="text-sm font-semibold text-white">PIR Sensor</span>
                </div>
                <span className={`font-mono text-sm font-bold ${sensor.pir ? 'text-red-400' : 'text-green-400'}`}>
                  {sensor.pir ? 'DETECTED' : 'CLEAR'}
                </span>
              </div>

              <div className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${sensor.humanDetected ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 bg-black/20'}`}>
                <div className="flex items-center gap-2">
                  <Camera className={`h-5 w-5 ${sensor.humanDetected ? 'text-red-400' : 'text-gray-500'}`} />
                  <span className="text-sm font-semibold text-white">ESP32-CAM</span>
                </div>
                <span className={`font-mono text-sm font-bold ${sensor.humanDetected ? 'text-red-400' : 'text-green-400'}`}>
                  {sensor.humanDetected ? 'HUMAN DETECTED' : 'STANDBY'}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2">
                  <Scan className={`h-5 w-5 ${detected ? 'text-amber-400 animate-pulse' : 'text-gray-500'}`} />
                  <span className="text-sm font-semibold text-white">Safety Status</span>
                </div>
                <span className={`font-mono text-sm font-bold ${detected ? 'text-amber-400' : 'text-green-400'}`}>
                  {detected ? 'CHECKING...' : 'CLEAR'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
