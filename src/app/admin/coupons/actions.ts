"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createPromoCode(prevState: any, formData: FormData) {
  const code = formData.get("code") as string;
  const type = formData.get("type") as "fixed" | "percentage";
  const value = parseFloat(formData.get("value") as string);
  const expiresAt = formData.get("expiresAt") as string;
  const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null;

  if (!code || isNaN(value)) {
    return { success: false, message: "Dati mancanti o non validi." };
  }

  const { error } = await supabase.from("promo_codes").insert({
    code: code.toUpperCase().trim(),
    discount_type: type,
    discount_value: value,
    expires_at: expiresAt || null,
    max_uses: maxUses,
    uses_count: 0,
    is_active: true
  });

  if (error) {
    console.error("Errore creazione coupon:", error);
    return { success: false, message: "Errore: il codice esiste già o c'è un problema tecnico." };
  }

  revalidatePath("/admin/coupons");
  return { success: true, message: "Codice creato con successo!" };
}