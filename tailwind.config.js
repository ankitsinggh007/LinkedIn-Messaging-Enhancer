/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./entrypoints/**/*.{ts,tsx}",
    "./entrypoints/popup/**/*.{html,ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
