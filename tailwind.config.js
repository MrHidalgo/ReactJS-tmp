/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        '2xl': {max: '1439px'}, // @media screen and (max-width: 1439px)
        xl: {max: '1279px'}, // @media screen and (max-width: 1279px)
        lg: {max: '1023px'}, // @media screen and (max-width: 1023px)
        md: {max: '767px'}, // @media screen and (max-width: 767px)
      },
    },
  },
  plugins: [],
}
