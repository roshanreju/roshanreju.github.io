/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        canvas: '#050507',
        surface: '#0c0c10',
        elevated: '#14141b',
      },
      backgroundImage: {
        'grid-subtle':
          'linear-gradient(to right, rgba(239,68,68,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(239,68,68,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-subtle': '52px 52px',
      },
    },
  },
  plugins: [],
};
