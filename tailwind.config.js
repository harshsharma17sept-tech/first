/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        editorial: '#E4E4E4',
        'safety-orange': '#EC783B',
        'orange-dark': '#D25F24',
        'black-slate': '#1B1B1B',
        'black-deep': '#0E0E0E',
        'border-editorial': '#D7D7D7',
        'risk-red': '#D32F2F',
        'risk-green': '#1B8A44',
      }
    },
  },
  plugins: [],
}
