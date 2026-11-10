import React, { useState } from 'react';
import { FiguraOption, TimeSignatureOption, TIME_SIGNATURES } from '../hooks/useMetronome';
import { AnalogMetronome } from './AnalogMetronome';
import coelhoImg from '../assets/icoApp.png';

interface MetronomoTabProps {
  bpm: number;
  setBpm: (val: number) => void;
  pulsos: number;
  setPulsos: (val: number) => void;
  metric?: string;
  setMetric?: (val: string) => void;
  timeSignatures?: TimeSignatureOption[];
  figuraCount: number;
  setFiguraCount: (val: number) => void;
  isRunning: boolean;
  onToggle: () => void;
  currentPulse: number;
  activeSubdivision: { pulse: number; sub: number } | null;
  figuras: FiguraOption[];
  deviceType: 'mobile' | 'tablet' | 'desktop';
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
  metric = '4/4',
  setMetric,
  timeSignatures = TIME_SIGNATURES,
  figuraCount,
  setFiguraCount,
  isRunning,
  onToggle,
  currentPulse,
  activeSubdivision,
  figuras,
  deviceType,
  bellEnabled = true,
  setBellEnabled,
  tapTempo,
  tempoName = 'Moderato'
}) => {
  const [showSubdivisions, setShowSubdivisions] = useState<boolean>(false);
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

  return (
    <div
      id="painelClock"
      className={`painel flexColBetween ${deviceType}`}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', maxWidth: '960px', margin: '0 auto' }}
    >
      {/* Top Bar: Subdivisões Switcher & Title */}
      <div className="metro-header comp">
        <div className="metro-title flexrow itemCenter gap1">
          <img
            src={coelhoImg}
            alt="Coelho"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid var(--accent-color, #f59e0b)'
            }}
          />
          <div className="flexcol">
            <span className="metro-heading">Metrônomo</span>
            <span className="metro-tempo-badge-text">
              {showSubdivisions ? 'Verificação de Subdivisões' : `${tempoName} • ${bpm} BPM`}
            </span>
          </div>
        </div>

        {/* Chave (Toggle Switch) para trocar para tela de Subdivisões */}
        <div
          className="flexrow itemCenter gap1"
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setShowSubdivisions((prev) => !prev)}
          title={showSubdivisions ? 'Voltar para o Metrônomo Analógico' : 'Abrir tela de Subdivisões e Compassos'}
        >
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: showSubdivisions ? 'var(--accent-color, #f59e0b)' : 'var(--colorD, #9ca3af)',
              transition: 'color 0.2s ease',
              letterSpacing: '0.3px'
            }}
          >
            Subdivisões
          </span>

          <label
            htmlFor="subdivToggle"
            className="switch metro-switch"
            style={{ margin: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              id="subdivToggle"
              checked={showSubdivisions}
              onChange={(e) => setShowSubdivisions(e.target.checked)}
              aria-label="Alternar para tela de subdivisões"
            />
            <span className="slider round" />
          </label>
        </div>
      </div>

      {/* Main Container: Metrônomo Analógico OU Verificação de Subdivisões */}
      <div className="metro-content-container w-100">
        {/* TELA 1: METRÔNOMO ANALÓGICO (Padrão) */}
        {!showSubdivisions && (
          <section className="metro-analog-section flexColCenter w-100">
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

        {/* TELA 2: VERIFICAÇÃO DE SUBDIVISÕES E COMPASSOS */}
        {showSubdivisions && (
          <section className="metro-digital-section flexcol gap1 w-100">
            {/* Control Bar: Play/Pause, BPM Adjustment, and Finger-Friendly Tap Tempo */}
            <article className="comp bgDark p-1 flexrow justContBetween itemCenter gap2 flexWrap">
              {/* Play / Pause Button */}
              <button
                type="button"
                className={`metro-analog-btn ${isRunning ? 'active' : ''}`}
                onClick={onToggle}
                style={{
                  width: '56px',
                  height: '56px',
                  fontSize: '1.4rem',
                  borderRadius: '12px',
                  flexShrink: 0
                }}
                title={isRunning ? 'Pausar Metrônomo' : 'Iniciar Metrônomo'}
              >
                <i className={`bi ${isRunning ? 'bi-pause-fill' : 'bi-play-fill'}`} />
              </button>

              {/* BPM Adjuster Steppers */}
              <div className="flexrow itemCenter gap1">
                <button
                  type="button"
                  className="metro-step-btn"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  onClick={() => adjustBpm(-5)}
                  title="-5 BPM"
                >
                  -5
                </button>
                <button
                  type="button"
                  className="metro-step-btn"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  onClick={() => adjustBpm(-1)}
                  title="-1 BPM"
                >
                  -1
                </button>
                <div style={{ textAlign: 'center', minWidth: '70px' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{bpm}</div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-color, #f59e0b)' }}>BPM</div>
                </div>
                <button
                  type="button"
                  className="metro-step-btn"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  onClick={() => adjustBpm(+1)}
                  title="+1 BPM"
                >
                  +1
                </button>
                <button
                  type="button"
                  className="metro-step-btn"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  onClick={() => adjustBpm(+5)}
                  title="+5 BPM"
                >
                  +5
                </button>
              </div>

              {/* Large, Finger-Friendly Tap Tempo Pad */}
              <button
                type="button"
                className={`metro-tap-tempo-pad ${tapActive ? 'active' : ''}`}
                onClick={handleTap}
                title="Toque com o dedo no ritmo desejado para detectar o andamento"
              >
                <i className="bi bi-hand-index-thumb-fill" style={{ fontSize: '1.3rem' }} />
                <span>TAP TEMPO</span>
              </button>
            </article>

            {/* Compassos (Métricas) & Subdivisões Musicais */}
            <article className="bgDark comp flexcol gap2 p-1 rad">
              {/* 1. Métricas do Compasso (2/4, 3/4, 4/4, etc.) */}
              <div className="metro-control-group flexcol gap1">
                <div className="flexrow itemCenter justContBetween">
                  <span className="card-header-label">
                    <i className="bi bi-music-note-beamed" style={{ marginRight: '4px' }} />
                    Métrica do Compasso
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-color, #f59e0b)' }}>
                    {metric} ({pulsos} tempos)
                  </span>
                </div>
                <div className="metro-pulsos-btns flexrow w-100 flexWrap gap1">
                  {timeSignatures.map((ts) => (
                    <button
                      key={ts.metric}
                      type="button"
                      className={`metro-metric-btn ${metric === ts.metric ? 'active' : ''}`}
                      onClick={() => {
                        if (setMetric) setMetric(ts.metric);
                        else setPulsos(ts.pulsos);
                      }}
                      title={`${ts.metric} - ${ts.label} (${ts.pulsos} tempos)`}
                    >
                      <span>{ts.metric}</span>
                      <span className="metro-metric-label">{ts.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Subdivisões Rítmicas (Nomes Musicais Tradicionais) */}
              <div className="metro-control-group flexcol gap1">
                <div className="flexrow itemCenter justContBetween">
                  <span className="card-header-label">
                    <i className="bi bi-soundwave" style={{ marginRight: '4px' }} />
                    Subdivisão Rítmica
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--colorC, #38bdf8)' }}>
                    {figuras.find((f) => f.value === figuraCount)?.name || 'Semínima'} ({figuraCount}x por tempo)
                  </span>
                </div>
                <div className="metro-figuras-grid flexrow w-100 flexWrap gap1" id="figuraBtns">
                  {figuras.map((fig) => (
                    <button
                      key={fig.value}
                      type="button"
                      className={`metro-subdiv-btn ${figuraCount === fig.value ? 'active' : ''}`}
                      title={`${fig.name}: ${fig.description} (${fig.value} batidas por tempo)`}
                      onClick={() => setFiguraCount(fig.value)}
                    >
                      <span className="metro-subdiv-name">{fig.name}</span>
                      <span className="metro-subdiv-meta">
                        {fig.symbol} • {fig.value}x
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </article>

            {/* Visualizador Dinâmico de Batidas e Subdivisões */}
            <section id="compasso" className="compasso p-1 flex gap1 justCenter flexWrap">
              {Array.from({ length: pulsos }).map((_, idx) => {
                const p = idx + 1;
                const isCurrentPulse = isRunning && currentPulse === p;
                const isDownbeat = p === 1;

                return (
                  <div
                    key={p}
                    id={`p${p}`}
                    className={`metro-pulse-card flexColBetween ${
                      isCurrentPulse ? 'active-beat' : ''
                    } ${isDownbeat ? 'downbeat' : ''}`}
                  >
                    {/* Header Lamp */}
                    <div className="pulse-lamp-header flexrow itemCenter justContBetween">
                      <span className="pulse-number">
                        {isDownbeat ? <i className="bi bi-star-fill text-gold" style={{ marginRight: '3px' }} /> : null}
                        {p}
                      </span>
                      <div className={`pulse-lamp-dot ${isCurrentPulse ? 'active' : ''}`} />
                    </div>

                    {/* Subdivisions Bars */}
                    <div className="pulse-subs-container w-100" data-divisions={figuraCount}>
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
    </div>
  );
};
