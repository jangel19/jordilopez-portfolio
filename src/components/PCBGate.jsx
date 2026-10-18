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

// Timing budget (ms). Worst case is DEADLINE + stagger for 4 wires + FINISH_DELAY < 10s.
const IDLE_AUTOCONNECT_MS = 3500;
const DEADLINE_MS = 6500;
const AUTOCONNECT_STAGGER_MS = 350;
const FINISH_DELAY_MS = 1400;

const getPadLabel = (key) => (key === 'VCC' ? 'VCC / 3.3V' : key);

const PCBGate = ({ onComplete }) => {
  const [connections, setConnections] = useState({});
  const [dragging, setDragging] = useState(null);
  const [leadFocused, setLeadFocused] = useState(false);
  const draggingRef = useRef(false);
  const leadFocusedRef = useRef(false);
  const [feedbackPad, setFeedbackPad] = useState(null);
  const [feedbackTone, setFeedbackTone] = useState(null);
  const [powered, setPowered] = useState(false);
  const feedbackTimeoutRef = useRef(null);
  const audioContextRef = useRef(null);
  const completedRef = useRef(false);
  const autoTimeoutsRef = useRef([]);
  const autoConnectingRef = useRef(false);
  const poweredRef = useRef(false);
  const connectionsRef = useRef({});

  connectionsRef.current = connections;
  poweredRef.current = powered;

  const layout = DESKTOP_LAYOUT;
  const connectedCount = Object.keys(connections).length;

  const wireEndpoints = useMemo(() => {
    return WIRES.reduce((accumulator, wire) => {
      if (dragging?.wireId === wire.id) {
        accumulator[wire.id] = dragging.point;
      } else if (connections[wire.id]) {
        accumulator[wire.id] = layout.pads[connections[wire.id]];
      } else {
        accumulator[wire.id] = { x: layout.homes[wire.id].x - 48, y: layout.homes[wire.id].y + 24 };
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

      const matrix = svg.getScreenCTM();
      if (!matrix) return;
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());

      setDragging((previous) => previous ? { ...previous, point } : previous);

      const nearest = getNearestPad(point, layout.pads, 42);
      setFeedbackPad(nearest);
      setFeedbackTone(nearest ? 'hover' : null);
    };

    const handlePointerUp = () => {
      const nearest = getNearestPad(dragging.point, layout.pads, 42);
      const wire = WIRES.find((item) => item.id === dragging.wireId);
      clearFeedback();
      draggingRef.current = false;
      setDragging(null);
      if (!nearest || !wire) return;

      const padTaken = Object.entries(connections).some(
        ([wireId, pad]) => wireId !== wire.id && pad === nearest
      );
      const correct = !padTaken && wire.target === nearest;
      if (correct) setConnections((current) => ({ ...current, [wire.id]: nearest }));
      setFeedbackPad(nearest);
      setFeedbackTone(correct ? 'correct' : 'wrong');
      playSnapTone(correct ? 560 : 210);
      feedbackTimeoutRef.current = window.setTimeout(() => {
        setFeedbackPad(null);
        setFeedbackTone(null);
      }, 320);
    };

    window.addEventListener('pointermove', handlePointerMove);
    const cancelDrag = () => { draggingRef.current = false; setDragging(null); clearFeedback(); };
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', cancelDrag);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', cancelDrag);
    };
  }, [clearFeedback, connections, dragging, layout, playSnapTone]);

  useEffect(() => {
    const autoTimeouts = autoTimeoutsRef;
    return () => {
      autoTimeouts.current.forEach((id) => window.clearTimeout(id));
      autoTimeouts.current = [];
      autoConnectingRef.current = false;
      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, []);

  const pauseAutoConnect = () => {
    autoTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    autoTimeoutsRef.current = [];
    autoConnectingRef.current = false;
  };

  const startDrag = (wireId) => {
    pauseAutoConnect();
    draggingRef.current = true;
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

  const handleContinue = useCallback(() => {
    if (completedRef.current) {
      return;
    }
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  // A final completion deadline also covers continued dragging or disconnections.
  useEffect(() => {
    const deadline = window.setTimeout(handleContinue, 9000);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const checkEligibility = () => {
      if (window.innerWidth < 768 || media.matches) handleContinue();
    };
    window.addEventListener('resize', checkEligibility);
    media.addEventListener('change', checkEligibility);
    return () => {
      window.clearTimeout(deadline);
      window.removeEventListener('resize', checkEligibility);
      media.removeEventListener('change', checkEligibility);
    };
  }, [handleContinue]);

  // Connect whatever is still loose, one wire at a time, so the visitor sees it happen.
  const autoConnect = useCallback(() => {
    if (autoConnectingRef.current || poweredRef.current || draggingRef.current || leadFocusedRef.current) {
      return;
    }
    autoConnectingRef.current = true;

    WIRES.filter((wire) => !connectionsRef.current[wire.id]).forEach((wire, index) => {
      autoTimeoutsRef.current.push(
        window.setTimeout(() => {
          if (draggingRef.current || leadFocusedRef.current) return;
          playSnapTone(560);
          setConnections((current) => ({ ...current, [wire.id]: wire.target }));
        }, index * AUTOCONNECT_STAGGER_MS)
      );
    });
  }, [playSnapTone]);

  // Timed assistance respects active pointer and keyboard interaction.
  useEffect(() => {
    const deadline = window.setTimeout(autoConnect, DEADLINE_MS);
    return () => window.clearTimeout(deadline);
  }, [autoConnect]);

  useEffect(() => {
    if (powered || dragging || leadFocused) {
      return undefined;
    }
    const idle = window.setTimeout(autoConnect, IDLE_AUTOCONNECT_MS);
    return () => window.clearTimeout(idle);
  }, [autoConnect, powered, connections, dragging, leadFocused]);

  // Once the sensor is live, move on without needing a click.
  useEffect(() => {
    if (!powered) {
      return undefined;
    }
    const finish = window.setTimeout(handleContinue, FINISH_DELAY_MS);
    return () => window.clearTimeout(finish);
  }, [powered, handleContinue]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleContinue]);

  return (
    <motion.section
      key="pcb-gate"
      aria-label="Interactive sensor intro"
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(74,158,255,0.08),transparent_34%),linear-gradient(180deg,#071326_0%,#05131f_100%)] px-4 py-6"
      initial={false}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col items-center justify-center">
            <motion.div
              className="mb-6 flex w-full max-w-[760px] justify-end"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <button
                type="button"
                autoFocus
                onClick={handleContinue}
                className="rounded-md border-2 border-[#e8eaf0] bg-[rgba(232,234,240,0.12)] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#ffffff] transition-colors duration-300 hover:bg-[#e8eaf0] hover:text-[#0a0e27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a9eff]"
              >
                Skip intro (Esc)
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
                Wire up the sensor. See what I build.
              </h1>
            </motion.div>

            <motion.div
              className="w-full max-w-[760px] rounded-[1.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-4"
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
                  <linearGradient id="boardSheen" x1="0" y1="0" x2="0.8" y2="1">
                    <stop offset="0" stopColor="#e2ffe9" stopOpacity="0.16" />
                    <stop offset="0.36" stopColor="#e2ffe9" stopOpacity="0.025" />
                    <stop offset="1" stopColor="#000" stopOpacity="0.22" />
                  </linearGradient>
                  <linearGradient id="packageBevel" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#54585b" />
                    <stop offset="0.12" stopColor="#25292c" />
                    <stop offset="1" stopColor="#0b0e11" />
                  </linearGradient>
                  <linearGradient id="boardGradient" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#174e3d" />
                    <stop offset="52%" stopColor="#103c2e" />
                    <stop offset="100%" stopColor="#082b24" />
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
                  <pattern id="groundPour" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M-5 5 L5 -5 M0 10 L10 0 M5 15 L15 5" stroke="#8fc99c" strokeOpacity="0.14" strokeWidth="0.6" />
                  </pattern>
                  <clipPath id="boardClip">
                    <rect x="30" y="30" width={644} height={layout.height - 60} rx="14" />
                  </clipPath>
                </defs>

                <rect
                  x="24"
                  y="24"
                  width={656}
                  height={layout.height - 48}
                  rx="18"
                  fill="url(#boardEdgeGradient)"
                  filter="url(#boardShadow)"
                />
                <rect
                  x="30"
                  y="30"
                  width={644}
                  height={layout.height - 60}
                  rx="14"
                  fill="url(#boardGradient)"
                  stroke="rgba(255,255,255,0.08)"
                />
                <rect
                  x="30"
                  y="30"
                  width={644}
                  height={layout.height - 60}
                  rx="14"
                  fill="url(#solderMaskNoise)"
                  opacity="0.65"
                />
                <rect
                  x="30"
                  y="30"
                  width={644}
                  height={layout.height - 60}
                  rx="14"
                  fill="url(#fiberglassWeave)"
                  opacity="0.35"
                />
                <rect
                  x="30"
                  y="30"
                  width={644}
                  height={layout.height - 60}
                  rx="14"
                  fill="url(#groundPour)"
                  opacity="0.22"
                />

                <rect x="30" y="30" width="644" height="540" rx="14" fill="url(#boardSheen)" />
                <g clipPath="url(#boardClip)" fill="none" strokeLinejoin="round">
                  {Object.entries({
                    VCC: 'M452 164 H424 L364 224 V240.5 H393',
                    SDA: 'M294 282 H330 L341.5 270.5 H393',
                    SCL: 'M610 282 H574 L555.5 300.5 H511',
                    GND: 'M452 420 H520 L555 385 V315.5 H511',
                  }).map(([pad, path]) => (
                    <g key={pad}>
                      <path d={path} stroke="#082c21" strokeWidth="13" />
                      <path d={path} stroke="#468c65" strokeWidth="6" />
                      <path d={path} stroke="#a7c884" strokeOpacity="0.35" strokeWidth="1.4" />
                      {Object.values(connections).includes(pad) && (
                        <motion.path d={path} stroke="#b8ffe1" strokeWidth="5"
                          initial={{ pathLength: 0, opacity: 1 }} animate={{ pathLength: 1, opacity: 0 }}
                          transition={{ duration: 0.65 }} />
                      )}
                    </g>
                  ))}
                  <path d="M364 224 V186 L342 164 H326 M555 385 H592 L612 405 V446" stroke="#468c65" strokeWidth="4" />
                </g>
                {[{x:326,y:164},{x:612,y:446}].map(({x,y}) => (
                  <g key={x}><circle cx={x} cy={y} r="5" fill="url(#viaGradient)" /><circle cx={x} cy={y} r="2.3" fill="#041c17" /></g>
                ))}
                {[{x:342,y:194,ref:'C1',body:'#b4a17b'}, {x:538,y:353,ref:'R1',body:'#252a30'}, {x:308,y:348,ref:'R2',body:'#252a30'}].map(({x,y,ref,body}) => (
                  <g key={ref} filter="url(#chipShadow)">
                    <rect x={x-19} y={y-9} width="38" height="18" rx="3" fill="#bec4bb" />
                    <rect x={x-11} y={y-9} width="22" height="18" rx="2" fill={body} />
                    <path d={`M${x-10} ${y-6} h20`} stroke="#fff" strokeOpacity="0.25" />
                    <text x={x} y={y+28} textAnchor="middle" fill="#eef3f6" fontSize="10" fontFamily="monospace">{ref}</text>
                  </g>
                ))}

                <g opacity="0.9">
                  {[
                    { x: 66, y: 66 },
                    { x: 638, y: 66 },
                    { x: 66, y: layout.height - 66 },
                    { x: 638, y: layout.height - 66 },
                  ].map((hole, index) => (
                    <g key={`mount-${index}`}>
                      <circle cx={hole.x} cy={hole.y} r="11" fill="url(#padGradient)" />
                      <circle cx={hole.x} cy={hole.y} r="5.5" fill="#05131f" stroke="#584b2a" strokeWidth="1.5" />
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
                    fill="url(#packageBevel)"
                    stroke="rgba(255,255,255,0.1)"
                    filter="url(#chipShadow)"
                  />
                  {Array.from({ length: 6 }).map((_, index) => {
                    const pinOffset = index * 15;
                    return (
                      <g key={`pins-${index}`}>
                        <rect
                          x={layout.chip.x - layout.chip.w / 2 - 7}
                          y={layout.chip.y - 46 + pinOffset}
                          width="7"
                          height={9}
                          rx="1.4"
                          fill="url(#padGradient)"
                        />
                        <rect
                          x={layout.chip.x + layout.chip.w / 2}
                          y={layout.chip.y - 46 + pinOffset}
                          width="7"
                          height={9}
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
                    y={layout.chip.y - 37}
                    textAnchor="middle"
                    className="fill-[#f0f0f0] font-mono text-[12px] tracking-[0.06em]"
                  >
                    MAX30102
                  </text>
                  <text
                    x={layout.chip.x}
                    y={layout.chip.y + 22}
                    textAnchor="middle"
                    className="fill-[#a9b1b9] font-mono text-[9px] tracking-[0.04em]"
                  >
                    HR / SpO2
                  </text>
                </g>

                <circle cx="409" cy="239" r="3" fill="#e3e6dd" />
                <rect x="421" y="250" width="62" height="24" rx="4" fill="#080d10" stroke="#545d60" />
                <rect x="426" y="254" width="19" height="16" rx="3" fill={powered ? '#ac1930' : '#451a26'} />
                <rect x="451" y="254" width="26" height="16" rx="3" fill="#132631" />
                <text x="581" y="246" fill="#eef3f6" fontSize="10">+</text>
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
                        y={key === 'VCC' ? pad.y - 26 : pad.y + 38}
                        dx={0}
                        textAnchor="middle"
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
                    <motion.g key={wire.id} initial={{ x: 35, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 + WIRES.indexOf(wire) * 0.07, duration: 0.4 }}>
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
                        role="button"
                        tabIndex={0}
                        aria-label={`${isConnected ? 'Disconnect' : 'Connect'} ${wire.label} lead ${isConnected ? 'from' : 'to'} ${getPadLabel(wire.target)}`}
                        aria-pressed={isConnected}
                        onFocus={() => {
                          leadFocusedRef.current = true;
                          setLeadFocused(true);
                          pauseAutoConnect();
                        }}
                        onBlur={() => {
                          leadFocusedRef.current = false;
                          setLeadFocused(false);
                        }}
                        onKeyDown={(event) => {
                          pauseAutoConnect();
                          if (event.key !== 'Enter' && event.key !== ' ') return;
                          event.preventDefault();
                          if (isConnected) disconnectWire(wire.id);
                          else {
                            setConnections((current) => ({ ...current, [wire.id]: wire.target }));
                            playSnapTone(560);
                          }
                        }}
                        onPointerDown={(event) => {
                          event.preventDefault();
                          pauseAutoConnect();
                          if (isConnected) {
                            disconnectWire(wire.id);
                            return;
                          }
                          startDrag(wire.id);
                        }}
                      />
                      <text
                        x={start.x}
                        y={start.y - 28}
                        textAnchor="middle"
                        className="fill-[#f3f5f7] font-mono text-[11px] tracking-[0.18em]"
                      >
                        {wire.label}
                      </text>
                    </motion.g>
                  );
                })}

                <text
                  x={744}
                  y={110}
                  textAnchor="middle"
                  className="fill-[#eef3f6] font-mono text-[13px] tracking-[0.28em]"
                >
                  JUMPER LEADS
                </text>
                <text x={88} y={96} className="fill-[#f0f0f0] font-mono text-[9px] tracking-[0.16em]" opacity="0.82">
                  MAX30102 BREAKOUT
                </text>
                <text x={88} y={112} className="fill-[#f0f0f0] font-mono text-[8px] tracking-[0.12em]" opacity="0.62">
                  REV 1.0
                </text>
                <text x={layout.led.x + 22} y={layout.led.y + 5} className="fill-[#f0f0f0] font-mono text-[9px] tracking-[0.14em]" opacity="0.82">
                  D1
                </text>

                {powered && <motion.path d="M155 476 H190 L198 471 L206 476 H220 L231 469 L240 445 L250 428 L260 455 L270 470 L285 476 H320 L328 471 L336 476 H350 L361 469 L370 445 L380 428 L390 455 L400 470 L415 476 H450"
                  fill="none" stroke="#aaffda" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1 }} />}
                {powered && (
                  <motion.text
                    x={350}
                    y={516}
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

            <p role="status" aria-live="polite" className="sr-only">{powered ? 'Sensor ready. Opening portfolio.' : `${connectedCount} of 4 leads connected. Skip intro at any time.`}</p>
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
              className="mt-6 max-w-2xl text-center font-sans text-xs leading-6 text-[#b4c6d3] md:text-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14 }}
            >
              Drag each lead to its labeled MAX30102 pad, or focus a lead and press Enter or Space to connect it. Correct connections snap in place and incorrect ones release. Or sit back: the leads connect themselves in a few seconds.
            </motion.p>
          </div>
    </motion.section>
  );
};

export default PCBGate;
