import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '',
          }
        }
      }
    },
  },

  plugins: [require("@tailwindcss/typography"), require('daisyui')],
  presets: [require("@relume_io/relume-tailwind")],
  daisyui: {
    themes: ["sunset", "garden"],
    darkMode: ['class', '[data-theme="sunset"]']
  },
} satisfies Config;
