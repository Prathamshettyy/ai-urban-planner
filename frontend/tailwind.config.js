/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-blue': {
          light: '#3b82f6',
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },
        'brand-gray': {
          light: '#f3f4f6',
          DEFAULT: '#e5e7eb',
          dark: '#6b7280',
        }
      },
      keyframes: {
        'pulse-bg': {
          '0%, 100%': { backgroundColor: 'rgba(59, 130, 246, 0.1)' },
          '50%': { backgroundColor: 'rgba(59, 130, 246, 0.25)' },
        }
      },
      animation: {
        'pulse-bg': 'pulse-bg 3s infinite',
      }
    },
  },
  plugins: [],
};
