// src/app/admin/announcements/actions.ts
"use server";

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Inizializzazione Supabase (Usa la Role Key per bypassare RLS nelle operazioni di Admin)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Validazione robusta (Fix per Vercel Build su Zod Enum)
const AnnouncementSchema = z.object({
  title: z.string().min(3, "Il titolo deve avere almeno 3 caratteri").max(150, "Titolo troppo lungo"),
  description: z.string().min(10, "La descrizione deve essere chiara (min 10 car)").max(600, "Descrizione troppo lunga"),
  category: z.enum([
    'Chiusura Straordinaria',
    'Ferie',
    'Offerta Momento',
    'Evento',
    'Promo Colazione',
    'Promo Aperitivo',
    'Guasto Servizi Tabacchi'
  ], { 
    // Usiamo il formato nativo accettato da TypeScript per gli enum Zod
    required_error: "Devi selezionare una categoria",
    invalid_type_error: "Categoria non valida selezionata",
  }),
  start_at: z.string().min(1, "Inserisci la data e l'ora di inizio"),
  end_at: z.string().min(1, "Inserisci la data e l'ora di fine"),
}).refine((data) => {
  // Ci assicuriamo di non far crashare Zod se la data non è valida
  const start = new Date(data.start_at);
  const end = new Date(data.end_at);
  return end > start;
}, {
  message: "La data e ora di fine deve essere successiva a quella di inizio",
  path: ["end_at"],
});

export async function createAnnouncement(prevState: any, formData: FormData) {
  try {
    // 1. Estrazione SICURA dei dati. Evitiamo i null di FormData.
    const rawData = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      category: formData.get("category")?.toString() || "",
      start_at: formData.get("start_at")?.toString() || "",
      end_at: formData.get("end_at")?.toString() || "",
    };

    // 2. Parsiamo con Zod
    const validatedData = AnnouncementSchema.safeParse(rawData);

    // 3. Gestione Errori di Form/Zod
    if (!validatedData.success) {
      // Uso .issues per massima compatibilità con Zod (invece di .errors)
      const errorMessage = validatedData.error.issues?.[0]?.message || "Per favore, compila tutti i campi correttamente.";
      return { error: errorMessage, status: 400 };
    }

    // 4. Prevenzione crash Date "Invalid Date" prima di toccare Supabase
    const startDate = new Date(validatedData.data.start_at);
    const endDate = new Date(validatedData.data.end_at);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
       return { error: "Formato data/ora non valido.", status: 400 };
    }

    // 5. Inserimento a Database
    const { error } = await supabase
      .from("site_announcements")
      .insert([{
        title: validatedData.data.title,
        description: validatedData.data.description,
        category: validatedData.data.category,
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        is_active: true
      }]);

    if (error) {
      console.error("Supabase Insert Error:", error);
      // Catturiamo l'errore del Trigger custom creato in precedenza su Postgres
      if (error.message.includes('più di 2 annunci attivi')) {
        return { error: "Impossibile pubblicare: hai già raggiunto il limite di 2 popup programmati e sovrapposti in questo arco di tempo.", status: 409 };
      }
      return { error: `Errore Database: ${error.message}`, status: 500 };
    }

    // 6. Aggiorna la cache per far apparire istantaneamente il popup a schermo
    revalidatePath("/", "layout");
    revalidatePath("/admin/announcements");

    return { success: true, message: "Annuncio creato e programmato con successo!" };

  } catch (error: any) {
    console.error("Action Catch Error Completo:", error);
    return { error: `Errore server imprevisto: ${error?.message || "Sconosciuto"}`, status: 500 };
  }
}

export async function deactivateAnnouncement(id: string) {
  const { error } = await supabase
    .from("site_announcements")
    .update({ is_active: false })
    .eq("id", id);

  if (error) {
    console.error("Error deactivating:", error);
    throw new Error(error.message);
  }
  
  revalidatePath("/", "layout");
  revalidatePath("/admin/announcements");
}