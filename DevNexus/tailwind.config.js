/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        bg: '#0d1117',
        surface: '#161b22',
        card: '#1c2128',
        border: '#30363d',
        primary: '#3b82f6',
        'primary-hover': '#60a5fa',
        'text-main': '#e6edf3',
        'text-muted': '#8b949e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        logo: ['MonteCarlo', 'cursive'],
      },
      boxShadow: {
        'primary-glow': '0 4px 20px rgba(59, 130, 246, 0.15)',
      }
    },
  },
  plugins: [],
}