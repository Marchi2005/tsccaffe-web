import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Percorsi standard se usi la cartella src
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Percorsi di fallback se hai file fuori da src (per sicurezza)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
        // Ho aggiunto dei colori scorciatoia per Luna Events (opzionale)
        luna: {
          gold: "#fbbf24", // corrisponde ad amber-400
          night: "#020617", // corrisponde a slate-950
        }
      },
      fontFamily: {
        // Il font base del sito (Geist o Inter)
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        
        // IL TUO NUOVO FONT PERSONALIZZATO
        // Usa la classe: font-luna
        luna: ['var(--font-luna)', 'serif'], 
      },
    },
  },
  plugins: [],
};

export default config;