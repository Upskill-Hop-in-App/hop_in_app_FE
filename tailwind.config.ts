import colors, { amber } from 'tailwindcss/colors'
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'selector',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    fontFamily: {
      condensed: ['Sofia Sans Extra Condensed', 'sans-serif'],
      semiCondensed: ['Sofia Sans Semi Condensed', 'sans-serif'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.stone,
      yellow: colors.yellow,
      blue: colors.blue,
      indigo: colors.indigo,
      sky: colors.sky,
      amber: colors.amber,
      orange: colors.orange,
      emerald: colors.emerald,
      green: colors.green,
      rose: colors.rose,
      red: colors.red,
      primary: colors.green,
      secondary: colors.emerald,
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    backdropBlur: {
      xs: '3px',
      sm: '4px',
      md: '5px',
      lg: '12px',
      xl: '16x',
      '2xl': '24px',
      '3xl': '40px',
    },
    extend: {
      keyframes: {
        bounceCar: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(20)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        bounceCar: 'bounceCar 0.6s ease-in-out infinite',
        bounceSlow: 'bounceSlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
