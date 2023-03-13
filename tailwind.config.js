/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.{html,js}",
    "tailwind.config.js",
    "index.html"
  ],
  theme: {
    extend: {
      colors:{
        primary: '#fcfcfc',
        secondary: '#ac4638',
        tertiary: '#925558',
        color_4: '#786479',
        color_5: '#5e739a'
      },
    },
  },
  plugins: [
    
  ],
}
