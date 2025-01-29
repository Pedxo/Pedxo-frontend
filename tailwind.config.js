/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins, san-serif"],
      },
      screens: {
        sm: "640px",

        md: "768px",

        lg: "1024px",

        xl: "1280px",

        "2xl": "1536px",
      },
      colors: {
        primary: "#4195F1",
        secondary: "#00B9CB",
        accentGrey: "#F5F5F5",
        brandLightGrey: "#F2F3EE",
        brandGrey: "#D9D9D9",
        brandGreen: "#008000",
        brandRed: "#FF0000",
      },
    },
  },
  plugins: [],
});
