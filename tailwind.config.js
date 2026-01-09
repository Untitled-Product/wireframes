/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        // Radix-inspired color tokens
        // Primary - Teal
        teal: {
          1: '#fafefd',
          2: '#f1fcfa',
          3: '#e7f9f5',
          4: '#d9f3ee',
          5: '#c7ebe5',
          6: '#afdfd7',
          7: '#8dcec3',
          8: '#53b9ab',
          9: '#0d9488',
          10: '#0f766e',
          11: '#0f766e',
          12: '#134e4a',
        },
        // Jade (Sidebar)
        jade: {
          8: '#27a383',
          9: '#29a383',
          12: '#1d3b31',
        },
        // Slate (Neutral)
        slate: {
          1: '#fbfcfd',
          2: '#f8fafc',
          3: '#f1f5f9',
          4: '#e2e8f0',
          5: '#cbd5e1',
          6: '#94a3b8',
          7: '#64748b',
          8: '#475569',
          9: '#334155',
          10: '#1e293b',
          11: '#0f172a',
          12: '#020617',
        },
        // Status Colors
        mint: {
          3: '#e6f7ed',
          4: '#d1fae5',
          5: '#a7f3d0',
          9: '#10b981',
          11: '#059669',
        },
        amber: {
          3: '#fff7e6',
          4: '#fef3c7',
          5: '#fde68a',
          9: '#f59e0b',
          10: '#d97706',
          11: '#b45309',
        },
        ruby: {
          4: '#fee2e2',
          5: '#fecaca',
          9: '#ef4444',
          11: '#dc2626',
        },
        // Ticket Type Colors
        indigo: {
          4: '#e0e7ff',
          5: '#c7d2fe',
          9: '#6366f1',
          10: '#4f46e5',
          11: '#4338ca',
        },
        pink: {
          3: '#fce7f3',
          4: '#fbcfe8',
          11: '#be185d',
        },
        crimson: {
          11: '#be123c',
        },
        orange: {
          3: '#fff7ed',
          4: '#ffedd5',
          9: '#f97316',
          11: '#c2410c',
        },
        violet: {
          4: '#ede9fe',
          11: '#6d28d9',
        },
        green: {
          4: '#dcfce7',
          11: '#15803d',
        },
        // Add-on Category Colors
        blue: {
          4: '#dbeafe',
          11: '#1d4ed8',
        },
        cyan: {
          4: '#cffafe',
          11: '#0e7490',
        },
        purple: {
          4: '#f3e8ff',
          11: '#7c3aed',
        },
        red: {
          4: '#fee2e2',
          11: '#dc2626',
        },
        // Iris (Indigo variant)
        iris: {
          9: '#5b5bd6',
        },
        // Sky
        sky: {
          11: '#0369a1',
        },
        // Grass
        grass: {
          11: '#2b8a3e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        wireframe: ['Caveat', 'Comic Sans MS', 'cursive'],
      },
      borderRadius: {
        DEFAULT: '6px',
      },
    },
  },
  plugins: [],
}
