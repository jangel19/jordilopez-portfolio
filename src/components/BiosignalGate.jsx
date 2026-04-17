import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  calculateRecoveryScore,
  createInitialBaselines,
  createInitialSignalState,
  stepSignals,
  updateAdaptiveBaselines,
} from '../utils/biosignalGenerator';

const BUFFER_LENGTH = 220;
const GATE_KEY = 'portfolioGateCompleted';

const formatSigned = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;

const setGateStorage = (value) => {
  try {
    if (value) {
      window.localStorage.setItem(GATE_KEY, 'true');
    } else {
      window.localStorage.removeItem(GATE_KEY);
    }
  } catch {
    // Ignore storage failures so the gate never blocks rendering.
  }
};

const drawWaveform = ({
  ctx,
  width,
  height,
  color,
  glowColor,
  values,
  writeIndex,
  range,
  strokeWidth,
}) => {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, 'rgba(26, 95, 61, 0.08)');
  gradient.addColorStop(0.35, color);
  gradient.addColorStop(1, 'rgba(240, 246, 252, 0.22)');

  const step = width / Math.max(values.length - 1, 1);
  const [min, max] = range;
  const normalize = (value) => {
    const ratio = (value - min) / (max - min);
    return height - ratio * height;
  };

  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = gradient;
  ctx.lineWidth = strokeWidth;
  ctx.shadowBlur = 16;
  ctx.shadowColor = glowColor;
  ctx.beginPath();

  for (let i = 0; i < values.length; i += 1) {
    const index = (writeIndex + i) % values.length;
    const x = i * step;
    const y = normalize(values[index]);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.restore();
};

const WaveformCanvas = ({ label, unit, range, color, values, writeIndex, heightClass }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const resizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      const bounds = canvas.getBoundingClientRect();
      canvas.width = Math.floor(bounds.width * ratio);
      canvas.height = Math.floor(bounds.height * ratio);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) {
      return;
    }

    drawWaveform({
      ctx,
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      color,
      glowColor: 'rgba(26, 95, 61, 0.55)',
      values,
      writeIndex,
      range,
      strokeWidth: 2.1,
    });
  }, [color, range, values, writeIndex]);

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-5">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.3em] text-slate-400">Live Signal</p>
          <h3 className="text-sm font-semibold text-slate-100 md:text-base">{label}</h3>
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{unit}</p>
      </div>
      <div className={`relative overflow-hidden rounded-2xl border border-white/6 bg-[#06131d]/90 ${heightClass}`}>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_24px,28px_100%]" />
        <canvas ref={canvasRef} className="relative z-10 h-full w-full" />
      </div>
      <div className="mt-3 flex justify-between text-xs text-slate-500">
        <span>{range[0]} {unit}</span>
        <span>{range[1]} {unit}</span>
      </div>
    </div>
  );
};

const BiosignalGate = ({ onComplete }) => {
  const [waveforms, setWaveforms] = useState(() => ({
    hrv: new Array(BUFFER_LENGTH).fill(58),
    rhr: new Array(BUFFER_LENGTH).fill(60),
    writeIndex: 0,
  }));
  const [metrics, setMetrics] = useState(() => {
    const baselines = createInitialBaselines();
    const initialSignals = { hrv: 58, rhr: 60 };
    const normalized = calculateRecoveryScore(initialSignals, baselines);

    return {
      current: initialSignals,
      baselines,
      normalized,
      displayedScore: normalized.score,
      targetScore: normalized.score,
      calculating: true,
    };
  });
  const [showPrompt, setShowPrompt] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const signalStateRef = useRef(createInitialSignalState());
  const baselinesRef = useRef(createInitialBaselines());
  const scoreTimeoutRef = useRef(null);
  const promptTimeoutRef = useRef(null);

  const completeGate = useCallback(() => {
    if (isExiting) {
      return;
    }

    setIsExiting(true);
    setGateStorage(true);
  }, [isExiting]);

  useEffect(() => {
    let frameId;
    let lastFrame = performance.now();
    let accumulated = 0;

    const animate = (now) => {
      const deltaSeconds = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      accumulated += deltaSeconds;

      const nextSignals = stepSignals(signalStateRef.current, deltaSeconds);
      baselinesRef.current = updateAdaptiveBaselines(baselinesRef.current, nextSignals, deltaSeconds);

      setMetrics((previous) => ({
        ...previous,
        current: {
          hrv: Number(nextSignals.hrv.toFixed(1)),
          rhr: Number(nextSignals.rhr.toFixed(1)),
        },
        baselines: {
          hrv: {
            mean: Number(baselinesRef.current.hrv.mean.toFixed(1)),
            stdDev: Number(baselinesRef.current.hrv.stdDev.toFixed(1)),
          },
          rhr: {
            mean: Number(baselinesRef.current.rhr.mean.toFixed(1)),
            stdDev: Number(baselinesRef.current.rhr.stdDev.toFixed(1)),
          },
        },
      }));

      if (accumulated >= 1 / 30) {
        accumulated = 0;

        setWaveforms((previous) => {
          const nextIndex = (previous.writeIndex + 1) % BUFFER_LENGTH;
          const nextHrv = previous.hrv.slice();
          const nextRhr = previous.rhr.slice();

          nextHrv[nextIndex] = nextSignals.hrv;
          nextRhr[nextIndex] = nextSignals.rhr;

          return {
            hrv: nextHrv,
            rhr: nextRhr,
            writeIndex: nextIndex,
          };
        });
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    promptTimeoutRef.current = window.setTimeout(() => setShowPrompt(true), 5000);

    return () => {
      if (promptTimeoutRef.current) {
        window.clearTimeout(promptTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const updateScore = () => {
      setMetrics((previous) => {
        const normalized = calculateRecoveryScore(previous.current, baselinesRef.current);

        return {
          ...previous,
          normalized: {
            score: normalized.score,
            hrvNorm: Number(normalized.hrvNorm.toFixed(2)),
            rhrNorm: Number(normalized.rhrNorm.toFixed(2)),
          },
          targetScore: normalized.score,
          calculating: true,
        };
      });

      scoreTimeoutRef.current = window.setTimeout(() => {
        setMetrics((previous) => ({
          ...previous,
          displayedScore: previous.targetScore,
          calculating: false,
        }));
      }, 420);
    };

    updateScore();
    const intervalId = window.setInterval(updateScore, 2000);

    return () => {
      window.clearInterval(intervalId);
      if (scoreTimeoutRef.current) {
        window.clearTimeout(scoreTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => setGateStorage(false);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isExiting && (
        <motion.section
          key="biosignal-gate"
          className="relative min-h-screen cursor-pointer overflow-hidden bg-[radial-gradient(circle_at_top,rgba(47,95,171,0.18),transparent_36%),linear-gradient(160deg,#01070d_0%,#07121d_42%,#0b1830_100%)] px-4 py-6 text-slate-100 md:px-8 md:py-8"
          initial={{ opacity: 0, scale: 1.01 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onClick={completeGate}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              completeGate();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Enter portfolio"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="absolute left-[8%] top-[16%] h-64 w-64 rounded-full bg-[#1a5f3d]/10 blur-3xl" />
            <div className="absolute right-[10%] top-[12%] h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:72px_72px]" />
          </div>

          <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col justify-between">
            <header className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="mb-4 text-[0.7rem] uppercase tracking-[0.38em] text-emerald-300/70">
                  Recovery Diagnostics Interface
                </p>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                  Real-time recovery scoring from live biosignal behavior.
                </h1>
              </div>
              <div className="grid max-w-md grid-cols-2 gap-4 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.25em] text-slate-500">HRV</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{metrics.current.hrv.toFixed(1)} ms</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.25em] text-slate-500">RHR</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{metrics.current.rhr.toFixed(1)} bpm</p>
                </div>
              </div>
            </header>

            <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[1.2fr_0.9fr] lg:items-stretch">
              <div className="grid gap-4 self-center">
                <WaveformCanvas
                  label="Heart Rate Variability"
                  unit="ms"
                  range={[30, 80]}
                  color="rgba(26, 95, 61, 0.95)"
                  values={waveforms.hrv}
                  writeIndex={waveforms.writeIndex}
                  heightClass="h-40 md:h-48"
                />
                <WaveformCanvas
                  label="Resting Heart Rate"
                  unit="bpm"
                  range={[55, 65]}
                  color="rgba(240, 246, 252, 0.9)"
                  values={waveforms.rhr}
                  writeIndex={waveforms.writeIndex}
                  heightClass="h-32 md:h-40"
                />
              </div>

              <div className="flex flex-col justify-between gap-4 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur md:p-6">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.3em] text-slate-400">Recovery Score</p>
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <div className="relative inline-flex items-end gap-3">
                        <motion.span
                          key={metrics.displayedScore}
                          className="text-7xl font-semibold tracking-tight text-white md:text-8xl"
                          initial={{ opacity: 0.45, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45 }}
                        >
                          {metrics.displayedScore}
                        </motion.span>
                        <span className="mb-3 text-sm uppercase tracking-[0.3em] text-emerald-300/80">/100</span>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={metrics.calculating ? 'calculating' : 'ready'}
                          className="mt-3 text-sm text-slate-400"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                        >
                          {metrics.calculating ? 'Calculating...' : 'Adaptive baseline updated'}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 px-4 py-3 text-right">
                      <p className="text-[0.68rem] uppercase tracking-[0.25em] text-emerald-200/70">28 Day Model</p>
                      <p className="mt-2 text-lg font-medium text-emerald-100">Baseline active</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-[#08131b] p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.25em] text-slate-500">HRV Baseline</p>
                    <p className="mt-2 text-xl font-semibold text-white">{metrics.baselines.hrv.mean.toFixed(1)} ms</p>
                    <p className="mt-1 text-sm text-slate-400">std dev {metrics.baselines.hrv.stdDev.toFixed(1)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-[#08131b] p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.25em] text-slate-500">RHR Baseline</p>
                    <p className="mt-2 text-xl font-semibold text-white">{metrics.baselines.rhr.mean.toFixed(1)} bpm</p>
                    <p className="mt-1 text-sm text-slate-400">std dev {metrics.baselines.rhr.stdDev.toFixed(1)}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-[#06111a]/95 p-4 md:p-5">
                  <p className="mb-3 text-[0.68rem] uppercase tracking-[0.25em] text-slate-500">Scoring Logic</p>
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[0.78rem] leading-6 text-slate-300">
{`Z-score normalization:
HRV_norm = (current_HRV - baseline_HRV) / std_dev
RHR_norm = (baseline_RHR - current_RHR) / std_dev
Recovery = clamp((HRV_norm + RHR_norm) * 25 + 50, 0, 100)`}
                  </pre>
                  <div className="mt-4 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                    <p>HRV norm: <span className="font-medium text-slate-200">{formatSigned(metrics.normalized.hrvNorm)}</span></p>
                    <p>RHR norm: <span className="font-medium text-slate-200">{formatSigned(metrics.normalized.rhrNorm)}</span></p>
                  </div>
                </div>
              </div>
            </div>

            <footer className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-5 text-sm text-slate-400 md:flex-row md:items-center">
              <p className="max-w-2xl">
                Synthetic recovery telemetry with adaptive baselines, clinical visual hierarchy, and physiological signal drift modeled for wearable UX presentation.
              </p>
              <AnimatePresence>
                {showPrompt && (
                  <motion.p
                    className="text-sm uppercase tracking-[0.35em] text-emerald-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
                  >
                    Click anywhere to enter portfolio
                  </motion.p>
                )}
              </AnimatePresence>
            </footer>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default BiosignalGate;
