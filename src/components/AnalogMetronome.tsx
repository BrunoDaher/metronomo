import React, { useRef, useCallback } from 'react';
import { getTempoName } from '../hooks/useMetronome';

interface AnalogMetronomeProps {
  bpm: number;
  isRunning: boolean;
  currentPulse: number;
  onBpmChange?: (newBpm: number) => void;
  onToggle?: () => void;
  bellEnabled?: boolean;
  onToggleBell?: (enabled: boolean) => void;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
}

const TEMPO_SCALE_MARKS = [
  { bpm: 40, name: 'Largo', top: '14%', min: 30, max: 50 },
  { bpm: 60, name: 'Larghetto', top: '22%', min: 51, max: 65 },
  { bpm: 76, name: 'Adagio', top: '29%', min: 66, max: 80 },
  { bpm: 108, name: 'Andante', top: '40%', min: 81, max: 112 },
  { bpm: 120, name: 'Moderato', top: '47%', min: 113, max: 135 },
  { bpm: 168, name: 'Allegro', top: '63%', min: 136, max: 180 },
  { bpm: 208, name: 'Presto', top: '76%', min: 181, max: 215 },
  { bpm: 240, name: 'Prestissimo', top: '88%', min: 216, max: 260 }
];

/**
 * Modern Analog Maelzel-style Mechanical Metronome.
 * Features an authentic swinging pendulum with a sliding counterweight,
 * dual-column tempo scale markings (BPM left, Italian tempo names right),
 * and downbeat bell / wood toggle pulse.
 */
export const AnalogMetronome: React.FC<AnalogMetronomeProps> = ({
  bpm,
  isRunning,
  currentPulse,
  onBpmChange,
  onToggle,
  bellEnabled = true,
  onToggleBell,
  deviceType = 'desktop'
}) => {
  const dialRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Period of full back-and-forth cycle (two beats)
  const cycleDuration = (60 / bpm) * 2;

  // Weight position: In inverted pendulum, higher = slower (40 BPM ~ 14%), lower = faster (240 BPM ~ 88%)
  const clampedBpm = Math.max(40, Math.min(240, bpm));
  const weightPercent = 14 + ((clampedBpm - 40) / 200) * 74;

  const tempoName = getTempoName(bpm);
  const isDownbeat = isRunning && currentPulse === 1;

  // Handle dial dragging / clicking to reposition weight and change BPM
  const updateBpmFromPointer = useCallback(
    (clientY: number) => {
      if (!dialRef.current || !onBpmChange) return;
      const rect = dialRef.current.getBoundingClientRect();
      const relativeY = (clientY - rect.top) / rect.height; // 0 to 1
      // Clamped to active scale range (14% to 88%)
      const clampedY = Math.max(0.14, Math.min(0.88, relativeY));
      const fraction = (clampedY - 0.14) / (0.88 - 0.14);
      const newBpm = Math.round(40 + fraction * (240 - 40));
      onBpmChange(newBpm);
    },
    [onBpmChange]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateBpmFromPointer(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateBpmFromPointer(e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore if not captured
    }
  };

  return (
    <div className={`analog-metronome-wrap ${deviceType}`}>
      {/* Wooden / Glass Trapezoidal Case */}
      <div className="analog-metronome-case">
        {/* Top Cap */}
        <div className="case-top-cap">
          <span className="case-brand">MAELZEL</span>
          <span className="case-subtext">PRECISION SYSTEM</span>
        </div>

        {/* Dial Scale Background */}
        <div
          ref={dialRef}
          className="case-dial-face"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          title="Clique ou arraste o peso dourado na haste para ajustar o andamento (BPM)"
        >
          {/* Dual Column Tempo Scale Markings */}
          <div className="tempo-scale-container">
            {TEMPO_SCALE_MARKS.map((mark) => {
              const isCurrentRange = bpm >= mark.min && bpm <= mark.max;
              return (
                <div
                  key={mark.bpm}
                  className={`scale-mark-row ${isCurrentRange ? 'active-range' : ''}`}
                  style={{ top: mark.top }}
                >
                  <span className="scale-bpm">{mark.bpm}</span>
                  <div className="scale-notch" />
                  <span className="scale-name">{mark.name}</span>
                </div>
              );
            })}
          </div>

          {/* Center Pendulum Arm & Pivot Mechanism */}
          <div className="pendulum-container">
            <div
              className={`pendulum-arm ${isRunning ? 'swinging' : 'at-rest'}`}
              style={{
                animationDuration: `${cycleDuration}s`,
                animationPlayState: isRunning ? 'running' : 'paused'
              }}
            >
              {/* Arm metal rod */}
              <div className="pendulum-rod" />

              {/* Sliding Counterweight */}
              <div
                className="pendulum-weight"
                style={{ top: `${weightPercent}%` }}
              >
                <div className="weight-line" />
                <span className="weight-bpm-tag">{bpm}</span>
              </div>
            </div>

            {/* Bottom Pivot Base */}
            <div className="pendulum-pivot-base" />
          </div>
        </div>

        {/* Bottom Brass Faceplate & Controls */}
        <div className="case-bottom-plate">
          <div className="brass-screw left-screw" />
          <div className="brass-screw right-screw" />

          {/* Center Digital Readout */}
          <div className="metronome-readout-cluster">
            <div className="readout-label">TEMPO ATUAL</div>
            <div className="readout-bpm-big">{bpm}</div>
            <div className="readout-italian-name">{tempoName}</div>
          </div>

          {/* Quick Buttons: Toggle Bell & Power */}
          <div className="case-actions-row">
            <button
              type="button"
              className={`analog-tool-btn ${bellEnabled ? 'bell-active' : ''}`}
              onClick={() => onToggleBell?.(!bellEnabled)}
              title={bellEnabled ? 'Sino no 1º tempo ativado' : 'Sino desativado (Apenas madeira)'}
            >
              <i className={`bi ${bellEnabled ? 'bi-bell-fill' : 'bi-bell-slash'}`} />
              <span>{bellEnabled ? 'Sino 1º' : 'Mudo'}</span>
            </button>

            <button
              type="button"
              className={`analog-play-btn ${isRunning ? 'running' : ''}`}
              onClick={onToggle}
              title={isRunning ? 'Pausar Metrônomo (Espaço)' : 'Iniciar Metrônomo (Espaço)'}
            >
              <i className={`bi ${isRunning ? 'bi-pause-fill' : 'bi-play-fill'}`} />
              <span>{isRunning ? 'PARAR' : 'INICIAR'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Downbeat Visual Flash Indicator */}
      <div className={`downbeat-flash-beacon ${isDownbeat ? 'flash' : ''}`} />
    </div>
  );
};
