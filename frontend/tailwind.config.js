/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      colors: {
        space: {
          900: '#0B0B13',
          800: '#14142B',
          700: '#1C1C3F',
          border: 'rgba(255, 255, 255, 0.1)'
        },
        emotion: {
          angry: '#FF453A',
          sad: '#0A84FF',
          happy: '#FFD60A',
          neutral: '#98989D'
        }
      }
    },
  },
  plugins: [],
}
