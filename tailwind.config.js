/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00BFFF",
        secondary: "#87CEFA",
        tertiary: "#ADD8E6",
        highlight: "#87CEEB",
        dark: "#485493",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        inter: ["var(--font-inter)"],
        pretendard: ["Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [],
};
