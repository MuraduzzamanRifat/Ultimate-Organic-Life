import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#72b93e',
          dark:    '#4f8528',
          soft:    '#bde15a',
          pale:    '#eaf5d9',
          bg:      '#f0f7e4',
        },
        ink:    { DEFAULT: '#2b3140', 2: '#4a5260' },
        muted:  { DEFAULT: '#6b7380', 2: '#9aa1ad' },
        rule:   { DEFAULT: '#e5e8ec', soft: '#eef1f4' },
        paper:  '#ffffff',
        surface:'#f6f7f8',
        ochre:  '#fab82f',
        rose:   '#b75b89',
        sky:    '#2886b5',
        danger: '#c24242',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sm': '10px',
        DEFAULT: '14px',
        'md': '18px',
        'lg': '24px',
        'xl': '28px',
      },
      boxShadow: {
        card: '0 6px 18px rgba(43, 49, 64, .05)',
        cardHover: '0 14px 32px rgba(43, 49, 64, .1)',
        pop: '0 18px 40px rgba(79, 133, 40, .24)',
      },
      transitionTimingFunction: {
        ease: 'cubic-bezier(.2,.7,.3,1)',
      },
      keyframes: {
        floatLeaf: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        floatLeaf: 'floatLeaf 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
