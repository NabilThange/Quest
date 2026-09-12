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
        red: { 400: '#a84032' }, orange: { 400: '#955014' }, yellow: { 400: '#7a601f' },
        green: { 400: '#426644' }, blue: { 400: '#345d8c' }, purple: { 400: '#735189' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: { float: 'float 3s ease-in-out infinite', shimmer: 'shimmer 2s linear infinite' },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
export default config;
