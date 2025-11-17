/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
       colors: {
        orange: {
          300: '#F8EBC2', // أخف
          400: '#F1D98A',
          DEFAULT: '#E7BC58', // ذهبى أخف (أساس)
          500: '#E7BC58',
          600: '#C8A255', // أغمق للـ hover/active
          700: '#9A7A3F', // ظلال أعمق إضافية
        },
      },
    },
  },
  plugins: [],
};
