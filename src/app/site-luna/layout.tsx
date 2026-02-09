import type { Metadata } from "next";
import ComingSoon from "@/components/luna/ComingSoon"; // Assicurati che l'import sia corretto

// --- INTERRUTTORE SITO ---
// Metti "false" quando vuoi andare online con il sito vero!
const IS_COMING_SOON = true; 

export const metadata: Metadata = {
  title: "Luna Events",
  description: "Organizzazione eventi esclusivi con apecar e allestimenti unici. Scopri il nostro mondo di feste indimenticabili, catering di qualità e servizi personalizzati per ogni occasione.",
  icons: {
    icon: "/icons/moon.svg", 
    shortcut: "/icons/moon.svg",
    apple: "/icons/moon.svg",
  },
};

export default function LunaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // SE LA MODALITÀ COMING SOON È ATTIVA:
  if (IS_COMING_SOON) {
    return <ComingSoon />;
  }

  // ALTRIMENTI MOSTRA IL SITO NORMALE:
  return (
    <>
      {children}
    </>
  );
}