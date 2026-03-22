/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#131313',
        surface0: '#0e0e0e',
        surface: '#1c1b1b',
        surface2: '#201f1f',
        surface3: '#2a2a2a',
        border: '#353534',
        border2: '#424754',
        accent: '#4d8eff',
        accent2: '#adc6ff',
        success: '#adc6ff',
        error: '#ffb4ab',
        warn: '#ffb786',
        t1: '#e5e2e1',
        t2: '#c2c6d6',
        t3: '#8c909f',
        t4: '#5f646f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: '0.7rem',
        sm: '0.8rem',
        base: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
}
