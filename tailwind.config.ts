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
      gray: colors.neutral,
      blue: colors.blue,
      emerald: colors.emerald,
      rose: colors.rose,
      red: colors.red,
      primary: colors.purple,
      secondary: colors.rose,
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {},
  },
  plugins: [],
}

export default config
