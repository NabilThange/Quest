import type { Config } from 'tailwindcss';

const rgb = (token: string) => `rgb(var(--${token}-rgb) / <alpha-value>)`;
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: rgb('background'), foreground: rgb('foreground'),
        card: rgb('card'), primary: { DEFAULT: rgb('primary'), foreground: rgb('primary-foreground') },
        secondary: rgb('secondary'), 'muted-foreground': rgb('muted'),
        bg: { primary: rgb('background'), secondary: rgb('sidebar'), card: rgb('card'), elevated: rgb('secondary') },
        brand: { cyan: rgb('primary'), purple: '#735189', pink: '#99516d', gold: '#806021', green: '#426644', red: '#a84032' },
        text: { primary: rgb('foreground'), secondary: rgb('muted'), muted: rgb('muted') },
        border: { DEFAULT: rgb('border'), bright: rgb('border') },
        'hero-subtitle': 'hsl(var(--hero-subtitle))',
        red: { 400: '#a84032' }, orange: { 400: '#955014' }, yellow: { 400: '#7a601f' },
        green: { 400: '#426644' }, blue: { 400: '#345d8c' }, purple: { 400: '#735189' },
      },
      fontFamily: {
        sans: ['"Inter"', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        float: 'float 3s ease-in-out infinite', shimmer: 'shimmer 2s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'xp-fill': 'xp-fill 1s ease-out forwards', 'level-up': 'level-up 0.6s ease-out forwards',
      },
      keyframes: {
        'glow-pulse': { '0%, 100%': { boxShadow: '0 4px 10px #0000000d' }, '50%': { boxShadow: '0 4px 18px #0000001a' } },
        'xp-fill': { from: { width: 'var(--xp-from)' }, to: { width: 'var(--xp-to)' } },
        'level-up': { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.15)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
export default config;
