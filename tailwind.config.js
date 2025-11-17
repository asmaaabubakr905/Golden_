/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
       colors: {
        orange: {
          DEFAULT: '#E9A914',
          500: '#E9A914',
          600: '#C58A12', // ظِللْة أغمق لـ hover / active
        },
      },
    },
  },
  plugins: [],
};
