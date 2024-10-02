/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007bff', // Color principal
        primaryhover: '#05AFF2', // Color hover
        secondary: '#1BA63D', // Color secundario
        secondaryhover: '#1BA63D', // Color secundario hover
      },
      fontFamily: {
        sans: ['sans-serif', 'Inter'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require('daisyui'),],
}

