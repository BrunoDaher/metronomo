import { useState, useEffect, useRef, useCallback } from 'react';

export interface FiguraOption {
  value: number;
  title: string;
  text: string;
}

export const FIGURAS: FiguraOption[] = [
  { value: 1, title: 'Semínima', text: ')' },
  { value: 2, title: 'Colcheia', text: '))' },
  { value: 3, title: 'Semicolcheia', text: ')))' },
  { value: 4, title: 'Fusa', text: '))))' },
  { value: 5, title: 'Semifusa', text: ')))))' }
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
  const [pulsos, setPulsos] = useState<number>(4);
  const [figuraCount, setFiguraCount] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentPulse, setCurrentPulse] = useState<number>(1);
  const [activeSubdivision, setActiveSubdivision] = useState<{ pulse: number; sub: number } | null>(null);
  const [soundType, setSoundType] = useState<'wood' | 'beep'>('wood');
  const [bellEnabled, setBellEnabled] = useState<boolean>(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseIndexRef = useRef<number>(1);
  const tapTimesRef = useRef<number[]>([]);

  // Sound synthesis for authentic acoustic wood click & bell or digital beep
  const playClick = useCallback(
    (isDownbeat: boolean) => {
      try {
        const ctx = getMetronomeAudioContext();
        const now = ctx.currentTime;

        if (soundType === 'wood') {
          // Acoustic Woodblock / Mechanical Metronome Click
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          filter.type = 'bandpass';
          filter.frequency.value = isDownbeat ? 1800 : 1200;
          filter.Q.value = 5;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(isDownbeat ? 1400 : 900, now);
          osc.frequency.exponentialRampToValueAtTime(isDownbeat ? 500 : 350, now + 0.035);

          gain.gain.setValueAtTime(0.75, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.045);

          // Downbeat bell chime
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
        } else {
          // Electronic beep
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.value = isDownbeat ? 1200 : 800;

          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.05);
        }
      } catch {
        // Audio might be blocked until user gesture
      }
    },
    [soundType, bellEnabled]
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
    figuraCount,
    setFiguraCount,
    isRunning,
    toggleMetronome,
    currentPulse,
    activeSubdivision,
    figuras: FIGURAS,
    soundType,
    setSoundType,
    bellEnabled,
    setBellEnabled,
    tapTempo,
    tempoName: getTempoName(bpm)
  };
}
