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
      gray: colors.neutral,
      blue: colors.blue,
      emerald: colors.emerald,
      rose: colors.rose,
      red: colors.red,
      primary: colors.purple,
      secondary: colors.rose,
    },
    extend: {
      keyframes: {
        bounceCar: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        bounceCar: 'bounceCar 0.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
