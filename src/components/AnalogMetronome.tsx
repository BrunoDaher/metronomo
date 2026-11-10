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
          className="case-dial"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          title="Clique ou arraste para ajustar o andamento (BPM)"
        >
          {/* Classical Dual-Column Tempo Markings */}
          <div className="tempo-scale-labels">
            {/* Left Column: BPM Numbers */}
            {TEMPO_SCALE_MARKS.map((mark) => {
              const isActive = bpm >= mark.min && bpm <= mark.max;
              return (
                <span
                  key={`num_${mark.bpm}`}
                  className={`scale-mark-left ${isActive ? 'active' : ''}`}
                  style={{ top: mark.top }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBpmChange?.(mark.bpm);
                  }}
                  title={`Definir andamento para ${mark.bpm} BPM (${mark.name})`}
                >
                  {mark.bpm}
                </span>
              );
            })}

            {/* Right Column: Italian Tempo Names */}
            {TEMPO_SCALE_MARKS.map((mark) => {
              const isActive = bpm >= mark.min && bpm <= mark.max;
              return (
                <span
                  key={`name_${mark.name}`}
                  className={`scale-mark-right ${isActive ? 'active' : ''}`}
                  style={{ top: mark.top }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBpmChange?.(mark.bpm);
                  }}
                  title={`Definir andamento para ${mark.bpm} BPM (${mark.name})`}
                >
                  {mark.name}
                </span>
              );
            })}
          </div>

          {/* Central groove guide */}
          <div className="pendulum-groove" />

          {/* Oscillating Pendulum Assembly */}
          <div
            className={`pendulum-pivot ${isRunning ? 'running' : 'idle'}`}
            style={{
              animationDuration: `${cycleDuration}s`
            }}
          >
            {/* Metal Arm */}
            <div className="pendulum-arm">
              {/* Sliding Counterweight */}
              <div
                className="pendulum-weight"
                style={{
                  top: `${weightPercent}%`
                }}
                title={`${bpm} BPM - ${tempoName}`}
              >
                <div className="weight-bezel" />
                <span className="weight-indicator">{bpm}</span>
              </div>

              {/* Upper counter-tip */}
              <div className="pendulum-tip" />
            </div>
          </div>
        </div>

        {/* Base with Bell / Wood Toggle Switch & Pivot mount */}
        <div className="case-base">
          <div className="case-pivot-mount" />

          {/* Sino / Madeira toggle switch */}
          {onToggleBell && (
            <div
              className={`case-bell-toggle ${bellEnabled ? 'mode-sino' : 'mode-madeira'} ${
                isDownbeat && bellEnabled ? 'active-beat' : ''
              }`}
              title="Alternar entre Sino e Madeira no 1º tempo"
              onClick={() => onToggleBell(!bellEnabled)}
              style={{ cursor: 'pointer' }}
            >
              <i
                className={`bi ${bellEnabled ? 'bi-bell-fill text-gold' : 'bi-tree-fill text-wood'}`}
                style={{ fontSize: '0.82rem' }}
              />
              <span className="case-bell-label">{bellEnabled ? 'Sino' : 'Madeira'}</span>
              <label className="switch case-switch" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={bellEnabled}
                  onChange={(e) => onToggleBell(e.target.checked)}
                />
                <span className="slider round" />
              </label>
            </div>
          )}

          {onToggle && (
            <button
              type="button"
              className={`metro-analog-btn ${isRunning ? 'active' : ''}`}
              onClick={onToggle}
              title={isRunning ? 'Pausar Metrônomo' : 'Iniciar Metrônomo'}
            >
              <i className={`bi ${isRunning ? 'bi-pause-fill' : 'bi-play-fill'}`} />
            </button>
          )}

          <div className="case-tempo-badge">
            <span className="tempo-bpm">{bpm} <small>BPM</small></span>
            <span className="tempo-label">{tempoName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
