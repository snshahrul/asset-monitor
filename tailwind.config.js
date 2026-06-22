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
          900: '#818cf8', 800: '#6366f1', 700: '#4f46e5',
        },
        dark: {
          900: '#0f1117', 800: '#1a1d27', 700: '#22252f', 600: '#2a2d37', 500: '#3a3d47',
        },
        surface: {
          50:  '#f8f9fa', 100: '#f1f3f5', 200: '#e9ecef',
        }
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '4.5': '1.125rem',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
