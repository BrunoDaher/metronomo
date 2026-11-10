# ⏱️ Metrônomo Interativo (Maelzel & Digital)

Aplicativo de metrônomo de alta precisão com interface mecânica clássica Maelzel e console digital moderno com controle de compassos, subdivisões rítmicas e detecção de andamento via Tap Tempo.

🔗 **Acesse online:** [https://brunodaher.github.io/metronomo/](https://brunodaher.github.io/metronomo/)

---

## ✨ Funcionalidades

- **Maelzel Analógico Mecânico:**
  - Pêndulo oscilante com animação física precisa baseada em BPM.
  - Peso deslizante interativo arrastável diretamente na haste.
  - Escala clássica com marcações em italiano (*Largo, Andante, Moderato, Allegro, Presto...*).
  - Sino de metal no 1º tempo comutável (Downbeat Bell Chime).

- **Console Digital & Subdivisões:**
  - Seletor de compassos: 1, 2, 3, 4 e 6/8.
  - Subdivisões rítmicas (Semínima, Colcheia, Semicolcheia, Fusa, Semifusa).
  - Mostrador de lâmpadas dinâmicas e barras de subdivisão animadas no tempo exato.
  - Áudio via Web Audio API com clique acústico de bloco de madeira e beep digital.
  - **Tap Tempo:** detecção instantânea do andamento clicando no ritmo.

- **Atalhos de Teclado:**
  - `Espaço`: Iniciar / Pausar
  - `↑` / `→`: +1 BPM (`Shift`: +5 BPM)
  - `↓` / `←`: -1 BPM (`Shift`: -5 BPM)
  - `T`: Tap Tempo

---

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** (Build ultrarrápido)
- **Web Audio API** (Síntese de áudio de alta precisão)
- **Bootstrap Icons**
- **GitHub Actions & GitHub Pages**

---

## 🚀 Como rodar localmente

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

---

Desenvolvido por **[Bruno Daher](https://github.com/brunodaher)**.
