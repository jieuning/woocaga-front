/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          'primary': '#C1835C',
          'ivory': '#E9DACB',
          'black': '#162220',
        },
        fontFamily: {
          'spoqa': ['Spoqa Han Sans Neo', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }