import type { Metadata, Viewport } from "next"; // Aggiunto Viewport qui
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout"; 
import { Analytics } from "@vercel/analytics/react";
import { createClient } from "@supabase/supabase-js";
import AnnouncementModal, { Announcement } from "@/components/AnnouncementModal";

// Font di default (Inter)
const inter = Inter({ subsets: ["latin"] });

// CONFIGURAZIONE FONT "LUNA" GLOBALE
const lunaFont = localFont({
  src: "../fonts/mending.regular.otf", 
  variable: "--font-luna", 
  weight: "400",
});

export const metadata: Metadata = {
  title: "TSC Caffè",
  description: "Il tuo bar di fiducia",
};

// FIX iOS NOTCH: Permette al sito di espandersi a tutto schermo (sotto la safe-area)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

// Funzione Server-Side per recuperare gli annunci attivi da Supabase
async function getActiveAnnouncements(): Promise<Announcement[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fallback di sicurezza se le env vars mancano
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Variabili d'ambiente Supabase mancanti in layout.tsx");
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // La RLS gestisce già il filtro temporale (start_at / end_at) e is_active = true
  const { data, error } = await supabase
    .from('site_announcements')
    .select('id, title, description, category');

  if (error) {
    console.error("Errore recupero annunci:", error);
    return [];
  }

  return data as Announcement[];
}

// Layout è ora 'async' per supportare il fetching dei Server Components
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Eseguiamo il fetch prima del render
  const announcements = await getActiveAnnouncements();

  return (
    <html lang="it">
      {/* FIX S25 ULTRA E STRABORDAMENTI: Aggiunto overflow-x-hidden e w-full */}
      <body className={`${inter.className} ${lunaFont.variable} relative w-full overflow-x-hidden antialiased`}>
          
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
         
         {/* Inject del modale server-side */}
         <AnnouncementModal announcements={announcements} />
         
         <ClientLayout>
           {children}
         </ClientLayout>
         
         <Analytics />
      </body>
    </html>
  );
}