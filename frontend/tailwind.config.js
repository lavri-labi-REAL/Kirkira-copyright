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
          DEFAULT: "#F59E0B",
          50:  "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        accent: {
          DEFAULT: "#F97316",
          50:  "#FFF7ED",
          100: "#FFEDD5",
          400: "#FB923C",
          600: "#EA580C",
          dark: "#C2410C",
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
        card:  "0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(245,158,11,.07)",
        hover: "0 4px 24px rgba(245,158,11,.16)",
        modal: "0 8px 40px rgba(0,0,0,.18)",
        nav:   "0 1px 0 rgba(0,0,0,.06)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #F59E0B 0%, #F97316 55%, #EA580C 100%)",
        "accent-gradient": "linear-gradient(135deg, #F97316, #EA580C)",
        "card-gradient": "linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)",
      },
    },
  },
  plugins: [],
};
