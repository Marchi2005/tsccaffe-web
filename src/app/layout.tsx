import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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