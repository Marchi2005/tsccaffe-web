import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local"; // <--- Import necessario
import "./globals.css";
import ClientLayout from "@/components/ClientLayout"; 
import { Analytics } from "@vercel/analytics/react";

// Font di default (Inter)
const inter = Inter({ subsets: ["latin"] });

// CONFIGURAZIONE FONT "LUNA" GLOBALE
// Assicurati che il file sia in: src/fonts/mending.regular.otf
const lunaFont = localFont({
  src: "../fonts/mending.regular.otf", 
  variable: "--font-luna", // Questa variabile rende il font disponibile a Tailwind
  weight: "400",
});

export const metadata: Metadata = {
  title: "TSC Caffè",
  description: "Il tuo bar di fiducia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      {/* Aggiungo lunaFont.variable alle classi del body */}
      <body className={`${inter.className} ${lunaFont.variable}`}>
         
         {/* Easter Egg per la Console */}
         <script
            dangerouslySetInnerHTML={{
              __html: `
                console.log(
                  "%c🚀 Developed by Marco Ianniello", 
                  "color: #f43f5e; font-size: 20px; font-weight: bold; font-family: sans-serif; border: 2px solid #f43f5e; padding: 8px; border-radius: 4px;"
                );
                console.log("%cStudente di Informatica @ Portfolio: https://github.com/Marchi2005", "color: #64748b; font-size: 12px;");
              `,
            }}
          />
         
         <ClientLayout>
           {children}
         </ClientLayout>
         
         <Analytics />
      </body>
    </html>
  );
}