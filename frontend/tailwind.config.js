/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#41B8D6', // Color principal
        primaryhover: '#3690d9', // Color hover
        secondary: '#1BA63D', // Color secundario
        secondaryhover: '#1BA63D', // Color secundario hover
      },
      fontFamily: {
        sans: ['sans-serif', 'Inter'],
        serif: ['Merriweather', 'serif'],
      },
      animation: {
        'electric': 'electricity 50s infinite',  // Define el nombre de la animación
      },
      keyframes: {
        electricity: {
          '0%, 100%': { textShadow: '0 0 1px #1BA63D, 0 0 1px #1BA63D, 0 0 1px #1BA63D, 0 0 1px #1BA63D' },
          '50%': { textShadow: '0 0 1px #41B8D6, 0 0 1px #41B8D6, 0 0 1px #41B8D6, 0 0 80px #41B8D6' },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require('daisyui'),],
  daisyui: {
    themes: ["light"],
    darkTheme: "light",
  },
}

