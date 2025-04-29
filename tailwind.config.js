/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'primary-green': '#1f7a1f',
        'dark-green': '#002200',
        'light-green': '#d0f0c0',
        'card-bg': '#0a1a0a',
      },
    },
  },
  plugins: [],
}