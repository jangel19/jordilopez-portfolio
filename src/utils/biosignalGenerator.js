const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const jitter = (amplitude) => (Math.random() - 0.5) * amplitude * 2;

export const INITIAL_BASELINES = {
  hrv: {
    mean: 57,
    stdDev: 7.4,
  },
  rhr: {
    mean: 60,
    stdDev: 3.2,
  },
};

export const createInitialSignalState = () => ({
  time: 0,
  hrv: {
    value: 58,
    target: 58,
    sampleHold: 0,
    respiratoryPhase: Math.random() * Math.PI * 2,
  },
  rhr: {
    value: 60,
    target: 60,
  },
});

export const createInitialBaselines = () => ({
  hrv: { ...INITIAL_BASELINES.hrv },
  rhr: { ...INITIAL_BASELINES.rhr },
});

/**
 * Calculate a recovery score from normalized HRV and RHR values.
 *
 * HRV is beneficial when elevated relative to baseline, while RHR is beneficial
 * when depressed relative to baseline. Each signal is converted to a Z-score,
 * averaged in score space, and then clamped to a wearable-friendly 0-100 range.
 *
 * @param {{ hrv: number, rhr: number }} currentSignals Current HRV (ms) and RHR (BPM)
 * @param {{ hrv: { mean: number, stdDev: number }, rhr: { mean: number, stdDev: number } }} baselines Adaptive baselines and spread
 * @returns {{ score: number, hrvNorm: number, rhrNorm: number }} Recovery score and normalized signal contributions
 */
export const calculateRecoveryScore = (currentSignals, baselines) => {
  const hrvNorm =
    (currentSignals.hrv - baselines.hrv.mean) / Math.max(baselines.hrv.stdDev, 1);
  const rhrNorm =
    (baselines.rhr.mean - currentSignals.rhr) / Math.max(baselines.rhr.stdDev, 1);

  return {
    score: Math.round(clamp((hrvNorm + rhrNorm) * 25 + 50, 0, 100)),
    hrvNorm,
    rhrNorm,
  };
};

export const updateAdaptiveBaselines = (baselines, currentSignals, deltaSeconds) => {
  const smoothing = 1 - Math.exp(-deltaSeconds / 45);
  const spreadSmoothing = 1 - Math.exp(-deltaSeconds / 65);

  baselines.hrv.mean += (currentSignals.hrv - baselines.hrv.mean) * smoothing * 0.42;
  baselines.rhr.mean += (currentSignals.rhr - baselines.rhr.mean) * smoothing * 0.36;

  const hrvDeviation = Math.abs(currentSignals.hrv - baselines.hrv.mean);
  const rhrDeviation = Math.abs(currentSignals.rhr - baselines.rhr.mean);

  baselines.hrv.stdDev += (Math.max(4.5, hrvDeviation * 0.9) - baselines.hrv.stdDev) * spreadSmoothing;
  baselines.rhr.stdDev += (Math.max(1.6, rhrDeviation * 0.85) - baselines.rhr.stdDev) * spreadSmoothing;

  baselines.hrv.mean = clamp(baselines.hrv.mean, 48, 64);
  baselines.hrv.stdDev = clamp(baselines.hrv.stdDev, 4.5, 9.5);
  baselines.rhr.mean = clamp(baselines.rhr.mean, 56, 63);
  baselines.rhr.stdDev = clamp(baselines.rhr.stdDev, 1.6, 4.8);

  return baselines;
};

export const stepSignals = (signalState, deltaSeconds) => {
  signalState.time += deltaSeconds;
  signalState.hrv.sampleHold += deltaSeconds;
  signalState.hrv.respiratoryPhase += deltaSeconds * 0.85;

  if (signalState.hrv.sampleHold >= 0.25) {
    signalState.hrv.sampleHold = 0;
    const respiratoryInfluence = Math.sin(signalState.hrv.respiratoryPhase) * 7;
    const lowFrequencyDrift = Math.sin(signalState.time * 0.19) * 5;
    const recoveryWindowDrift = Math.sin(signalState.time * 0.045 + 1.1) * 3;

    signalState.hrv.target = clamp(
      56 + respiratoryInfluence + lowFrequencyDrift + recoveryWindowDrift + jitter(8),
      30,
      80
    );
  }

  const hrvResponsiveness = 1 - Math.exp(-deltaSeconds * 9);
  signalState.hrv.value += (signalState.hrv.target - signalState.hrv.value) * hrvResponsiveness;

  const circadianOscillation = Math.sin(signalState.time * Math.PI * 2 * 0.13) * 2.8;
  const autonomicDrift = Math.sin(signalState.time * Math.PI * 2 * 0.043 + 0.6) * 1.5;
  const rhrMicroAdjust = Math.sin(signalState.time * Math.PI * 2 * 0.27 + 1.7) * 0.4;

  signalState.rhr.target = clamp(60 + circadianOscillation + autonomicDrift + rhrMicroAdjust, 55, 65);

  const rhrResponsiveness = 1 - Math.exp(-deltaSeconds * 2.8);
  signalState.rhr.value += (signalState.rhr.target - signalState.rhr.value) * rhrResponsiveness;

  return {
    hrv: signalState.hrv.value,
    rhr: signalState.rhr.value,
    time: signalState.time,
  };
};
