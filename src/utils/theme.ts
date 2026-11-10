export interface Theme {
  id: string;
  name: string;
  subtitle: string;
  swatchColors: [string, string, string]; // [Cabinet, Accent/Gold, Dial]
  properties: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: 'walnut',
    name: 'Nogueira Clássica',
    subtitle: 'Madeira Clássica & Latão Dourado',
    swatchColors: ['#3d2314', '#dfba62', '#18191d'],
    properties: {
      '--app-bg': 'radial-gradient(circle at 50% 20%, #1a1b20 0%, #0c0d10 100%)',
      '--header-bg': 'rgba(18, 19, 23, 0.88)',
      '--accent-color': '#f59e0b',
      '--metro-case-bg': 'linear-gradient(145deg, #3d2314 0%, #22120a 50%, #150a05 100%)',
      '--metro-case-border': '#5a3821',
      '--metro-cap-bg': 'linear-gradient(180deg, #4f2e1a 0%, #2f190d 100%)',
      '--metro-cap-border': '#6b4328',
      '--metro-brand-color': '#dfba62',
      '--metro-subtext-color': '#9d8048',
      '--metro-dial-bg': 'linear-gradient(180deg, #1f1b16 0%, #2a241d 50%, #181512 100%)',
      '--metro-dial-border': '#4a3825',
      '--metro-scale-color': 'rgba(223, 186, 98, 0.75)',
      '--metro-scale-active-color': '#ffd700',
      '--metro-scale-active-bg': 'rgba(223, 186, 98, 0.22)',
      '--metro-pendulum-arm': 'linear-gradient(90deg, #bfa04a, #ffefa0, #8f742c)',
      '--metro-weight-bg': 'linear-gradient(135deg, #e3be5b 0%, #fff7be 45%, #a88426 100%)',
      '--metro-weight-border': '#694d0c',
      '--metro-weight-text': '#2c1b02',
      '--metro-base-bg': 'linear-gradient(180deg, #2a150b 0%, #150904 100%)',
      '--metro-base-border': '#5a3821',
      '--metro-play-btn': 'linear-gradient(145deg, #2563eb, #1d4ed8)',
      '--metro-tempo-color': '#dfba62'
    }
  },
  {
    id: 'mahogany',
    name: 'Mogno Imperial',
    subtitle: 'Madeira Nobre Avermelhada & Ouro Rosé',
    swatchColors: ['#541410', '#fca5a5', '#160809'],
    properties: {
      '--app-bg': 'radial-gradient(circle at 50% 20%, #251014 0%, #0d0507 100%)',
      '--header-bg': 'rgba(26, 12, 16, 0.88)',
      '--accent-color': '#ef4444',
      '--metro-case-bg': 'linear-gradient(145deg, #541410 0%, #350c09 50%, #1d0504 100%)',
      '--metro-case-border': '#7f1d1d',
      '--metro-cap-bg': 'linear-gradient(180deg, #6b1d18 0%, #3b0e0b 100%)',
      '--metro-cap-border': '#991b1b',
      '--metro-brand-color': '#fca5a5',
      '--metro-subtext-color': '#f87171',
      '--metro-dial-bg': 'linear-gradient(180deg, #261114 0%, #30161a 50%, #180b0d 100%)',
      '--metro-dial-border': '#5c1d24',
      '--metro-scale-color': 'rgba(254, 202, 202, 0.8)',
      '--metro-scale-active-color': '#fee2e2',
      '--metro-scale-active-bg': 'rgba(239, 68, 68, 0.25)',
      '--metro-pendulum-arm': 'linear-gradient(90deg, #f87171, #fecaca, #dc2626)',
      '--metro-weight-bg': 'linear-gradient(135deg, #fca5a5 0%, #ef4444 50%, #991b1b 100%)',
      '--metro-weight-border': '#7f1d1d',
      '--metro-weight-text': '#450a0a',
      '--metro-base-bg': 'linear-gradient(180deg, #450f0c 0%, #220605 100%)',
      '--metro-base-border': '#661510',
      '--metro-play-btn': 'linear-gradient(145deg, #dc2626, #b91c1c)',
      '--metro-tempo-color': '#fca5a5'
    }
  },
  {
    id: 'oak',
    name: 'Carvalho Claro',
    subtitle: 'Madeira Clara Vintage & Latão Quente',
    swatchColors: ['#784c28', '#ffd166', '#1a140f'],
    properties: {
      '--app-bg': 'radial-gradient(circle at 50% 20%, #221a12 0%, #0d0a07 100%)',
      '--header-bg': 'rgba(25, 19, 14, 0.88)',
      '--accent-color': '#eab308',
      '--metro-case-bg': 'linear-gradient(145deg, #784c28 0%, #523117 50%, #321c0b 100%)',
      '--metro-case-border': '#9a6335',
      '--metro-cap-bg': 'linear-gradient(180deg, #8c582f 0%, #5d3618 100%)',
      '--metro-cap-border': '#b07440',
      '--metro-brand-color': '#ffd166',
      '--metro-subtext-color': '#d4a34b',
      '--metro-dial-bg': 'linear-gradient(180deg, #2b221a 0%, #382c21 50%, #1f1812 100%)',
      '--metro-dial-border': '#694e36',
      '--metro-scale-color': 'rgba(255, 222, 140, 0.8)',
      '--metro-scale-active-color': '#fff0b3',
      '--metro-scale-active-bg': 'rgba(255, 209, 102, 0.25)',
      '--metro-pendulum-arm': 'linear-gradient(90deg, #ffd166, #fff4cc, #c7982e)',
      '--metro-weight-bg': 'linear-gradient(135deg, #ffe082 0%, #ffd166 50%, #b28724 100%)',
      '--metro-weight-border': '#8c6713',
      '--metro-weight-text': '#382604',
      '--metro-base-bg': 'linear-gradient(180deg, #59351a 0%, #331d0d 100%)',
      '--metro-base-border': '#734522',
      '--metro-play-btn': 'linear-gradient(145deg, #d97706, #b45309)',
      '--metro-tempo-color': '#ffd166'
    }
  },
  {
    id: 'ebony',
    name: 'Ébano Piano Noir',
    subtitle: 'Preto Laqueado Steinway & Cromo Prata',
    swatchColors: ['#27272a', '#e2e8f0', '#0f0f12'],
    properties: {
      '--app-bg': 'radial-gradient(circle at 50% 20%, #18181b 0%, #09090b 100%)',
      '--header-bg': 'rgba(18, 18, 20, 0.88)',
      '--accent-color': '#38bdf8',
      '--metro-case-bg': 'linear-gradient(145deg, #27272a 0%, #18181b 50%, #09090b 100%)',
      '--metro-case-border': '#3f3f46',
      '--metro-cap-bg': 'linear-gradient(180deg, #333338 0%, #1f1f23 100%)',
      '--metro-cap-border': '#52525b',
      '--metro-brand-color': '#f1f5f9',
      '--metro-subtext-color': '#94a3b8',
      '--metro-dial-bg': 'linear-gradient(180deg, #141417 0%, #1e1e24 50%, #0d0d10 100%)',
      '--metro-dial-border': '#3f3f46',
      '--metro-scale-color': 'rgba(226, 232, 240, 0.75)',
      '--metro-scale-active-color': '#38bdf8',
      '--metro-scale-active-bg': 'rgba(56, 189, 248, 0.2)',
      '--metro-pendulum-arm': 'linear-gradient(90deg, #cbd5e1, #ffffff, #64748b)',
      '--metro-weight-bg': 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 50%, #64748b 100%)',
      '--metro-weight-border': '#475569',
      '--metro-weight-text': '#0f172a',
      '--metro-base-bg': 'linear-gradient(180deg, #222227 0%, #121215 100%)',
      '--metro-base-border': '#3f3f46',
      '--metro-play-btn': 'linear-gradient(145deg, #0284c7, #0369a1)',
      '--metro-tempo-color': '#38bdf8'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight Cobalt',
    subtitle: 'Guitar Sunburst Azul & Ciano Elétrico',
    swatchColors: ['#1e293b', '#38bdf8', '#0b1329'],
    properties: {
      '--app-bg': 'radial-gradient(circle at 50% 20%, #0f172a 0%, #020617 100%)',
      '--header-bg': 'rgba(15, 23, 42, 0.88)',
      '--accent-color': '#0ea5e9',
      '--metro-case-bg': 'linear-gradient(145deg, #1e293b 0%, #0f172a 50%, #020617 100%)',
      '--metro-case-border': '#334155',
      '--metro-cap-bg': 'linear-gradient(180deg, #273852 0%, #131d2e 100%)',
      '--metro-cap-border': '#3b82f6',
      '--metro-brand-color': '#38bdf8',
      '--metro-subtext-color': '#60a5fa',
      '--metro-dial-bg': 'linear-gradient(180deg, #0b1329 0%, #13203f 50%, #070d1e 100%)',
      '--metro-dial-border': '#1e3a5f',
      '--metro-scale-color': 'rgba(186, 230, 253, 0.75)',
      '--metro-scale-active-color': '#38bdf8',
      '--metro-scale-active-bg': 'rgba(14, 165, 233, 0.25)',
      '--metro-pendulum-arm': 'linear-gradient(90deg, #38bdf8, #e0f2fe, #0284c7)',
      '--metro-weight-bg': 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 50%, #0369a1 100%)',
      '--metro-weight-border': '#0284c7',
      '--metro-weight-text': '#082f49',
      '--metro-base-bg': 'linear-gradient(180deg, #18243b 0%, #0b1120 100%)',
      '--metro-base-border': '#1e293b',
      '--metro-play-btn': 'linear-gradient(145deg, #0284c7, #0369a1)',
      '--metro-tempo-color': '#38bdf8'
    }
  },
  {
    id: 'emerald',
    name: 'Esmeralda Britânica',
    subtitle: 'Verde Esmeralda Imperial & Ouro Nobre',
    swatchColors: ['#184129', '#6ee7b7', '#0b2114'],
    properties: {
      '--app-bg': 'radial-gradient(circle at 50% 20%, #10281b 0%, #05120a 100%)',
      '--header-bg': 'rgba(10, 28, 18, 0.88)',
      '--accent-color': '#10b981',
      '--metro-case-bg': 'linear-gradient(145deg, #184129 0%, #0e2719 50%, #05130b 100%)',
      '--metro-case-border': '#22633e',
      '--metro-cap-bg': 'linear-gradient(180deg, #215436 0%, #102e1c 100%)',
      '--metro-cap-border': '#2e8553',
      '--metro-brand-color': '#6ee7b7',
      '--metro-subtext-color': '#34d399',
      '--metro-dial-bg': 'linear-gradient(180deg, #0b2114 0%, #143521 50%, #08170e 100%)',
      '--metro-dial-border': '#1e5334',
      '--metro-scale-color': 'rgba(167, 243, 208, 0.75)',
      '--metro-scale-active-color': '#6ee7b7',
      '--metro-scale-active-bg': 'rgba(16, 185, 129, 0.25)',
      '--metro-pendulum-arm': 'linear-gradient(90deg, #d4af37, #fff2a8, #aa820a)',
      '--metro-weight-bg': 'linear-gradient(135deg, #f7df8f 0%, #cfa63a 50%, #876214 100%)',
      '--metro-weight-border': '#694d0c',
      '--metro-weight-text': '#2c1b02',
      '--metro-base-bg': 'linear-gradient(180deg, #163a25 0%, #091c11 100%)',
      '--metro-base-border': '#225838',
      '--metro-play-btn': 'linear-gradient(145deg, #059669, #047857)',
      '--metro-tempo-color': '#6ee7b7'
    }
  }
];

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  Object.entries(theme.properties).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });
  root.setAttribute('data-metronome-theme', theme.id);
}

export function getSavedTheme(): Theme {
  const savedId = typeof window !== 'undefined' ? localStorage.getItem('metronome_theme') : null;
  const found = THEMES.find((t) => t.id === savedId);
  return found || THEMES[0];
}

export function saveTheme(themeId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('metronome_theme', themeId);
  }
}
