"use server";

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    'Guasto Servizi Tabacchi',
    'Variazione Orari'
  ], { 
    message: "Devi selezionare una categoria valida"
  }),
  start_at: z.string().min(1, "Inserisci la data e l'ora di inizio"),
  end_at: z.string().min(1, "Inserisci la data e l'ora di fine"),
  schedule: z.string().optional()
}).refine((data) => {
  const start = new Date(data.start_at);
  const end = new Date(data.end_at);
  return end > start;
}, {
  message: "La data e ora di fine deve essere successiva a quella di inizio",
  path: ["end_at"],
});

export async function createAnnouncement(prevState: any, formData: FormData) {
  try {
    const rawData = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      category: formData.get("category")?.toString() || "",
      start_at: formData.get("start_at")?.toString() || "",
      end_at: formData.get("end_at")?.toString() || "",
      schedule: formData.get("schedule")?.toString() || "",
    };

    const validatedData = AnnouncementSchema.safeParse(rawData);

    if (!validatedData.success) {
      const errorMessage = validatedData.error.issues?.[0]?.message || "Per favore, compila tutti i campi correttamente.";
      return { error: errorMessage, status: 400 };
    }

    // Le date arrivano già formattate in ISO dal client (es. "2026-07-18T16:26:00.000Z")
    const startDate = new Date(validatedData.data.start_at);
    const endDate = new Date(validatedData.data.end_at);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
       return { error: "Formato data/ora non valido.", status: 400 };
    }

    let scheduleData = null;
    if (validatedData.data.category === 'Variazione Orari' && validatedData.data.schedule) {
      try {
        scheduleData = JSON.parse(validatedData.data.schedule);
        scheduleData = scheduleData.filter((s: any) => s.day.trim() !== "" && s.hours.trim() !== "");
      } catch (e) {
        return { error: "Errore nel formato degli orari forniti.", status: 400 };
      }
    }

    const { error } = await supabase
      .from("site_announcements")
      .insert([{
        title: validatedData.data.title,
        description: validatedData.data.description,
        category: validatedData.data.category,
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        schedule: scheduleData,
        is_active: true
      }]);

    if (error) {
      console.error("Supabase Insert Error:", error);
      if (error.message.includes('più di 2 annunci attivi')) {
        return { error: "Impossibile pubblicare: hai già raggiunto il limite di 2 popup programmati e sovrapposti in questo arco di tempo.", status: 409 };
      }
      return { error: `Errore Database: ${error.message}`, status: 500 };
    }

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