/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d6e6e',
          dark: '#094d4d',
          light: '#14a3a3',
        },
        accent: {
          DEFAULT: '#f4a261',
          hover: '#e76f51',
        },
      },
    },
  },
  plugins: [],
};
