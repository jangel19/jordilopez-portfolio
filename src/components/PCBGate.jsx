import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const WIRES = [
  { id: 'red', label: '3.3V', color: '#d45353', target: 'VCC' },
  { id: 'black', label: 'GND', color: '#242834', target: 'GND' },
  { id: 'blue', label: 'SDA', color: '#4a9eff', target: 'SDA' },
  { id: 'yellow', label: 'SCL', color: '#e7c85d', target: 'SCL' },
];

const DESKTOP_LAYOUT = {
  width: 900,
  height: 600,
  chip: { x: 452, y: 282, w: 104, h: 104 },
  led: { x: 602, y: 226, r: 5 },
  pads: {
    VCC: { x: 452, y: 164 },
    GND: { x: 452, y: 420 },
    SDA: { x: 294, y: 282 },
    SCL: { x: 610, y: 282 },
  },
  homes: {
    red: { x: 765, y: 168 },
    black: { x: 765, y: 256 },
    blue: { x: 765, y: 344 },
    yellow: { x: 765, y: 432 },
  },
};

const MOBILE_LAYOUT = {
  width: 420,
  height: 760,
  chip: { x: 210, y: 238, w: 92, h: 92 },
  led: { x: 312, y: 184, r: 5 },
  pads: {
    VCC: { x: 210, y: 136 },
    GND: { x: 210, y: 340 },
    SDA: { x: 92, y: 238 },
    SCL: { x: 328, y: 238 },
  },
  homes: {
    red: { x: 92, y: 566 },
    black: { x: 176, y: 566 },
    blue: { x: 260, y: 566 },
    yellow: { x: 344, y: 566 },
  },
};

const getWirePath = (start, end) => {
  const deltaX = end.x - start.x;
  const controlOffset = Math.max(Math.abs(deltaX) * 0.38, 56);

  return `M ${start.x} ${start.y} C ${start.x + controlOffset} ${start.y}, ${end.x - controlOffset} ${end.y}, ${end.x} ${end.y}`;
};

const getDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const getNearestPad = (point, pads, threshold) => {
  let closestKey = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  Object.entries(pads).forEach(([key, pad]) => {
    const distance = getDistance(point, pad);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestKey = key;
    }
  });

  return closestDistance <= threshold ? closestKey : null;
};

const getPadLabel = (key) => (key === 'VCC' ? 'VCC / 3.3V' : key);

const PCBGate = ({ onComplete }) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [connections, setConnections] = useState({});
  const [dragging, setDragging] = useState(null);
  const [feedbackPad, setFeedbackPad] = useState(null);
  const [feedbackTone, setFeedbackTone] = useState(null);
  const [powered, setPowered] = useState(false);
  const feedbackTimeoutRef = useRef(null);
  const audioContextRef = useRef(null);

  const layout = isMobile ? MOBILE_LAYOUT : DESKTOP_LAYOUT;
  const connectedCount = Object.keys(connections).length;

  const wireEndpoints = useMemo(() => {
    return WIRES.reduce((accumulator, wire) => {
      if (dragging?.wireId === wire.id) {
        accumulator[wire.id] = dragging.point;
      } else if (connections[wire.id]) {
        accumulator[wire.id] = layout.pads[connections[wire.id]];
      } else {
        accumulator[wire.id] = layout.homes[wire.id];
      }
      return accumulator;
    }, {});
  }, [connections, dragging, layout]);

  const playSnapTone = useCallback((frequency) => {
    try {
      const context = audioContextRef.current ?? new window.AudioContext();
      audioContextRef.current = context;

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, context.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.18);
    } catch {
      // Audio is optional polish.
    }
  }, []);

  const clearFeedback = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
    setFeedbackPad(null);
    setFeedbackTone(null);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (connectedCount !== WIRES.length || powered) {
      return undefined;
    }

    setPowered(true);
    playSnapTone(820);
    return undefined;
  }, [connectedCount, playSnapTone, powered]);

  useEffect(() => {
    if (!dragging) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      const svg = document.getElementById('pcb-gate-svg');
      if (!svg) {
        return;
      }

      const rect = svg.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * layout.width;
      const y = ((event.clientY - rect.top) / rect.height) * layout.height;
      const point = { x, y };

      setDragging((previous) => previous ? { ...previous, point } : previous);

      const nearest = getNearestPad(point, layout.pads, isMobile ? 34 : 42);
      setFeedbackPad(nearest);
      setFeedbackTone(nearest ? 'hover' : null);
    };

    const handlePointerUp = () => {
      setDragging((previous) => {
        if (!previous) {
          return previous;
        }

        const nearest = getNearestPad(previous.point, layout.pads, isMobile ? 34 : 42);
        clearFeedback();

        if (!nearest) {
          return null;
        }

        const wire = WIRES.find((item) => item.id === previous.wireId);
        if (!wire) {
          return null;
        }

        const padTaken = Object.entries(connections).find(
          ([wireId, pad]) => wireId !== wire.id && pad === nearest
        );

        if (padTaken || wire.target !== nearest) {
          setFeedbackPad(nearest);
          setFeedbackTone('wrong');
          playSnapTone(210);
          feedbackTimeoutRef.current = window.setTimeout(() => {
            setFeedbackPad(null);
            setFeedbackTone(null);
          }, 320);
          return null;
        }

        setConnections((current) => ({ ...current, [wire.id]: nearest }));
        setFeedbackPad(nearest);
        setFeedbackTone('correct');
        playSnapTone(560);
        feedbackTimeoutRef.current = window.setTimeout(() => {
          setFeedbackPad(null);
          setFeedbackTone(null);
        }, 320);

        return null;
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [clearFeedback, connections, dragging, isMobile, layout, playSnapTone]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const startDrag = (wireId) => {
    const startPoint = wireEndpoints[wireId];
    setDragging({ wireId, point: startPoint });
    clearFeedback();
  };

  const disconnectWire = (wireId) => {
    setConnections((current) => {
      const next = { ...current };
      delete next[wireId];
      return next;
    });
    if (powered) {
      setPowered(false);
    }
  };

  const handleContinue = () => {
    onComplete();
  };

  return (
    <motion.section
      key="pcb-gate"
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(74,158,255,0.08),transparent_34%),linear-gradient(180deg,#071326_0%,#05131f_100%)] px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col items-center justify-center">
            <motion.div
              className="mb-6 flex w-full max-w-[600px] justify-end"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-md border border-[rgba(74,158,255,0.16)] px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[#9ca3af] transition-colors duration-300 hover:border-[rgba(74,158,255,0.35)] hover:text-[#e8eaf0]"
              >
                Skip Intro
              </button>
            </motion.div>

            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <p className="mb-3 font-mono text-[0.72rem] uppercase tracking-[0.32em] text-[#8ba4bb]">
                Biosignal Sensor Initialization
              </p>
              <h1 className="font-sans text-2xl text-[#f5f7fa] md:text-4xl">
                Connect the heart rate sensor to enable the portfolio
              </h1>
            </motion.div>

            <motion.div
              className="w-full max-w-[600px] rounded-[1.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-4"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <svg
                id="pcb-gate-svg"
                viewBox={`0 0 ${layout.width} ${layout.height}`}
                className="h-auto w-full touch-none"
              >
                <defs>
                  <linearGradient id="boardGradient" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#31573c" />
                    <stop offset="52%" stopColor="#2a5234" />
                    <stop offset="100%" stopColor="#1f3f29" />
                  </linearGradient>
                  <linearGradient id="boardEdgeGradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#5f6d3d" />
                    <stop offset="100%" stopColor="#7c6b44" />
                  </linearGradient>
                  <radialGradient id="padGradient" cx="50%" cy="38%" r="68%">
                    <stop offset="0%" stopColor="#f4d879" />
                    <stop offset="55%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#98731a" />
                  </radialGradient>
                  <radialGradient id="viaGradient" cx="50%" cy="40%" r="65%">
                    <stop offset="0%" stopColor="#d7b860" />
                    <stop offset="100%" stopColor="#8b6717" />
                  </radialGradient>
                  <filter id="boardShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="rgba(0,0,0,0.38)" />
                  </filter>
                  <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="padShadow" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="rgba(0,0,0,0.45)" />
                  </filter>
                  <filter id="chipShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.4)" />
                  </filter>
                  <pattern id="solderMaskNoise" width="90" height="90" patternUnits="userSpaceOnUse">
                    <rect width="90" height="90" fill="transparent" />
                    <circle cx="8" cy="14" r="0.8" fill="rgba(255,255,255,0.03)" />
                    <circle cx="30" cy="18" r="0.9" fill="rgba(0,0,0,0.05)" />
                    <circle cx="52" cy="11" r="0.8" fill="rgba(255,255,255,0.025)" />
                    <circle cx="76" cy="22" r="1" fill="rgba(0,0,0,0.045)" />
                    <circle cx="16" cy="48" r="1" fill="rgba(0,0,0,0.04)" />
                    <circle cx="39" cy="42" r="0.75" fill="rgba(255,255,255,0.03)" />
                    <circle cx="64" cy="37" r="0.8" fill="rgba(0,0,0,0.05)" />
                    <circle cx="82" cy="58" r="0.7" fill="rgba(255,255,255,0.025)" />
                    <circle cx="14" cy="78" r="0.85" fill="rgba(255,255,255,0.03)" />
                    <circle cx="48" cy="72" r="0.8" fill="rgba(0,0,0,0.045)" />
                    <circle cx="71" cy="79" r="1" fill="rgba(255,255,255,0.03)" />
                  </pattern>
                  <pattern id="fiberglassWeave" width="26" height="26" patternUnits="userSpaceOnUse">
                    <path d="M 0 13 H 26 M 13 0 V 26" stroke="rgba(255,255,255,0.015)" strokeWidth="0.8" />
                    <path d="M 0 0 L 26 26 M 26 0 L 0 26" stroke="rgba(0,0,0,0.02)" strokeWidth="0.5" />
                  </pattern>
                  <pattern id="groundPour" width="18" height="18" patternUnits="userSpaceOnUse">
                    <circle cx="4" cy="4" r="0.8" fill="rgba(255,255,255,0.028)" />
                    <circle cx="13" cy="9" r="0.7" fill="rgba(255,255,255,0.02)" />
                    <circle cx="7" cy="14" r="0.75" fill="rgba(0,0,0,0.03)" />
                  </pattern>
                  <pattern id="pcbTraces" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M10 20 H90" stroke="#a89968" strokeWidth="1.5" opacity="0.4" fill="none" />
                    <circle cx="90" cy="20" r="2" fill="#a89968" opacity="0.4" />
                    <path d="M10 20 V80" stroke="#a89968" strokeWidth="1.5" opacity="0.4" fill="none" />
                    <circle cx="10" cy="80" r="2" fill="#a89968" opacity="0.4" />
                    <path d="M30 10 V50 H70" stroke="#a89968" strokeWidth="1.2" opacity="0.3" fill="none" />
                    <circle cx="70" cy="50" r="1.5" fill="#a89968" opacity="0.3" />
                    <path d="M18 62 H58 V90" stroke="#b8941f" strokeWidth="1.3" opacity="0.28" fill="none" />
                    <circle cx="58" cy="90" r="1.7" fill="#b8941f" opacity="0.28" />
                    <path d="M82 8 V38 H48" stroke="#a89968" strokeWidth="1.1" opacity="0.32" fill="none" />
                    <circle cx="48" cy="38" r="1.6" fill="#a89968" opacity="0.32" />
                    <path d="M6 46 H24 C28 46 30 48 30 52 V74" stroke="#a89968" strokeWidth="1.2" opacity="0.24" fill="none" />
                    <circle cx="30" cy="74" r="1.4" fill="#a89968" opacity="0.24" />
                    <path d="M52 14 H72 V30 H94" stroke="#b8941f" strokeWidth="1.6" opacity="0.26" fill="none" />
                    <circle cx="52" cy="14" r="1.7" fill="#b8941f" opacity="0.26" />
                    <path d="M44 64 H76 V82 H90" stroke="#a89968" strokeWidth="1.4" opacity="0.29" fill="none" />
                    <circle cx="76" cy="82" r="1.5" fill="#a89968" opacity="0.29" />
                    <path d="M14 94 H40 V70 H62" stroke="#a89968" strokeWidth="1.1" opacity="0.22" fill="none" />
                    <circle cx="40" cy="70" r="1.4" fill="#a89968" opacity="0.22" />
                    <path d="M66 56 C72 56 76 52 76 46 V24" stroke="#b8941f" strokeWidth="1.2" opacity="0.25" fill="none" />
                    <circle cx="76" cy="24" r="1.6" fill="#b8941f" opacity="0.25" />
                    <path d="M2 8 H20 V30 H38" stroke="#a89968" strokeWidth="1" opacity="0.2" fill="none" />
                    <path d="M84 54 V68 H98" stroke="#a89968" strokeWidth="1.2" opacity="0.24" fill="none" />
                  </pattern>
                  <clipPath id="boardClip">
                    <rect x="30" y="30" width={layout.width - 60} height={layout.height - 60} rx="14" />
                  </clipPath>
                </defs>

                <rect
                  x="24"
                  y="24"
                  width={layout.width - 48}
                  height={layout.height - 48}
                  rx="18"
                  fill="url(#boardEdgeGradient)"
                  filter="url(#boardShadow)"
                />
                <rect
                  x="30"
                  y="30"
                  width={layout.width - 60}
                  height={layout.height - 60}
                  rx="14"
                  fill="url(#boardGradient)"
                  stroke="rgba(255,255,255,0.08)"
                />
                <rect
                  x="30"
                  y="30"
                  width={layout.width - 60}
                  height={layout.height - 60}
                  rx="14"
                  fill="url(#pcbTraces)"
                  opacity="0.45"
                />
                <rect
                  x="30"
                  y="30"
                  width={layout.width - 60}
                  height={layout.height - 60}
                  rx="14"
                  fill="url(#solderMaskNoise)"
                  opacity="0.65"
                />
                <rect
                  x="30"
                  y="30"
                  width={layout.width - 60}
                  height={layout.height - 60}
                  rx="14"
                  fill="url(#fiberglassWeave)"
                  opacity="0.35"
                />
                <rect
                  x="30"
                  y="30"
                  width={layout.width - 60}
                  height={layout.height - 60}
                  rx="14"
                  fill="url(#groundPour)"
                  opacity="0.22"
                />

                <g opacity="0.92" clipPath="url(#boardClip)">
                  <path d={`M ${layout.pads.VCC.x} ${layout.pads.VCC.y} L ${layout.chip.x - 12} ${layout.chip.y - layout.chip.h / 2}`} stroke="#1e4029" strokeWidth="3" fill="none" opacity="0.6" />
                  <path d={`M ${layout.pads.GND.x} ${layout.pads.GND.y} L ${layout.chip.x + 12} ${layout.chip.y + layout.chip.h / 2}`} stroke="#1e4029" strokeWidth="3" fill="none" opacity="0.6" />
                  <path d={`M ${layout.pads.SDA.x} ${layout.pads.SDA.y} L ${layout.chip.x - layout.chip.w / 2} ${layout.chip.y - 12}`} stroke="#1e4029" strokeWidth="3" fill="none" opacity="0.6" />
                  <path d={`M ${layout.pads.SCL.x} ${layout.pads.SCL.y} L ${layout.chip.x + layout.chip.w / 2} ${layout.chip.y + 12}`} stroke="#1e4029" strokeWidth="3" fill="none" opacity="0.6" />
                  <circle cx={layout.chip.x - 128} cy={layout.chip.y - 116} r="5.2" fill="url(#viaGradient)" />
                  <circle cx={layout.chip.x + 144} cy={layout.chip.y + 102} r="5.2" fill="url(#viaGradient)" />
                  <circle cx={layout.chip.x + 122} cy={layout.chip.y - 108} r="4.6" fill="url(#viaGradient)" />
                </g>

                <g opacity="0.9">
                  {[
                    { x: 66, y: 66 },
                    { x: layout.width - 66, y: 66 },
                    { x: 66, y: layout.height - 66 },
                    { x: layout.width - 66, y: layout.height - 66 },
                  ].map((hole, index) => (
                    <g key={`mount-${index}`}>
                      <circle cx={hole.x} cy={hole.y} r="11" fill="url(#padGradient)" />
                      <circle cx={hole.x} cy={hole.y} r="5.5" fill="#26302b" />
                    </g>
                  ))}
                </g>

                <motion.circle
                  cx={layout.led.x}
                  cy={layout.led.y}
                  r={layout.led.r + 7}
                  fill={powered ? 'rgba(95, 230, 143, 0.35)' : 'rgba(0,0,0,0)'}
                  animate={powered ? { opacity: [0.45, 1, 0.6, 1] } : { opacity: 0 }}
                  transition={powered ? { duration: 0.9, repeat: Number.POSITIVE_INFINITY } : { duration: 0.2 }}
                  filter="url(#softGlow)"
                />
                <circle
                  cx={layout.led.x}
                  cy={layout.led.y}
                  r={layout.led.r}
                  fill={powered ? '#5fe68f' : '#17222d'}
                  stroke="rgba(255,255,255,0.25)"
                />
                <rect
                  x={layout.led.x - 10}
                  y={layout.led.y - 7}
                  width="20"
                  height="14"
                  rx="2.5"
                  fill="#e9ebee"
                  opacity="0.14"
                />
                <text
                  x={layout.led.x}
                  y={layout.led.y - 18}
                  textAnchor="middle"
                  className="fill-[#eef3f6] font-mono text-[10px] tracking-[0.24em]"
                >
                  PWR
                </text>

                <g>
                  <motion.rect
                    x={layout.chip.x - layout.chip.w / 2 - 10}
                    y={layout.chip.y - layout.chip.h / 2 - 10}
                    width={layout.chip.w + 20}
                    height={layout.chip.h + 20}
                    rx="18"
                    fill={powered ? 'rgba(95, 230, 143, 0.08)' : 'rgba(0,0,0,0)'}
                    animate={powered ? { opacity: [0.2, 0.55, 0.28] } : { opacity: 0 }}
                    transition={powered ? { duration: 0.9, repeat: 2 } : { duration: 0.2 }}
                  />
                  <rect
                    x={layout.chip.x - layout.chip.w / 2}
                    y={layout.chip.y - layout.chip.h / 2}
                    width={layout.chip.w}
                    height={layout.chip.h}
                    rx="8"
                    fill="#1a1a1a"
                    stroke="rgba(255,255,255,0.1)"
                    filter="url(#chipShadow)"
                  />
                  {Array.from({ length: 6 }).map((_, index) => {
                    const pinOffset = index * (isMobile ? 13 : 15);
                    return (
                      <g key={`pins-${index}`}>
                        <rect
                          x={layout.chip.x - layout.chip.w / 2 - 7}
                          y={layout.chip.y - (isMobile ? 39 : 46) + pinOffset}
                          width="7"
                          height={isMobile ? 8 : 9}
                          rx="1.4"
                          fill="url(#padGradient)"
                        />
                        <rect
                          x={layout.chip.x + layout.chip.w / 2}
                          y={layout.chip.y - (isMobile ? 39 : 46) + pinOffset}
                          width="7"
                          height={isMobile ? 8 : 9}
                          rx="1.4"
                          fill="url(#padGradient)"
                        />
                      </g>
                    );
                  })}
                  <text
                    x={layout.chip.x - layout.chip.w / 2 - 20}
                    y={layout.chip.y - layout.chip.h / 2 - 10}
                    textAnchor="end"
                    className="fill-[#f0f0f0] font-mono text-[10px] tracking-[0.18em]"
                    opacity="0.9"
                  >
                    U1
                  </text>
                  <text
                    x={layout.chip.x}
                    y={layout.chip.y - 6}
                    textAnchor="middle"
                    className="fill-[#f0f0f0] font-mono text-[14px] tracking-[0.16em]"
                  >
                    MAX30102
                  </text>
                  <text
                    x={layout.chip.x}
                    y={layout.chip.y + 22}
                    textAnchor="middle"
                    className="fill-[#a9b1b9] font-mono text-[8px] tracking-[0.14em]"
                  >
                    PPG HEART RATE / SPO2 SENSOR
                  </text>
                </g>

                {Object.entries(layout.pads).map(([key, pad]) => {
                  const tone =
                    feedbackPad === key && feedbackTone === 'wrong'
                      ? '#ef5350'
                      : feedbackPad === key && (feedbackTone === 'correct' || feedbackTone === 'hover')
                        ? '#5fe68f'
                        : '#c79b42';

                  return (
                    <g key={key}>
                      <motion.circle
                        cx={pad.x}
                        cy={pad.y}
                        r="19"
                        fill={feedbackPad === key ? `${tone}33` : 'rgba(0,0,0,0)'}
                        animate={feedbackPad === key ? { scale: [1, 1.14, 1] } : { scale: 1 }}
                        transition={{ duration: 0.28 }}
                      />
                      <circle
                        cx={pad.x}
                        cy={pad.y}
                        r="13"
                        fill="rgba(212,175,55,0.12)"
                      />
                      <circle
                        cx={pad.x}
                        cy={pad.y}
                        r="10.2"
                        fill="url(#padGradient)"
                        stroke={tone}
                        strokeWidth="1.1"
                        filter="url(#padShadow)"
                      />
                      <text
                        x={pad.x}
                        y={key === 'VCC' ? pad.y - 26 : key === 'GND' ? pad.y + 38 : pad.y + 5}
                        dx={key === 'SDA' ? -42 : key === 'SCL' ? 42 : 0}
                        textAnchor={key === 'SDA' ? 'end' : key === 'SCL' ? 'start' : 'middle'}
                        className="fill-[#eef3f6] font-mono text-[14px] tracking-[0.18em]"
                      >
                        {getPadLabel(key)}
                      </text>
                    </g>
                  );
                })}

                {WIRES.map((wire) => {
                  const start = layout.homes[wire.id];
                  const end = wireEndpoints[wire.id];
                  const isConnected = Boolean(connections[wire.id]);
                  const isActive = dragging?.wireId === wire.id;

                  return (
                    <g key={wire.id}>
                      <path
                        d={getWirePath(start, end)}
                        fill="none"
                        stroke={wire.color}
                        strokeWidth="7"
                        strokeLinecap="round"
                        opacity={isConnected || isActive ? 0.98 : 0.9}
                        filter={isActive ? 'url(#softGlow)' : undefined}
                      />
                      <circle
                        cx={start.x}
                        cy={start.y}
                        r="14"
                        fill="#1a2027"
                        stroke="rgba(255,255,255,0.22)"
                      />
                      <circle
                        cx={end.x}
                        cy={end.y}
                        r={isConnected ? 10 : 12}
                        fill="#1a2027"
                        stroke="rgba(255,255,255,0.22)"
                        className="cursor-pointer"
                        onPointerDown={(event) => {
                          event.preventDefault();
                          if (isConnected) {
                            disconnectWire(wire.id);
                          }
                          startDrag(wire.id);
                        }}
                      />
                      <text
                        x={start.x}
                        y={start.y + (isMobile ? 36 : -28)}
                        textAnchor="middle"
                        className="fill-[#f3f5f7] font-mono text-[11px] tracking-[0.18em]"
                      >
                        {wire.label}
                      </text>
                    </g>
                  );
                })}

                <text
                  x={isMobile ? 210 : 744}
                  y={isMobile ? 492 : 110}
                  textAnchor="middle"
                  className="fill-[#eef3f6] font-mono text-[13px] tracking-[0.28em]"
                >
                  JUMPER LEADS
                </text>
                <text x={isMobile ? 52 : 88} y={isMobile ? 82 : 96} className="fill-[#f0f0f0] font-mono text-[9px] tracking-[0.16em]" opacity="0.82">
                  MAX30102 BREAKOUT
                </text>
                <text x={isMobile ? 52 : 88} y={isMobile ? 96 : 112} className="fill-[#f0f0f0] font-mono text-[8px] tracking-[0.12em]" opacity="0.62">
                  REV 1.0
                </text>
                <text x={layout.led.x + 22} y={layout.led.y + 5} className="fill-[#f0f0f0] font-mono text-[9px] tracking-[0.14em]" opacity="0.82">
                  D1
                </text>

                {powered && (
                  <motion.text
                    x={isMobile ? 210 : 450}
                    y={isMobile ? 444 : 500}
                    textAnchor="middle"
                    className="fill-[#d8ffe7] font-mono text-[14px] tracking-[0.32em]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    SENSOR ACTIVE • SYSTEM READY
                  </motion.text>
                )}
              </svg>
            </motion.div>

            {powered && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                onClick={handleContinue}
                className="mt-6 px-6 py-3 border-2 border-[#3da88a] text-[#3da88a] font-mono uppercase tracking-wider hover:bg-[#3da88a]/10 transition-all duration-300"
              >
                Continue to Portfolio
              </motion.button>
            )}

            <motion.p
              className="mt-6 max-w-2xl text-center font-sans text-xs leading-6 text-[#9ab0bf] md:text-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14 }}
            >
              Match each lead to its labeled MAX30102 pad. Correct connections snap in place, incorrect ones release, and clicking a connected lead returns it to the harness.
            </motion.p>
          </div>
    </motion.section>
  );
};

export default PCBGate;
