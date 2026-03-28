export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Distinctive Financial Aesthetic
        primary: '#0d7377',      // Deep teal - sophisticated, financial
        accent: '#FF6584',       // Vibrant coral - for spending/alerts
        secondary: '#F4A261',    // Golden amber - for budgets/success
        success: '#06a77d',      // Emerald green
        danger: '#FF6584',       // Matches accent
        warning: '#F4A261',      // Matches secondary
        dark: '#1a1a2e',         // Deep charcoal
        light: '#FBF9F4',        // Warm off-white
        'text-primary': '#1a1a2e',
        'text-secondary': '#5a5a6f',
        'bg-subtle': '#f5f3f0',  // Subtle background
      },
      fontFamily: {
        // Distinctive Typography
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Syne"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      animation: {
        'slide-in': 'slideIn 0.6s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'flow': 'flow 1s ease-in-out',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flow: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      boxShadow: {
        'card': '0 2px 8px rgba(13, 115, 119, 0.08)',
        'card-hover': '0 12px 24px rgba(13, 115, 119, 0.12)',
        'elevation': '0 4px 16px rgba(26, 26, 46, 0.1)',
      },
    },
  },
  plugins: [],
};
