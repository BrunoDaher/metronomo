import React from 'react';
import { THEMES, Theme } from '../utils/theme';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onSelectTheme: (theme: Theme) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'var(--fundoE, #141518)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-palette-fill" style={{ color: 'var(--accent-color, #f59e0b)', fontSize: '1.15rem' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                Temas do Metrônomo
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--colorD, #9ca3af)' }}>
                Escolha o acabamento do gabinete e da interface
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--colorD, #9ca3af)',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
              lineHeight: 1
            }}
            title="Fechar"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Theme List / Grid */}
        <div
          style={{
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}
        >
          {THEMES.map((theme) => {
            const isActive = theme.id === currentThemeId;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onSelectTheme(theme)}
                style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  border: isActive
                    ? '2px solid var(--accent-color, #f59e0b)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s ease',
                  boxShadow: isActive ? '0 0 16px rgba(245, 158, 11, 0.25)' : 'none',
                  position: 'relative'
                }}
              >
                {/* Visual Swatch representing the Metronome Cabinet */}
                <div
                  style={{
                    height: '36px',
                    borderRadius: '8px',
                    display: 'flex',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0, 0.4)',
                    boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {/* Cabinet wood */}
                  <div
                    style={{
                      flex: 2,
                      background: theme.swatchColors[0],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '4px',
                        height: '75%',
                        background: theme.swatchColors[1],
                        borderRadius: '2px'
                      }}
                    />
                  </div>
                  {/* Dial */}
                  <div
                    style={{
                      flex: 3,
                      background: theme.swatchColors[2],
                      borderLeft: `1px solid ${theme.swatchColors[1]}`,
                      borderRight: `1px solid ${theme.swatchColors[1]}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '2px',
                        background: theme.swatchColors[1]
                      }}
                    />
                  </div>
                  {/* Accent */}
                  <div style={{ flex: 1, background: theme.swatchColors[1] }} />
                </div>

                {/* Theme Name & Subtitle */}
                <div>
                  <div
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: isActive ? '#fff' : 'var(--colorB, #f3f4f6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{theme.name}</span>
                    {isActive && (
                      <i
                        className="bi bi-check-circle-fill"
                        style={{ color: 'var(--accent-color, #f59e0b)', fontSize: '0.9rem' }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--colorD, #9ca3af)',
                      marginTop: '2px'
                    }}
                  >
                    {theme.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              background: 'var(--accent-color, #f59e0b)',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.82rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
