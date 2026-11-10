import React, { useState } from 'react';
import { FiguraOption } from '../hooks/useMetronome';
import { AnalogMetronome } from './AnalogMetronome';

interface MetronomoTabProps {
  bpm: number;
  setBpm: (val: number) => void;
  pulsos: number;
  setPulsos: (val: number) => void;
  figuraCount: number;
  setFiguraCount: (val: number) => void;
  isRunning: boolean;
  onToggle: () => void;
  currentPulse: number;
  activeSubdivision: { pulse: number; sub: number } | null;
  figuras: FiguraOption[];
  deviceType: 'mobile' | 'tablet' | 'desktop';
  soundType?: 'wood' | 'beep';
  setSoundType?: (val: 'wood' | 'beep') => void;
  bellEnabled?: boolean;
  setBellEnabled?: (val: boolean) => void;
  tapTempo?: () => void;
  tempoName?: string;
}

export const MetronomoTab: React.FC<MetronomoTabProps> = ({
  bpm,
  setBpm,
  pulsos,
  setPulsos,
  figuraCount,
  setFiguraCount,
  isRunning,
  onToggle,
  currentPulse,
  activeSubdivision,
  figuras,
  deviceType,
  soundType = 'wood',
  setSoundType,
  bellEnabled = true,
  setBellEnabled,
  tapTempo,
  tempoName = 'Moderato'
}) => {
  const [viewMode, setViewMode] = useState<'analog' | 'digital'>('analog');
  const [tapActive, setTapActive] = useState<boolean>(false);

  const handleTap = () => {
    if (tapTempo) {
      tapTempo();
      setTapActive(true);
      setTimeout(() => setTapActive(false), 150);
    }
  };

  const adjustBpm = (delta: number) => {
    setBpm(Math.max(30, Math.min(260, bpm + delta)));
  };

  const presetTempos = [
    { label: 'Largo', bpm: 60 },
    { label: 'Andante', bpm: 80 },
    { label: 'Moderato', bpm: 108 },
    { label: 'Allegro', bpm: 128 },
    { label: 'Vivace', bpm: 144 },
    { label: 'Presto', bpm: 180 }
  ];

  return (
    <div
      id="painelClock"
      className={`painel flexColBetween ${deviceType}`}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', maxWidth: '960px', margin: '0 auto' }}
    >
      {/* Top Bar: View Mode Switcher & Global Power */}
      <div className={`metro-header comp ${deviceType === 'mobile' ? 'p-1' : 'p-2'}`}>
        <div className="metro-title flexrow itemCenter gap1">
          <i className="bi bi-clock-history colorA f3vh" />
          <div className="flexcol">
            <span className="metro-heading">Metrônomo</span>
            <span className="metro-tempo-badge-text">{tempoName} • {bpm} BPM</span>
          </div>
        </div>

        {/* View Mode Switcher: Analog or Digital */}
        <div className="metro-view-modes flexrow gap1" role="tablist">
          <button
            type="button"
            className={`metro-view-btn ${viewMode === 'analog' ? 'active' : ''}`}
            onClick={() => setViewMode('analog')}
            title="Exibir Metrônomo Analógico Mecânico"
          >
            <i className="bi bi-hourglass-split" /> <span className="view-btn-text">Analógico</span>
          </button>
          <button
            type="button"
            className={`metro-view-btn ${viewMode === 'digital' ? 'active' : ''}`}
            onClick={() => setViewMode('digital')}
            title="Exibir Controles Digitais"
          >
            <i className="bi bi-cpu" /> <span className="view-btn-text">Digital</span>
          </button>
        </div>

        {/* Switch Toggle */}
        <label
          htmlFor="metroToggle"
          className="switch"
          title={isRunning ? 'Metrônomo Ligado (Clique para Desligar)' : 'Metrônomo Desligado (Clique para Ligar)'}
        >
          <input
            type="checkbox"
            id="metroToggle"
            checked={isRunning}
            onChange={onToggle}
            aria-label="Ligar ou desligar metrônomo"
          />
          <span className="slider round" />
        </label>
      </div>

      {/* Main Container: Single View (Analog OR Digital) */}
      <div className={`metro-content-container view-${viewMode} w-100`}>
        {/* ANALOG METRONOME */}
        {viewMode === 'analog' && (
          <section className={`metro-analog-section comp flexColCenter ${deviceType === 'mobile' ? 'p-1' : 'p-2'}`}>
            <AnalogMetronome
              bpm={bpm}
              isRunning={isRunning}
              currentPulse={currentPulse}
              onBpmChange={setBpm}
              onToggle={onToggle}
              bellEnabled={bellEnabled}
              onToggleBell={setBellEnabled}
              deviceType={deviceType}
            />
          </section>
        )}

        {/* DIGITAL CONTROLS */}
        {viewMode === 'digital' && (
          <section className="metro-digital-section flexcol gap1 w-100">
            {/* Hero Bar: Toggle Sino/Madeira & Tap Tempo */}
            <article className="comp bgDark p-1 flexrow justCenter itemCenter gap2 flexWrap">
              {/* Chave toggle que altera entre Madeira e Sino */}
              <div
                className="metro-sound-toggle-group flexrow itemCenter gap1 p-1"
                title="Alternar entre Madeira e Sino no 1º tempo"
              >
                <span
                  className={`toggle-label ${!bellEnabled ? 'active' : ''}`}
                  onClick={() => setBellEnabled?.(false)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="bi bi-tree-fill" /> Wood
                </span>

                <label className="switch metro-switch" htmlFor="sinoToggle" title="Alternar entre Madeira e Sino no 1º tempo">
                  <input
                    type="checkbox"
                    id="sinoToggle"
                    checked={bellEnabled}
                    onChange={(e) => setBellEnabled?.(e.target.checked)}
                  />
                  <span className="slider round" />
                </label>

                <span
                  className={`toggle-label ${bellEnabled ? 'active' : ''}`}
                  onClick={() => setBellEnabled?.(true)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="bi bi-bell-fill" /> Sino
                </span>
              </div>

              {/* Sound Type: Wood vs Beep */}
              {setSoundType && (
                <div className="metro-sound-toggle-group flexrow itemCenter gap1 p-1">
                  <button
                    type="button"
                    className={`metro-view-btn ${soundType === 'wood' ? 'active' : ''}`}
                    onClick={() => setSoundType('wood')}
                    title="Som Acústico de Bloco de Madeira"
                  >
                    Madeira
                  </button>
                  <button
                    type="button"
                    className={`metro-view-btn ${soundType === 'beep' ? 'active' : ''}`}
                    onClick={() => setSoundType('beep')}
                    title="Som Digital Sintetizado"
                  >
                    Beep
                  </button>
                </div>
              )}

              <button
                type="button"
                className={`metro-tap-tempo-btn border0 flexrow itemCenter gap1 ${tapActive ? 'active' : ''}`}
                onClick={handleTap}
                title="Clique no ritmo desejado para detectar o andamento"
              >
                <i className="bi bi-hand-index-thumb-fill" />
                <span>TAP TEMPO</span>
              </button>
            </article>

            {/* Time Signature (Pulsos) & Subdivisions (Batidas) */}
            <article className="bgDark comp flex gap2 justCenter p-1 rad">
              {/* Compasso */}
              <div className="metro-control-group gap1 flexcol">
                <div className="flexrow itemCenter">
                  <span className="card-header-label">Compassos</span>
                </div>
                <div className="metro-pulsos-btns flexrow justCenter w-100">
                  {[1, 2, 3, 4, 6].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`compCount-btn flex1 ${pulsos === p ? 'active' : ''}`}
                      onClick={() => setPulsos(p)}
                      title={`${p} pulsos por compasso`}
                    >
                      {p === 6 ? '6/8' : `${p}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rhythmic Subdivisions (Batidas por tempo) */}
              <div className="metro-control-group flexcol gap1">
                <div className="flexrow itemCenter">
                  <span className="card-header-label">Subdivisão</span>
                </div>
                <div className="metro-figuras-grid flexrow w-100" id="figuraBtns">
                  {figuras.map((fig) => (
                    <button
                      key={fig.value}
                      type="button"
                      className={`figura-btn figritm flex1 ${figuraCount === fig.value ? 'active' : ''}`}
                      title={`${fig.title} (${fig.value}x)`}
                      onClick={() => setFiguraCount(fig.value)}
                    >
                      {fig.text}
                    </button>
                  ))}
                </div>
              </div>
            </article>

            {/* Dynamic Beats & Subdivisions Visualizer */}
            <section id="compasso" className="compasso p-1 flex gap1 justCenter">
              {Array.from({ length: pulsos }).map((_, idx) => {
                const p = idx + 1;
                const isCurrentPulse = isRunning && currentPulse === p;
                const isDownbeat = p === 1;

                return (
                  <div
                    key={p}
                    id={`p${p}`}
                    className={`metro-pulse-card flexColBetween ${isCurrentPulse ? 'active-beat' : ''
                      } ${isDownbeat ? 'downbeat' : ''}`}
                  >
                    {/* Header Lamp */}
                    <div className="pulse-lamp-header flexrow itemCenter justContBetween">
                      <span className="pulse-number">
                        {isDownbeat ? <i className="bi bi-star-fill text-gold" /> : null}
                        {p}
                      </span>
                      <div className={`pulse-lamp-dot ${isCurrentPulse ? 'active' : ''}`} />
                    </div>

                    {/* Subdivisions Bars */}
                    <div
                      className="pulse-subs-container w-100"
                      data-divisions={figuraCount}
                    >
                      {Array.from({ length: figuraCount }).map((_, j) => {
                        const isSubActive =
                          isRunning &&
                          activeSubdivision?.pulse === p &&
                          activeSubdivision?.sub === j;

                        return (
                          <div
                            key={j}
                            className={`subdivision ${isSubActive ? 'active' : ''}`}
                            title={`Tempo ${p} - Subdivisão ${j + 1} de ${figuraCount}`}
                          >
                            {j + 1}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>
          </section>
        )}
      </div>

      {/* Quick BPM Controls & Preset Bar (visible only in digital mode) */}
      {viewMode === 'digital' && (
        <div className="comp p-2 flexrow justContBetween itemCenter flexWrap gap1" style={{ background: 'var(--fundoE)', borderRadius: '8px' }}>
          <div className="flexrow itemCenter gap1">
            <button
              type="button"
              className="metro-step-btn"
              onClick={() => adjustBpm(-5)}
              title="-5 BPM"
            >
              -5
            </button>
            <button
              type="button"
              className="metro-step-btn"
              onClick={() => adjustBpm(-1)}
              title="-1 BPM"
            >
              -1
            </button>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--colorB)', minWidth: '80px', textAlign: 'center' }}>
              {bpm} <small style={{ fontSize: '0.7rem', color: 'var(--colorD)', fontWeight: 600 }}>BPM</small>
            </span>
            <button
              type="button"
              className="metro-step-btn"
              onClick={() => adjustBpm(+1)}
              title="+1 BPM"
            >
              +1
            </button>
            <button
              type="button"
              className="metro-step-btn"
              onClick={() => adjustBpm(+5)}
              title="+5 BPM"
            >
              +5
            </button>
          </div>

          <div className="flexrow itemCenter gap1 flexWrap">
            {presetTempos.map((pt) => (
              <button
                key={pt.label}
                type="button"
                className={`preset-tempo-pill ${bpm === pt.bpm ? 'active' : ''}`}
                onClick={() => setBpm(pt.bpm)}
              >
                {pt.label} ({pt.bpm})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

