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
let silentAudioElement: HTMLAudioElement | null = null;

export function getMetronomeAudioContext(): AudioContext {
  if (!globalAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    globalAudioCtx = new AudioContextClass();
  }
  return globalAudioCtx;
}

/**
 * Mobile-First Audio Unlocker:
 * 1. Resumes suspended AudioContext within direct user gesture.
 * 2. Plays a 1-sample silent Web Audio buffer to kickstart WebKit hardware on iOS.
 * 3. Plays a silent HTMLAudioElement to engage AVAudioSessionCategoryPlayback on iOS
 *    so sounds play even if the iPhone physical mute/silent switch is engaged.
 */
export function unlockAudioContext(): AudioContext {
  const ctx = getMetronomeAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  // 1-sample silent buffer for iOS WebKit hardware
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {}

  // iOS silent switch bypass
  try {
    if (!silentAudioElement && typeof document !== 'undefined') {
      silentAudioElement = document.createElement('audio');
      silentAudioElement.setAttribute('x-webkit-airplay', 'deny');
      silentAudioElement.setAttribute('playsinline', '');
      silentAudioElement.setAttribute('webkit-playsinline', '');
      silentAudioElement.loop = true;
      silentAudioElement.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
    }
    if (silentAudioElement && silentAudioElement.paused) {
      silentAudioElement.play().catch(() => {});
    }
  } catch {}

  return ctx;
}

export type ClickType = 'downbeat' | 'beat' | 'subdivision';

/**
 * Precise Acoustic Wood Metronome Synthesis at target hardware time.
 * - Downbeat: Forte (1450 -> 480 Hz, gain 0.85) + Sino opcional (2400 Hz)
 * - Regular Beat: Médio (950 -> 340 Hz, gain 0.70)
 * - Subdivision: Baixo / Mais suave (1100 -> 500 Hz, gain 0.28) para marcar sem sobrepor
 */
export function playClickAt(time: number, type: ClickType, bellEnabled: boolean = true) {
  try {
    const ctx = getMetronomeAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'bandpass';

    if (type === 'downbeat') {
      filter.frequency.setValueAtTime(1900, time);
      filter.Q.setValueAtTime(5.5, time);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1450, time);
      osc.frequency.exponentialRampToValueAtTime(480, time + 0.035);

      gain.gain.setValueAtTime(0.85, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    } else if (type === 'beat') {
      filter.frequency.setValueAtTime(1300, time);
      filter.Q.setValueAtTime(5.5, time);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, time);
      osc.frequency.exponentialRampToValueAtTime(340, time + 0.035);

      gain.gain.setValueAtTime(0.70, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    } else {
      // Subdivisão: Som mais suave e baixo para marcar o ritmo
      filter.frequency.setValueAtTime(1650, time);
      filter.Q.setValueAtTime(4.5, time);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, time);
      osc.frequency.exponentialRampToValueAtTime(500, time + 0.022);

      gain.gain.setValueAtTime(0.28, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.045);

    // Downbeat bell chime (quando ativado)
    if (type === 'downbeat' && bellEnabled) {
      const bellOsc = ctx.createOscillator();
      const bellGain = ctx.createGain();

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(2400, time);

      bellGain.gain.setValueAtTime(0.22, time);
      bellGain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

      bellOsc.connect(bellGain);
      bellGain.connect(ctx.destination);

      bellOsc.start(time);
      bellOsc.stop(time + 0.18);
    }
  } catch {}
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
  const [startAudioTime, setStartAudioTime] = useState<number>(0);

  // Synchronized state refs for audio lookahead scheduler
  const bpmRef = useRef<number>(bpm);
  const pulsosRef = useRef<number>(pulsos);
  const figuraCountRef = useRef<number>(figuraCount);
  const bellEnabledRef = useRef<boolean>(bellEnabled);
  const isRunningRef = useRef<boolean>(isRunning);
  const startAudioTimeRef = useRef<number>(0);
  const prevBpmRef = useRef<number>(bpm);

  bpmRef.current = bpm;
  pulsosRef.current = pulsos;
  figuraCountRef.current = figuraCount;
  bellEnabledRef.current = bellEnabled;
  isRunningRef.current = isRunning;

  // Lookahead Scheduler state
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const pulseIndexRef = useRef<number>(1);
  const subIndexRef = useRef<number>(0);
  const notesInQueueRef = useRef<Array<{ pulse: number; sub: number; time: number }>>([]);
  const tapTimesRef = useRef<number[]>([]);

  // Advance scheduler by 1 subdivision unit
  const advanceNote = useCallback(() => {
    const secondsPerBeat = 60.0 / bpmRef.current;
    const currentSubDiv = Math.max(1, figuraCountRef.current);
    const secondsPerSub = secondsPerBeat / currentSubDiv;

    nextNoteTimeRef.current += secondsPerSub;

    subIndexRef.current += 1;
    if (subIndexRef.current >= currentSubDiv) {
      subIndexRef.current = 0;
      pulseIndexRef.current += 1;
      if (pulseIndexRef.current > pulsosRef.current) {
        pulseIndexRef.current = 1;
      }
    }
  }, []);

  // Scheduler tick: runs periodically and schedules notes ahead in the AudioContext clock
  const scheduler = useCallback(() => {
    const ctx = getMetronomeAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // When backgrounded or hidden on mobile, expand lookahead to prevent starvation
    const isHidden = typeof document !== 'undefined' && document.hidden;
    const scheduleAheadTime = isHidden ? 1.5 : 0.12;

    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      const pulse = pulseIndexRef.current;
      const sub = subIndexRef.current;
      const time = nextNoteTimeRef.current;

      let type: ClickType;
      if (sub === 0) {
        type = pulse === 1 ? 'downbeat' : 'beat';
      } else {
        type = 'subdivision';
      }

      playClickAt(time, type, bellEnabledRef.current);

      notesInQueueRef.current.push({ pulse, sub, time });
      if (notesInQueueRef.current.length > 40) {
        notesInQueueRef.current.splice(0, notesInQueueRef.current.length - 25);
      }

      advanceNote();
    }
  }, [advanceNote]);

  // UI animation frame: synchronizes visual beat lamps and subdivision pills with audio playback
  useEffect(() => {
    if (!isRunning) return;

    let mounted = true;

    const drawUI = () => {
      if (!mounted || !isRunningRef.current) return;

      const ctx = getMetronomeAudioContext();
      const currentAudioTime = ctx.currentTime;

      // Small lead offset (10ms) perfectly aligns the V-Sync paint with physical speaker output
      const renderLeadOffset = 0.010;

      let currentNote: { pulse: number; sub: number; time: number } | null = null;
      while (
        notesInQueueRef.current.length > 0 &&
        notesInQueueRef.current[0].time <= currentAudioTime + renderLeadOffset
      ) {
        currentNote = notesInQueueRef.current.shift()!;
      }

      if (currentNote) {
        if (currentNote.sub === 0) {
          setCurrentPulse(currentNote.pulse);
        }
        const activeItem = { pulse: currentNote.pulse, sub: currentNote.sub };
        setActiveSubdivision(activeItem);

        // Flash duration: 72% of subdivision interval for crisp, snappy pulses
        const currentSubDurationMs =
          ((60 / bpmRef.current) / Math.max(1, figuraCountRef.current)) * 1000;
        setTimeout(() => {
          setActiveSubdivision((prev) =>
            prev?.pulse === activeItem.pulse && prev?.sub === activeItem.sub ? null : prev
          );
        }, currentSubDurationMs * 0.72);
      }

      animFrameRef.current = requestAnimationFrame(drawUI);
    };

    animFrameRef.current = requestAnimationFrame(drawUI);

    return () => {
      mounted = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isRunning]);

  // Handle continuous smooth phase anchor when BPM changes while running
  useEffect(() => {
    if (isRunning && prevBpmRef.current !== bpm) {
      const ctx = getMetronomeAudioContext();
      const now = ctx.currentTime;
      const oldT = 60 / prevBpmRef.current;
      const newT = 60 / bpm;
      const currentPhase = (Math.PI * (now - startAudioTimeRef.current)) / oldT;
      const newStartTime = now - (currentPhase * newT) / Math.PI;
      startAudioTimeRef.current = newStartTime;
      setStartAudioTime(newStartTime);
      prevBpmRef.current = bpm;
    }
  }, [bpm, isRunning]);

  // Main Metronome start/stop effect with lookahead timer
  useEffect(() => {
    if (isRunning) {
      const ctx = unlockAudioContext();
      pulseIndexRef.current = 1;
      subIndexRef.current = 0;
      nextNoteTimeRef.current = ctx.currentTime + 0.02;
      startAudioTimeRef.current = nextNoteTimeRef.current;
      setStartAudioTime(nextNoteTimeRef.current);
      prevBpmRef.current = bpm;
      notesInQueueRef.current = [];

      scheduler();
      timerRef.current = setInterval(scheduler, 25);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      notesInQueueRef.current = [];
      setCurrentPulse(1);
      setActiveSubdivision(null);

      // Pause background silent audio element when metronome stops
      if (silentAudioElement && !silentAudioElement.paused) {
        silentAudioElement.pause();
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, scheduler]);

  // Lifecycle & Mobile Visibility recovery
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && isRunningRef.current) {
        const ctx = getMetronomeAudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, []);

  // Global user gesture unlocker for mobile (iOS Safari / WebKit and Android)
  useEffect(() => {
    const handleGesture = () => {
      unlockAudioContext();
    };

    window.addEventListener('touchstart', handleGesture, { capture: true, passive: true });
    window.addEventListener('touchend', handleGesture, { capture: true, passive: true });
    window.addEventListener('pointerdown', handleGesture, { capture: true, passive: true });
    window.addEventListener('click', handleGesture, { capture: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', handleGesture, { capture: true });
      window.removeEventListener('touchend', handleGesture, { capture: true });
      window.removeEventListener('pointerdown', handleGesture, { capture: true });
      window.removeEventListener('click', handleGesture, { capture: true });
    };
  }, []);

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

  const toggleMetronome = useCallback(() => {
    unlockAudioContext();
    setIsRunning((prev) => !prev);
  }, []);

  // Tap Tempo calculation
  const tapTempo = useCallback(() => {
    unlockAudioContext();
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
    tempoName: getTempoName(bpm),
    startAudioTime
  };
}
