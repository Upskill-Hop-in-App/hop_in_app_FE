import colors from 'tailwindcss/colors';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'selector',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
      emerald: colors.emerald,
      rose: colors.rose,
      red: colors.red,
      primary: colors.purple,
      secondary: colors.rose,
    },
    extend: {},
  },
  plugins: [],
};

export default config;
