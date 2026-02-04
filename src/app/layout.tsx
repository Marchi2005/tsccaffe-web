import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout"; 
// 1. L'import è corretto
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
         
         <ClientLayout>
            {children}
         </ClientLayout>
    {/*per le analytics di vercel*/}
         <Analytics />
         
      </body>
    </html>
  );
}