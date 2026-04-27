/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#030B1A",
          900: "#07162E",
          800: "#0B2A57",
          700: "#18427E",
        },
        brandred: {
          700: "#B3122F",
          600: "#D7263D",
          500: "#F16474",
        },
      },
    },
  },
  plugins: [],
};
