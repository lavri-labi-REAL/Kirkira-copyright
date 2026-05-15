/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A237E",
          50:  "#E8EAF6",
          100: "#C5CAE9",
          200: "#9FA8DA",
          300: "#7986CB",
          400: "#5C6BC0",
          500: "#3F51B5",
          600: "#3949AB",
          700: "#303F9F",
          800: "#283593",
          900: "#1A237E",
        },
        accent: {
          DEFAULT: "#00BCD4",
          50:  "#E0F7FA",
          100: "#B2EBF2",
          400: "#26C6DA",
          600: "#00ACC1",
          dark: "#00838F",
        },
        success: { DEFAULT: "#4CAF50", dark: "#388E3C", light: "#E8F5E9" },
        warning: { DEFAULT: "#FFC107", dark: "#F57C00", light: "#FFF3E0" },
        error:   { DEFAULT: "#F44336", dark: "#C62828", light: "#FFEBEE" },
        neutral: {
          50:  "#ECEFF1",
          100: "#CFD8DC",
          200: "#B0BEC5",
          400: "#90A4AE",
          600: "#546E7A",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card:  "0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(26,35,126,.07)",
        hover: "0 4px 24px rgba(26,35,126,.14)",
        modal: "0 8px 40px rgba(0,0,0,.18)",
        nav:   "0 2px 8px rgba(0,0,0,.12)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg,#1A237E 0%,#283593 50%,#3949AB 100%)",
        "accent-gradient": "linear-gradient(135deg,#00BCD4,#0097A7)",
        "card-gradient": "linear-gradient(135deg,#f8f9ff 0%,#ffffff 100%)",
      },
    },
  },
  plugins: [],
};
