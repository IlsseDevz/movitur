/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Azul vibrante principal
          dark: '#1d4ed8',    // Tom mais escuro para hover/fundos
          light: '#3b82f6',   // Tom mais claro para destaques
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