/** @type {import('tailwindcss').Config} */
export default {
  plugins: [
        require('tailwind-scrollbar-hide')
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Helvetica Neue"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
}