/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./index.html"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          50: '#faf5ff',
          500: '#d946ef',
          600: '#c026d3',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712', // Obsidian
        }
      },
      backgroundImage: {
        'dots-pattern': "radial-gradient(circle, #80808020 1px, transparent 1px)",
        'mesh-gradient': "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(217, 70, 239, 0.15) 0, transparent 50%)",
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-accent': '0 0 20px rgba(217, 70, 239, 0.3)',
        'premium-primary': '0 10px 20px -5px rgba(79, 114, 229, 0.3)',
        'premium-accent': '0 10px 20px -5px rgba(217, 70, 239, 0.3)',
        'premium-primary-hover': '0 20px 30px -10px rgba(79, 114, 229, 0.4)',
        'premium-accent-hover': '0 20px 30px -10px rgba(217, 70, 239, 0.4)',
      }
    }
  },
  plugins: [],
}