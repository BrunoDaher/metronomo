import { useState, useEffect, useRef, useCallback } from 'react';

export interface FiguraOption {
  value: number;
  name: string;
  symbol: string;
  description: string;
}

export const FIGURAS: FiguraOption[] = [
  { value: 1, name: 'Semínima', symbol: '♩', description: '1 por tempo' },
  { value: 2, name: 'Colcheia', symbol: '♫', description: '2 por tempo' },
  { value: 3, name: 'Tercina', symbol: '³♫', description: '3 por tempo' },
  { value: 4, name: 'Semicolcheia', symbol: '♬', description: '4 por tempo' },
  { value: 6, name: 'Sextina', symbol: '⁶♬', description: '6 por tempo' }
];

export interface TimeSignatureOption {
  metric: string;
  pulsos: number;
  label: string;
}

export const TIME_SIGNATURES: TimeSignatureOption[] = [
  { metric: '2/4', pulsos: 2, label: 'Binário' },
  { metric: '3/4', pulsos: 3, label: 'Ternário' },
  { metric: '4/4', pulsos: 4, label: 'Quaternário' },
  { metric: '5/4', pulsos: 5, label: 'Quinário' },
  { metric: '6/8', pulsos: 6, label: 'Composto' },
  { metric: '7/8', pulsos: 7, label: 'Setenário' },
  { metric: '12/8', pulsos: 12, label: 'Quat. Composto' }
];

export function getTempoName(bpm: number): string {
  if (bpm < 45) return 'Grave';
  if (bpm < 60) return 'Largo';
  if (bpm < 66) return 'Larghetto';
  if (bpm < 76) return 'Adagio';
  if (bpm < 108) return 'Andante';
  if (bpm < 120) return 'Moderato';
  if (bpm < 168) return 'Allegro';
  if (bpm < 200) return 'Presto';
  return 'Prestissimo';
}

// Global lightweight Web Audio Context
let globalAudioCtx: AudioContext | null = null;
export function getMetronomeAudioContext(): AudioContext {
  if (!globalAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    globalAudioCtx = new AudioContextClass();
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
}

export function useMetronome() {
  const [bpm, setBpm] = useState<number>(120);
  const [pulsos, setPulsosState] = useState<number>(4);
  const [metric, setMetricState] = useState<string>('4/4');
  const [figuraCount, setFiguraCount] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentPulse, setCurrentPulse] = useState<number>(1);
  const [activeSubdivision, setActiveSubdivision] = useState<{ pulse: number; sub: number } | null>(null);
  const [bellEnabled, setBellEnabled] = useState<boolean>(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseIndexRef = useRef<number>(1);
  const tapTimesRef = useRef<number[]>([]);

  const setMetric = useCallback((m: string) => {
    setMetricState(m);
    const found = TIME_SIGNATURES.find((ts) => ts.metric === m);
    if (found) {
      setPulsosState(found.pulsos);
    }
  }, []);

  const setPulsos = useCallback((p: number) => {
    setPulsosState(p);
    const found = TIME_SIGNATURES.find((ts) => ts.pulsos === p);
    if (found) {
      setMetricState(found.metric);
    }
  }, []);

  // Standard Acoustic Woodblock Click (Padrão Madeira & Finish, sem beep)
  const playClick = useCallback(
    (isDownbeat: boolean) => {
      try {
        const ctx = getMetronomeAudioContext();
        const now = ctx.currentTime;

        // Acoustic Woodblock / Mechanical Metronome Click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'bandpass';
        filter.frequency.value = isDownbeat ? 1900 : 1300;
        filter.Q.value = 5.5;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(isDownbeat ? 1450 : 950, now);
        osc.frequency.exponentialRampToValueAtTime(isDownbeat ? 480 : 340, now + 0.035);

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);

        // Downbeat bell chime (enabled only if bell toggle is on)
        if (isDownbeat && bellEnabled) {
          const bellOsc = ctx.createOscillator();
          const bellGain = ctx.createGain();

          bellOsc.type = 'sine';
          bellOsc.frequency.value = 2400;

          bellGain.gain.setValueAtTime(0.2, now);
          bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

          bellOsc.connect(bellGain);
          bellGain.connect(ctx.destination);

          bellOsc.start(now);
          bellOsc.stop(now + 0.15);
        }
      } catch {
        // Audio might be blocked until user interaction
      }
    },
    [bellEnabled]
  );

  const tick = useCallback(() => {
    const pulse = pulseIndexRef.current;
    setCurrentPulse(pulse);

    // Play metronome audio click on beat
    playClick(pulse === 1);

    const beatInterval = (60 / bpm) * 1000;
    const subInterval = beatInterval / figuraCount;

    for (let sub = 0; sub < figuraCount; sub++) {
      setTimeout(() => {
        setActiveSubdivision({ pulse, sub });
        setTimeout(() => {
          setActiveSubdivision((prev) => (prev?.pulse === pulse && prev?.sub === sub ? null : prev));
        }, subInterval * 0.8);
      }, sub * subInterval);
    }

    pulseIndexRef.current = pulse < pulsos ? pulse + 1 : 1;
  }, [bpm, pulsos, figuraCount, playClick]);

  useEffect(() => {
    if (isRunning) {
      pulseIndexRef.current = 1;
      tick();
      const interval = (60 / bpm) * 1000;
      timerRef.current = setInterval(tick, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setCurrentPulse(1);
      setActiveSubdivision(null);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, bpm, tick]);

  const toggleMetronome = () => setIsRunning((prev) => !prev);

  // Tap Tempo calculation
  const tapTempo = useCallback(() => {
    const now = performance.now();
    const taps = tapTimesRef.current.filter((t) => now - t < 2500);
    taps.push(now);
    tapTimesRef.current = taps;

    if (taps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((acc, val) => acc + val, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      const clamped = Math.max(30, Math.min(260, calculatedBpm));
      setBpm(clamped);
    }
  }, []);

  return {
    bpm,
    setBpm,
    pulsos,
    setPulsos,
    metric,
    setMetric,
    timeSignatures: TIME_SIGNATURES,
    figuraCount,
    setFiguraCount,
    isRunning,
    toggleMetronome,
    currentPulse,
    activeSubdivision,
    figuras: FIGURAS,
    bellEnabled,
    setBellEnabled,
    tapTempo,
    tempoName: getTempoName(bpm)
  };
}
