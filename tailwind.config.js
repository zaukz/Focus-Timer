/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: 'rgb(var(--cream) / <alpha-value>)',
        mist: 'rgb(var(--mist) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-deep': 'rgb(var(--accent-deep) / <alpha-value>)',
        void: 'rgb(var(--void) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        ultra: '0.35em',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        riseIn: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -1.5%, 0) scale(1.04)' },
        },
        flicker: {
          '0%, 100%': { opacity: '0.75', transform: 'scale(1)' },
          '35%': { opacity: '0.95', transform: 'scale(1.03)' },
          '70%': { opacity: '0.62', transform: 'scale(0.99)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.85' },
        },
        wave: {
          '0%': { transform: 'translateX(-6%) scaleY(1)' },
          '50%': { transform: 'translateX(6%) scaleY(1.04)' },
          '100%': { transform: 'translateX(-6%) scaleY(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out both',
        riseIn: 'riseIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        drift: 'drift 26s ease-in-out infinite',
        flicker: 'flicker 4.5s ease-in-out infinite',
        breathe: 'breathe 7s ease-in-out infinite',
        wave: 'wave 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
