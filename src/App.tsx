import React, { useEffect, useState } from 'react';
import { useMetronome } from './hooks/useMetronome';
import { useDevice } from './hooks/useDevice';
import { MetronomoTab } from './components/MetronomoTab';
import { ThemeModal } from './components/ThemeModal';
import { Theme, getSavedTheme, applyTheme, saveTheme } from './utils/theme';
import coelhoLogo from './assets/icoApp.png';
import './styles/metronomo.css';

export const App: React.FC = () => {
  const metronome = useMetronome();
  const device = useDevice();

  // Theme Management
  const [currentTheme, setCurrentTheme] = useState<Theme>(getSavedTheme);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const handleSelectTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    saveTheme(theme.id);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        metronome.toggleMetronome();
      } else if (e.code === 'ArrowUp' || e.code === 'ArrowRight') {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 1;
        metronome.setBpm(Math.min(260, metronome.bpm + step));
      } else if (e.code === 'ArrowDown' || e.code === 'ArrowLeft') {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 1;
        metronome.setBpm(Math.max(30, metronome.bpm - step));
      } else if (e.code === 'KeyT') {
        e.preventDefault();
        metronome.tapTempo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [metronome]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--app-bg, radial-gradient(circle at 50% 20%, #1a1b20 0%, #0c0d10 100%))',
        transition: 'background 0.3s ease'
      }}
    >
      {/* Top Navbar: Compact, sleek with reduced padding & height */}
      <header
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'var(--header-bg, rgba(18, 19, 23, 0.88))',
          backdropFilter: 'blur(12px)',
          padding: device.isMobile ? '0.35rem 0.75rem' : '0.45rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          minHeight: '44px'
        }}
      >
        {/* Left: Logo (Coelho) associado com "Metrônomo" */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={coelhoLogo}
            alt="Coelho VirtuaGuitar"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid var(--accent-color, #f59e0b)',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.35)',
              flexShrink: 0
            }}
          />
          <h1
            style={{
              fontSize: '1.02rem',
              fontWeight: 800,
              margin: 0,
              letterSpacing: '-0.02em',
              color: '#fff',
              lineHeight: 1
            }}
          >
            Metrônomo
          </h1>
        </div>

        {/* Right (final da div): Maelzel & Digital, Seletor de Tema e Atalhos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--accent-color, #f59e0b)',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              padding: '2px 8px',
              borderRadius: '6px',
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap'
            }}
          >
            Maelzel & Digital
          </span>

          {/* Theme Selector Button */}
          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '3px 8px',
              color: 'var(--colorB, #f3f4f6)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Alterar tema visual e cor do acabamento do metrônomo"
          >
            <i className="bi bi-palette-fill" style={{ color: 'var(--accent-color, #f59e0b)', fontSize: '0.85rem' }} />
            <span style={{ display: device.isMobile ? 'none' : 'inline' }}>Tema</span>
          </button>

          {/* Header Right: Shortcuts (visible on desktop/tablet) */}
          {!device.isMobile && (
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--colorD, #9ca3af)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '2px 6px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
              title="Atalhos: Espaço (Iniciar/Pausar), Setas (BPM), T (Tap Tempo)"
            >
              <i className="bi bi-keyboard" />
              <kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1px 3px', borderRadius: '3px' }}>Espaço</kbd>
              <kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1px 3px', borderRadius: '3px' }}>Setas</kbd>
              <kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1px 3px', borderRadius: '3px' }}>T</kbd>
            </span>
          )}
        </div>
      </header>

      {/* Main App Content */}
      <main
        style={{
          flex: 1,
          padding: device.isMobile ? '0.35rem' : '0.8rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <MetronomoTab
          bpm={metronome.bpm}
          setBpm={metronome.setBpm}
          pulsos={metronome.pulsos}
          setPulsos={metronome.setPulsos}
          metric={metronome.metric}
          setMetric={metronome.setMetric}
          timeSignatures={metronome.timeSignatures}
          figuraCount={metronome.figuraCount}
          setFiguraCount={metronome.setFiguraCount}
          isRunning={metronome.isRunning}
          onToggle={metronome.toggleMetronome}
          currentPulse={metronome.currentPulse}
          activeSubdivision={metronome.activeSubdivision}
          figuras={metronome.figuras}
          deviceType={device.deviceType}
          bellEnabled={metronome.bellEnabled}
          setBellEnabled={metronome.setBellEnabled}
          tapTempo={metronome.tapTempo}
          tempoName={metronome.tempoName}
        />
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '0.6rem 1rem',
          textAlign: 'center',
          fontSize: '0.74rem',
          color: 'rgba(255, 255, 255, 0.45)'
        }}
      >
        Desenvolvido por <strong>Bruno Daher</strong> • Maelzel Mechanical & Digital Precision Web Audio API
      </footer>

      {/* Theme Selection Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentThemeId={currentTheme.id}
        onSelectTheme={handleSelectTheme}
      />
    </div>
  );
};

export default App;
