import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#07070a",
        panel: "#111117",
        gold: "#D8A640",
        goldLight: "#FFD071",
        cream: "#FFF6E8",
        muted: "#B9AD9C"
      },
      boxShadow: {
        glow: "0 24px 90px rgba(216,166,64,.18)"
      }
    },
  },
  plugins: [],
};
export default config;
