import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
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
              {showSubdivisions ? `Subdivisões • ${bpm} BPM` : `${tempoName} • ${bpm} BPM`}
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
            {/* Control Bar: Play/Pause, Tempo Readout (No Steppers), and Finger-Friendly Tap Tempo */}
            <article className="comp bgDark p-1 flexrow justContBetween itemCenter gap2 flexWrap">
              {/* Play / Pause Button with BPM Readout */}
              <div className="flexrow itemCenter gap1">
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
                <div className="metro-subdiv-bpm-readout flexcol justCenter">
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{bpm}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-color, #f59e0b)', letterSpacing: '0.5px' }}>BPM</span>
                </div>
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

            {/* Compassos (Métricas) & Subdivisões Musicais no Carousel Swiper */}
            <article className="bgDark comp flexcol gap2 p-1 rad" style={{ overflow: 'hidden' }}>
              {/* 1. Carousel Swiper: Métricas do Compasso (2/4, 3/4, 4/4, etc.) */}
              <div className="metro-control-group flexcol gap1" style={{ width: '100%', minWidth: 0 }}>
                <div className="flexrow itemCenter justContBetween">
                  <span className="card-header-label">
                    <i className="bi bi-music-note-beamed" style={{ marginRight: '6px' }} />
                    Métrica do Compasso
                  </span>
                  <div className="flexrow itemCenter gap1">
                    <span className="metro-swipe-hint">
                      <i className="bi bi-arrow-left-right" style={{ fontSize: '0.75rem', marginRight: '3px' }} />
                      deslize
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-color, #f59e0b)' }}>
                      {metric} ({pulsos} tempos)
                    </span>
                  </div>
                </div>

                <div className="metro-swiper-wrap">
                  <Swiper
                    modules={[FreeMode, Mousewheel]}
                    slidesPerView="auto"
                    spaceBetween={8}
                    freeMode={{
                      enabled: true,
                      momentum: true
                    }}
                    mousewheel={{ forceToAxis: true }}
                    grabCursor={true}
                    className="metro-swiper"
                  >
                    {timeSignatures.map((ts) => (
                      <SwiperSlide key={ts.metric} className="metro-swiper-slide">
                        <button
                          type="button"
                          className={`metro-metric-btn ${metric === ts.metric ? 'active' : ''}`}
                          onClick={() => {
                            if (setMetric) setMetric(ts.metric);
                            else setPulsos(ts.pulsos);
                          }}
                          title={`${ts.metric} - ${ts.label} (${ts.pulsos} tempos)`}
                        >
                          <span className="metro-metric-val">{ts.metric}</span>
                          <span className="metro-metric-label">{ts.label}</span>
                        </button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>

              {/* 2. Carousel Swiper: Subdivisões Rítmicas */}
              <div className="metro-control-group flexcol gap1" style={{ width: '100%', minWidth: 0 }}>
                <div className="flexrow itemCenter justContBetween">
                  <span className="card-header-label">
                    <i className="bi bi-soundwave" style={{ marginRight: '6px' }} />
                    Subdivisão Rítmica
                  </span>
                  <div className="flexrow itemCenter gap1">
                    <span className="metro-swipe-hint">
                      <i className="bi bi-arrow-left-right" style={{ fontSize: '0.75rem', marginRight: '3px' }} />
                      deslize
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--colorC, #38bdf8)' }}>
                      {figuras.find((f) => f.value === figuraCount)?.name || 'Semínima'} ({figuraCount}x)
                    </span>
                  </div>
                </div>

                <div className="metro-swiper-wrap">
                  <Swiper
                    modules={[FreeMode, Mousewheel]}
                    slidesPerView="auto"
                    spaceBetween={8}
                    freeMode={{
                      enabled: true,
                      momentum: true
                    }}
                    mousewheel={{ forceToAxis: true }}
                    grabCursor={true}
                    className="metro-swiper"
                  >
                    {figuras.map((fig) => (
                      <SwiperSlide key={fig.value} className="metro-swiper-slide">
                        <button
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
                      </SwiperSlide>
                    ))}
                  </Swiper>
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
                    className={`metro-pulse-card flexColBetween ${isCurrentPulse ? 'active-beat' : ''
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
