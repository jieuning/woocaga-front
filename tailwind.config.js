/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#C1835C',
        lightbrown: '#E6C6A6',
        ivory: '#F7F2ED',
        black: '#162220',
      },
      fontFamily: {
        spoqa: ['Spoqa Han Sans Neo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
