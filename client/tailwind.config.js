/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",   // ✅ ADD THIS
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}