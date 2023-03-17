/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'heldane': ['Heldane Regular', 'serif'],
        'heldane-bold': ['Heldane Bold', 'serif'],
        'inter': ['Inter', 'sans-serif']
      },
      colors: {
        indigo: '#3E3BC9',
        cornflower: '#7275F0',
        ash: '#767684',
        $red: '#D90100',
        midnight: '#0C0C3C'
      }
    },
  },
  plugins: [
    require("@thoughtbot/tailwindcss-aria-attributes"),
    require('tailwind-scrollbar')
  ],
}
