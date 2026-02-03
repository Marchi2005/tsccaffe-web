import type { Config } from "tailwindcss";

const config: Config = {
  // QUESTA PARTE È QUELLA CRUCIALE:
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Cerca dentro src (se esiste)
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Cerca dentro app (se src non esiste)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Cerca nei componenti fuori da app
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: "#00b4d8",
          dark: "#0f172a",
          coffee: "#78350f",
          red: "#dc2626",
          blue: '#053e89',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'], 
      },
    },
  },
  plugins: [],
};
export default config;