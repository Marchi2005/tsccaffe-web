"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

// --- AGGIORNAMENTO ---
export async function updateProductPrice(id: string, updates: any) {
  try {
    const { error } = await supabaseAdmin.from('web_products').update(updates).eq('id', id);
    if (error) throw error;
    revalidatePath('/'); 
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error) {
    console.error("Errore aggiornamento:", error);
    return { success: false, message: "Errore salvataggio" };
  }
}

// --- CREAZIONE ---
export async function createProduct(productData: any) {
  try {
    // Genera slug automatico
    const slug = productData.slug || productData.model
      .toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // La descrizione arriva già formattata dal frontend ora
    const newProduct = {
      ...productData,
      slug,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from('web_products').insert(newProduct);
    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error) {
    console.error("Errore creazione:", error);
    return { success: false, message: "Errore creazione (forse slug duplicato?)" };
  }
}

// --- ELIMINAZIONE ---
export async function deleteProduct(id: string) {
  try {
    const { error } = await supabaseAdmin.from('web_products').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error) {
    console.error("Errore eliminazione:", error);
    return { success: false, message: "Impossibile eliminare" };
  }
}