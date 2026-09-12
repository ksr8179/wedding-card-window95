/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
    './layouts/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: '#7A1418',
          deep: '#5C0E12',
          rich: '#8B1A20',
          soft: '#A42A32',
        },
        paper: {
          DEFAULT: '#F7F1E8',
          warm: '#FBF7F0',
          lace: '#FFFcf7',
        },
        ink: {
          DEFAULT: '#2B2420',
          muted: '#5C534C',
          faint: '#8A8178',
        },
        sky: {
          photo: '#8EC6E0',
        },
        rose: {
          bouquet: '#C23B32',
        },
      },
      fontFamily: {
        script: ['"Homemade Apple"', '"Great Vibes"', 'cursive'],
        serif: ['"Cormorant Garamond"', '"Nanum Myeongjo"', 'serif'],
        sans: ['Jost', 'ui-sans-serif', 'system-ui'],
        myeongjo: ['"Nanum Myeongjo"', 'serif'],
      },
      maxWidth: {
        phone: '28rem',
      },
      letterSpacing: {
        invitation: '0.22em',
      },
      boxShadow: {
        phone: '0 25px 60px -12px rgba(48, 8, 10, 0.55)',
        paper: '0 8px 30px rgba(90, 20, 24, 0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s ease-out both',
        'soft-in': 'soft-in 1.1s ease-out both',
      },
    },
  },
  plugins: [],
}
