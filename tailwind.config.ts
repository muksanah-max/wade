import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff2d55",
          dark: "#c3002f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
