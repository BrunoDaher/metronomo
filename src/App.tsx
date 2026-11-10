import React, { useEffect } from 'react';
import { useMetronome } from './hooks/useMetronome';
import { useDevice } from './hooks/useDevice';
import { MetronomoTab } from './components/MetronomoTab';
import './styles/metronomo.css';

export const App: React.FC = () => {
  const metronome = useMetronome();
  const device = useDevice();

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'radial-gradient(circle at 50% 20%, #1a1b20 0%, #0c0d10 100%)' }}>
      {/* Top Navbar */}
      <header
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(18, 19, 23, 0.85)',
          backdropFilter: 'blur(12px)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 900,
              boxShadow: '0 2px 10px rgba(245, 158, 11, 0.35)'
            }}
          >
            <i className="bi bi-stopwatch-fill" style={{ fontSize: '1rem' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#fff' }}>
              Metrônomo <span style={{ color: '#f59e0b', fontSize: '0.78rem', fontWeight: 600, border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1px 6px', borderRadius: '4px', marginLeft: '4px' }}>Maelzel & Digital</span>
            </h1>
          </div>
        </div>

        {/* Header Right: Shortcuts (visible on tablet and desktop) */}
        {!device.isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--colorD)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
              title="Atalhos: Espaço (Iniciar/Pausar), Setas (BPM), T (Tap Tempo)"
            >
              <i className="bi bi-keyboard" />
              <kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1px 4px', borderRadius: '3px' }}>Espaço</kbd>
              <kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1px 4px', borderRadius: '3px' }}>Setas</kbd>
              <kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1px 4px', borderRadius: '3px' }}>T</kbd>
            </span>
          </div>
        )}
      </header>

      {/* Main App Content */}
      <main style={{ flex: 1, padding: device.isMobile ? '0.5rem' : '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MetronomoTab
          bpm={metronome.bpm}
          setBpm={metronome.setBpm}
          pulsos={metronome.pulsos}
          setPulsos={metronome.setPulsos}
          figuraCount={metronome.figuraCount}
          setFiguraCount={metronome.setFiguraCount}
          isRunning={metronome.isRunning}
          onToggle={metronome.toggleMetronome}
          currentPulse={metronome.currentPulse}
          activeSubdivision={metronome.activeSubdivision}
          figuras={metronome.figuras}
          deviceType={device.deviceType}
          soundType={metronome.soundType}
          setSoundType={metronome.setSoundType}
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
          padding: '1rem',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: 'rgba(255, 255, 255, 0.45)'
        }}
      >
        Desenvolvido por <strong>Bruno Daher</strong> • Maelzel Mechanical & Digital Precision Web Audio API
      </footer>
    </div>
  );
};
export default App;

