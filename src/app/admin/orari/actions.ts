"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Inizializziamo Supabase con la chiave con privilegi massimi (bypassa RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1. Legge tutti gli orari (Settimanali e Speciali)
export async function getSchedules() {
  const { data: weekly, error: wErr } = await supabaseAdmin.from('weekly_hours').select('*').order('day_of_week');
  const { data: special, error: sErr } = await supabaseAdmin.from('special_closures').select('*').order('closure_date');
  
  if (wErr) throw new Error(wErr.message);
  if (sErr) throw new Error(sErr.message);

  return { weekly, special };
}

// 2. Aggiorna l'intera settimana
export async function updateWeeklyHours(weeklyData: any[]) {
  const { error } = await supabaseAdmin.from('weekly_hours').upsert(weeklyData);
  if (error) throw new Error(error.message);
  
  revalidatePath('/'); // Forza l'aggiornamento della cache per la home pubblica
  return { success: true };
}

// 3. Aggiunge una data speciale (chiusura o orario diverso)
export async function addSpecialClosure(date: string, reason: string) {
  const { error } = await supabaseAdmin.from('special_closures').insert([
    { closure_date: date, reason }
  ]);
  
  if (error) throw new Error(error.message);
  revalidatePath('/');
  return { success: true };
}

// 4. Rimuove una data speciale
export async function deleteSpecialClosure(id: number) {
  const { error } = await supabaseAdmin.from('special_closures').delete().eq('id', id);
  if (error) throw new Error(error.message);
  
  revalidatePath('/');
  return { success: true };
}

// 5. Aggiunge MOLTE date speciali in un colpo solo (per i periodi di ferie)
export async function addMultipleSpecialClosures(closures: { closure_date: string, reason: string }[]) {
  const { error } = await supabaseAdmin.from('special_closures').insert(closures);
  
  if (error) throw new Error(error.message);
  revalidatePath('/');
  return { success: true };
}