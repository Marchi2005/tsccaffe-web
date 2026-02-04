import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// IMPORTA IL NUOVO COMPONENTE
import ClientLayout from "@/components/ClientLayout"; 
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
         {/* Invece di mettere <Navbar /> e <Footer /> qui direttamente,
            usiamo il wrapper che decide se mostrarli o no.
         */}
         <ClientLayout>
            {children}
         </ClientLayout>
      </body>
    </html>
  );
}