/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#EAE2D0',
        surface: '#F4EEDF',
        surface2: '#FBF8F0',
        ink: '#231F2E',
        inksoft: '#5B5670',
        indigo: '#28345E',
        indigodeep: '#1B233F',
        brass: '#A9812F',
        rust: '#A6472F',
        line: '#D8CCAD',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
      },
    },
  },
  plugins: [],
};
