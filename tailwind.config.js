/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",      // Busca en la raíz (App.tsx, etc)
    "./components/**/*.{js,ts,jsx,tsx}", // Busca en componentes
    "./store/**/*.{js,ts,jsx,tsx}"      // Busca en el store
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
