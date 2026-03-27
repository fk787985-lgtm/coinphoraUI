// tailwind.config.js
import scrollbarHide from "tailwind-scrollbar-hide";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["InterVariable", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        colors: {
          primary: "#facc15", // yellow-400
          bgDark: "#0d111c",
          bgLight: "#161b26",
        },
        custom: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [scrollbarHide],
};
