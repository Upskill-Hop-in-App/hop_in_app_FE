import colors from 'tailwindcss/colors'
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'selector',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.stone,
      yellow: colors.yellow,
      blue: colors.blue,
      emerald: colors.emerald,
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
    extend: {},
  },
  plugins: [],
}

export default config
