// src/components/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar"; // Controlla che il percorso sia giusto
import Footer from "@/components/layout/Footer"; // Controlla che il percorso sia giusto

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Se siamo in una pagina che inizia con /admin, nascondi Navbar e Footer
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}