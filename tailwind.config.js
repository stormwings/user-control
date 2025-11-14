/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#3C4787",
          hover: "#4099af",
          text: "#6a6666",
          bg: "#fafafa",
          dark: {
            bg: "#0f172a",
            surface: "#1e293b",
            border: "#334155",
            text: "#e2e8f0",
            muted: "#94a3b8",
          },
        },
      },
      fontFamily: {
        f1: ["Franklin Gothic Medium", "Arial Narrow", "Arial", "sans-serif"],
        f2: [
          "Gill Sans",
          "Gill Sans MT",
          "Calibri",
          "Trebuchet MS",
          "sans-serif",
        ],
        f3: [
          "Lucida Sans",
          "Lucida Sans Regular",
          "Lucida Grande",
          "Lucida Sans Unicode",
          "Geneva",
          "Verdana",
          "sans-serif",
        ],
        f4: [
          "Trebuchet MS",
          "Lucida Sans Unicode",
          "Lucida Grande",
          "Lucida Sans",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 12px 32px rgba(0,0,0,.12)",
        btn: "0 6px 16px rgba(60,71,135,.25)",
      },
    },
  },
  plugins: [],
};
