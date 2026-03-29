/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
      },
      colors: {
        forest: { 50: '#f0f7f4', 100: '#d9ede6', 200: '#b3dace', 300: '#7fc0ab', 400: '#4fa58a', 500: '#2d8a6e', 600: '#1e6e56', 700: '#175742', 800: '#124433', 900: '#0d3327' },
        navy:   { 50: '#f0f4fb', 100: '#dce6f5', 200: '#b9ceeb', 300: '#8aaedd', 400: '#5c8bcd', 500: '#3a6dba', 600: '#2a55a0', 700: '#224282', 800: '#1c3469', 900: '#152756' },
        slate:  { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' },
        cream:  { 50: '#fdfcf9', 100: '#faf8f2', 200: '#f4f0e4' },
        amber:  { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
        rose:   { 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48' },
      },
    },
  },
  plugins: [],
};
