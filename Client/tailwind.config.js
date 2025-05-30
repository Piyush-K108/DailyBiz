/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#00040f",
        secondary: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        "permanent-marker": ["Permanent Marker", "cursive"],
      },
      animation: {
        fadeInDown: "fadeInDown 1s ease-out",
        fadeInUP: "fadeInUP 1s ease-out",
        fadeInRight: "fadeInRight 1s ease-out",
        fadeInLeft: "fadeInLeft 1s ease-out",
      },
      keyframes: {
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-100px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeInUP: {
          "0%": {
            opacity: "0",
            transform: "translateY(1000px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeInRight: {
          "0%": {
            opacity: "0",
            transform: "translateX(-1000px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        fadeInLeft: {
          "0%": {
            opacity: "0",
            transform: "translateX(1000px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
      },
    },
    screens: {
      xxs:'360px',
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};