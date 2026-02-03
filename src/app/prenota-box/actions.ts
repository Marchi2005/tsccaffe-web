"use server";

import { supabase } from "@/lib/supabase";
import { BOX_TYPES } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function submitOrder(prevState: any, formData: FormData) {
  // 1. GESTIONE INDIRIZZO E DATI BASE
  const deliveryType = formData.get("deliveryType");
  const address = deliveryType === 'ritiro' ? "RITIRO IN SEDE" : formData.get("address");

  // Dati grezzi dal form
  const rawData = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    address: address,
    deliveryType: deliveryType,
    preferredTime: formData.get("preferredTime"),
    
    // Configurazione Box
    boxType: formData.get("boxType") as string,
    boxFormat: formData.get("variant") as string,
    boxSize: formData.get("boxSize") as string,
    
    // Contenuto Colazione
    drink1: formData.get("drink1"),
    croissant1: formData.get("croissant1"),
    drink2: formData.get("drink2"),
    croissant2: formData.get("croissant2"),
    
    // Extra e Accessori
    includeSpremuta: formData.get("includeSpremuta"),
    includeSucco: formData.get("includeSucco"),
    succoFlavor: formData.get("succoFlavor"), // NUOVO CAMPO
    
    addPelucheL: formData.get("addPelucheL"),
    addPelucheM: formData.get("addPelucheM"),
    addRosa: formData.get("addRosa"),
    
    quantity: formData.get("quantity") || 1,
    totalPrice: formData.get("totalPrice"),
  };

  const selectedBox = BOX_TYPES.find(b => b.id === rawData.boxType);
  if (!selectedBox) return { success: false, message: "Box non valida." };

  // Costruzione Descrizione Box (es. "Red Love Medium (Doppia)")
  let boxDescription = `${selectedBox.name}`;
  if (rawData.boxSize) boxDescription += ` ${rawData.boxSize.toUpperCase()}`;
  boxDescription += ` (${rawData.boxFormat})`;

  // Costruzione Note Ordine (Per salvare i dettagli extra che non hanno colonne dedicate)
  let notesArray = [];
  if (rawData.includeSpremuta === "on") notesArray.push("Con Spremuta");
  if (rawData.includeSucco === "on") {
      notesArray.push(`Con Succo Extra (${rawData.succoFlavor})`); // Salviamo il gusto qui!
  }
  const notesString = notesArray.join(" + ");

  const isSingle = rawData.boxFormat === "singola";
  
  const { error } = await supabase.from("web_orders").insert({
    full_name: rawData.fullName,
    phone: rawData.phone,
    address: rawData.address,
    delivery_type: rawData.deliveryType,
    preferred_time: rawData.preferredTime,
    
    box_type: boxDescription, 
    box_format: rawData.boxFormat, 
    
    drink_1: rawData.drink1,
    croissant_1: rawData.croissant1,
    drink_2: isSingle ? null : rawData.drink2,
    croissant_2: isSingle ? null : rawData.croissant2,
    
    // Se hai colonne booleane
    include_spremuta: rawData.includeSpremuta === "on",
    include_succo_extra: rawData.includeSucco === "on",
    include_peluche_l: rawData.addPelucheL === "on",
    include_peluche_m: rawData.addPelucheM === "on",
    include_rosa: rawData.addRosa === "on",

    // Salviamo le note (gusto succo, etc)
    notes: notesString, 
    
    quantity: Number(rawData.quantity),
    total_price: Number(rawData.totalPrice),
    status: "pending",
  });

  if (error) {
    console.error("Errore Supabase:", error);
    return { success: false, message: "Si è verificato un errore tecnico. Riprova." };
  }

  revalidatePath("/admin"); 
  return { success: true, message: "Ordine inviato con successo!" };
}