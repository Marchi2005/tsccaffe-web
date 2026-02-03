"use server";

import { supabase } from "@/lib/supabase";
import { OrderSchema, BOX_TYPES } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function submitOrder(prevState: any, formData: FormData) {
  // CORREZIONE QUI: Se il tipo è ritiro, forziamo l'indirizzo a "RITIRO IN SEDE" se non arriva dal form
  const deliveryType = formData.get("deliveryType");
  const address = deliveryType === 'ritiro' 
    ? "RITIRO IN SEDE" 
    : formData.get("address");

  const rawData = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    address: address, // Usiamo la variabile calcolata
    deliveryType: deliveryType,
    preferredTime: formData.get("preferredTime"),
    boxType: formData.get("boxType"),
    drink1: formData.get("drink1"),
    croissant1: formData.get("croissant1"),
    drink2: formData.get("drink2"),
    croissant2: formData.get("croissant2"),
    includeSpremuta: formData.get("includeSpremuta"),
    includePeluche: formData.get("includePeluche"), 
    quantity: formData.get("quantity"),
  };

  const validatedFields = OrderSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: "Compila tutti i campi obbligatori." };
  }

  const data = validatedFields.data;
  const selectedBox = BOX_TYPES.find(b => b.id === data.boxType);
  if (!selectedBox) return { success: false, message: "Box non valida." };

  let singleBoxPrice = selectedBox.price;

  // 1. Supplementi Bevande
  if (data.drink1.includes("Succo")) singleBoxPrice += 1.30;
  if (data.drink2.includes("Succo")) singleBoxPrice += 1.30;
  if (data.drink1.includes("Grande")) singleBoxPrice += 0.20;
  if (data.drink2.includes("Grande")) singleBoxPrice += 0.20;

  // 2. Supplemento Peluche
  if (data.includePeluche === "on") singleBoxPrice += 9.50;

  // Costruzione Note
  let notesArray = [];
  if (data.includeSpremuta === "on") notesArray.push("CON SPREMUTA");
  if (data.includePeluche === "on") notesArray.push("CON PELUCHE (+9.50€)");
  
  const notesString = notesArray.length > 0 ? notesArray.join(" + ") : "Standard";

  const { error } = await supabase.from("web_orders").insert({
    full_name: data.fullName,
    phone: data.phone,
    address: data.deliveryType === 'domicilio' ? data.address : "RITIRO IN SEDE",
    delivery_type: data.deliveryType,
    preferred_time: data.preferredTime,
    box_type: selectedBox.name,
    drink_1: data.drink1,
    croissant_1: data.croissant1,
    drink_2: data.drink2,
    croissant_2: data.croissant2,
    notes: notesString,
    quantity: data.quantity,
    total_price: singleBoxPrice * data.quantity,
    status: "pending",
  });

  if (error) {
    console.error("Supabase Error:", error);
    return { success: false, message: `Errore DB: ${error.message} (${error.details})` };
  }

  revalidatePath("/admin"); 
  return { success: true, message: "Ordine inviato con successo!" };
}