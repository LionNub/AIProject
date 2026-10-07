/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#071A2C",
          900: "#0E3A5D",
          800: "#164B73",
          700: "#1B4F72",
        },
        paper: "#F3F6F9",
      },
      fontFamily: {
        serif: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Source Sans 3"', "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
