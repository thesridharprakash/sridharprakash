// tailwind.config.js
const tailwindConfig = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}" // include /app for Next.js 13+ app directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default tailwindConfig;
