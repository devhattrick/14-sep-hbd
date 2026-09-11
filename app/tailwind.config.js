/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sky: {
          soft: '#8ED8FF',
          deep: '#5FBFF0',
        },
        blush: {
          soft: '#FFB6D9',
          deep: '#FF5C9A',
        },
        cream: '#FFF8FC',
        ink: '#374151',
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Noto Serif Thai"', 'Georgia', 'serif'],
        body: ['Poppins', '"Noto Sans Thai"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', '"Noto Serif Thai"', 'cursive'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(0.8)' },
          '50%': { opacity: '0.9', transform: 'scale(1.15)' },
        },
        flicker: {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1) translateY(0)', opacity: '1' },
          '25%': { transform: 'scaleY(1.12) scaleX(0.94) translateY(-1px)', opacity: '0.92' },
          '50%': { transform: 'scaleY(0.94) scaleX(1.06) translateY(1px)', opacity: '1' },
          '75%': { transform: 'scaleY(1.06) scaleX(0.97) translateY(-1px)', opacity: '0.95' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        flicker: 'flicker 0.45s ease-in-out infinite',
        shimmer: 'shimmer 8s ease infinite',
      },
    },
  },
  plugins: [],
}
