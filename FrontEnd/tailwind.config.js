const { nextui } = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // colors: {
    //   grey_apple_from: "#f5f5f7",
    //   grey_apple_to: "#f5f7f7",
    // },
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
};
