/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mint: {
          50: "#effff7",
          100: "#dbffe9",
          200: "#b5f6d0",
          300: "#8de3b6",
          400: "#64d09c",
          500: "#3dbb84",
          600: "#2a9f6d",
          700: "#1f7a55",
        },
        forest: {
          50: "#e8f4ea",
          700: "#224733",
        },
        paper: "#f9faf4",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(19, 64, 40, 0.08)",
      },
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        body: ["Nunito Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}

