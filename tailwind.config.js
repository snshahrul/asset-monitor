/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#818cf8',
          800: '#6366f1',
          700: '#4f46e5',
        },
        dark: {
          900: '#0f1117',
          800: '#1a1d27',
          700: '#22252f',
          600: '#2a2d37',
        }
      }
    },
  },
  plugins: [],
}
