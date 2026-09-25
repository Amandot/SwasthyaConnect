export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff8ff',
          100: '#dceeff',
          200: '#b8ddff',
          300: '#83c4ff',
          400: '#47a5f5',
          500: '#1f86d6',
          600: '#1268b1',
          700: '#11548f',
          800: '#134675',
          900: '#143c5f',
          950: '#0b2942'
        },
        canvas: {
          50: '#f8fbfd',
          100: '#f1f6fa',
          200: '#e7eef5',
          DEFAULT: '#f5f9fc'
        },
        ink: {
          DEFAULT: '#132638',
          50: '#f5f8fa',
          100: '#e8eef3',
          200: '#cbd7e1',
          300: '#9fb0bf',
          400: '#6e8395',
          500: '#50687b',
          600: '#3c5367',
          700: '#2e4254',
          800: '#203343',
          900: '#132638',
          950: '#0b1825'
        },
        brand: {
          background: '#f5f9fc',
          success: '#168a62',
          emergency: '#d92d20',
          text: '#132638'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 35, 55, 0.03), 0 12px 32px -22px rgba(15, 35, 55, 0.28)',
        float: '0 24px 70px -34px rgba(15, 35, 55, 0.38)',
        soft: '0 16px 45px -28px rgba(15, 35, 55, 0.3)',
        premium: '0 28px 80px -38px rgba(18, 104, 177, 0.42)'
      }
    }
  },
  plugins: []
};
