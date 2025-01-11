/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f4f4f9',
        primaryText: '#2f4550',
        secondaryText: '#b8dbd9',
        accent: '#b8dbd9',
      },
    },
  },
  plugins: [],
}

