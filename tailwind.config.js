/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        workspace: {
          subtle: 'var(--app-bg-subtle)',
          main: 'var(--app-bg-main)',
          secondary: 'var(--app-bg-secondary)',
          borderSubtle: 'var(--app-border-subtle)',
          borderDefault: 'var(--app-border-default)',
          textMain: 'var(--app-text-main)',
          textMuted: 'var(--app-text-muted)',
          accent: 'var(--app-accent)',
          cellBg: 'var(--app-cell-code-bg)',
          promptIn: 'var(--app-prompt-in)',
          promptOut: 'var(--app-prompt-out)',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
