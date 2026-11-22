/** EarthPulse AI design tokens. These mirror the variables, text styles and
 *  effect styles in the Figma file "EarthPulse AI - Complete Product". */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#FAFAF5',
        surface: '#FFFFFF',
        subtle: '#F3F6F0',
        muted: '#E7ECE5',
        inverse: '#193329',
        ink: {
          DEFAULT: '#193329',
          secondary: '#4A574E',
          placeholder: '#65736A',
          disabled: '#7A877C',
          inverse: '#FAFAF5',
          soft: '#B8C4B8',
        },
        line: { DEFAULT: '#D5DDD3', subtle: '#E7ECE5', strong: '#7A877C' },
        brand: {
          DEFAULT: '#16783C', hover: '#225C32', pressed: '#1B4527', subtle: '#EDF7E6',
          50: '#EDF7E6', 100: '#D5ECC3', 200: '#A9DB91', 300: '#6FC463', 400: '#34B056',
          500: '#1E9A4A', 600: '#16783C', 700: '#225C32', 800: '#1B4527', 900: '#12301F',
        },
        accent: { DEFAULT: '#84CC16', 100: '#EEF8D0', 300: '#C5E86C', 700: '#4D7C0F' },
        success: { bg: '#EDF7E6', fg: '#225C32', border: '#A9DB91' },
        warning: { bg: '#FFF6E0', fg: '#8A5300', border: '#FFE5A8' },
        danger: { DEFAULT: '#C62839', hover: '#9F1D2C', bg: '#FDECEE', fg: '#9F1D2C', border: '#F9CDD2' },
        info: { bg: '#E8F1FB', fg: '#174A85', border: '#C9DFF5' },
        viz: {
          transport: '#16783C', water: '#2F80C8', electricity: '#F5A524',
          food: '#8A6BC2', shopping: '#D9585F', waste: '#3FA796',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Junge', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['64px', { lineHeight: '72px', letterSpacing: '-0.5px' }],
        'display-l': ['48px', { lineHeight: '56px', letterSpacing: '-0.4px' }],
        'display-m': ['36px', { lineHeight: '44px', letterSpacing: '-0.3px' }],
        h1: ['32px', { lineHeight: '40px', letterSpacing: '-0.4px', fontWeight: '600' }],
        h2: ['24px', { lineHeight: '32px', letterSpacing: '-0.2px', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '28px', fontWeight: '600' }],
        h4: ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-l': ['18px', { lineHeight: '28px' }],
        'body-m': ['16px', { lineHeight: '24px' }],
        'body-s': ['14px', { lineHeight: '20px' }],
        'label-l': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'label-m': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-s': ['12px', { lineHeight: '16px', letterSpacing: '0.1px', fontWeight: '500' }],
        caption: ['12px', { lineHeight: '16px' }],
        overline: ['12px', { lineHeight: '16px', letterSpacing: '0.9px', fontWeight: '600' }],
        'metric-xl': ['44px', { lineHeight: '52px', letterSpacing: '-0.6px', fontWeight: '600' }],
        'metric-l': ['32px', { lineHeight: '40px', letterSpacing: '-0.4px', fontWeight: '600' }],
        'metric-m': ['24px', { lineHeight: '32px', letterSpacing: '-0.2px', fontWeight: '600' }],
      },
      borderRadius: { xs: '4px', sm: '6px', md: '10px', lg: '12px', xl: '20px' },
      boxShadow: {
        'elev-1': '0 1px 2px rgba(25,51,41,.08), 0 1px 1px rgba(25,51,41,.04)',
        'elev-2': '0 4px 12px rgba(25,51,41,.10), 0 1px 3px rgba(25,51,41,.04)',
        'elev-3': '0 12px 32px rgba(25,51,41,.14), 0 2px 6px rgba(25,51,41,.06)',
        focus: '0 0 0 3px rgba(30,154,74,.6)',
        'focus-danger': '0 0 0 3px rgba(198,40,57,.35)',
      },
      maxWidth: { content: '1112px', site: '1200px' },
    },
  },
  plugins: [],
};
