"use server";

import { supabase } from "@/lib/supabase";
import { BOX_TYPES } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function submitOrder(prevState: any, formData: FormData) {
  // --- CHIAVE STRIPE ---
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-01-27.acacia" as any,
      typescript: true,
  });

  // 1. GESTIONE DATI INPUT
  const deliveryType = formData.get("deliveryType");
  const address = deliveryType === 'ritiro' ? "RITIRO IN SEDE" : formData.get("address");
  const paymentMethod = formData.get("paymentMethod") as string; 

  const rawData = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    address: address,
    deliveryType: deliveryType,
    preferredTime: formData.get("preferredTime"),
    paymentMethod: paymentMethod,
    boxType: formData.get("boxType") as string,
    boxFormat: formData.get("variant") as string,
    boxSize: formData.get("boxSize") as string,
    drink1: formData.get("drink1"),
    croissant1: formData.get("croissant1"),
    drink2: formData.get("drink2"),
    croissant2: formData.get("croissant2"),
    includeSpremuta: formData.get("includeSpremuta"),
    includeSucco: formData.get("includeSucco"),
    succoFlavor: formData.get("succoFlavor"),
    addPelucheL: formData.get("addPelucheL"),
    addPelucheM: formData.get("addPelucheM"),
    addRosa: formData.get("addRosa"),
    quantity: formData.get("quantity") || 1,
    totalPrice: parseFloat(formData.get("totalPrice") as string),
  };

  const selectedBox = BOX_TYPES.find(b => b.id === rawData.boxType);
  if (!selectedBox) return { success: false, message: "Box non valida." };

  let boxDescription = `${selectedBox.name}`;
  if (rawData.boxSize) boxDescription += ` ${rawData.boxSize.toUpperCase()}`;
  boxDescription += ` (${rawData.boxFormat})`;

  let notesArray = [];
  if (rawData.includeSpremuta === "on") notesArray.push("Con Spremuta");
  if (rawData.includeSucco === "on") notesArray.push(`Con Succo Extra (${rawData.succoFlavor})`); 
  const notesString = notesArray.join(" + ");
  const isSingle = rawData.boxFormat === "singola";

  const initialStatus = paymentMethod === 'card' ? 'bozza_in_attesa' : 'da_pagare_in_sede';

  // --- SALVATAGGIO ORDINE ---
  const { data: orderData, error } = await supabase.from("web_orders").insert({
    full_name: rawData.fullName,
    phone: rawData.phone,
    address: rawData.address,
    delivery_type: rawData.deliveryType,
    preferred_time: rawData.preferredTime,
    payment_method: rawData.paymentMethod, 
    box_type: boxDescription, 
    box_format: rawData.boxFormat, 
    drink_1: rawData.drink1,
    croissant_1: rawData.croissant1,
    drink_2: isSingle ? null : rawData.drink2,
    croissant_2: isSingle ? null : rawData.croissant2,
    include_spremuta: rawData.includeSpremuta === "on",
    include_succo_extra: rawData.includeSucco === "on",
    include_peluche_l: rawData.addPelucheL === "on",
    include_peluche_m: rawData.addPelucheM === "on",
    include_rosa: rawData.addRosa === "on",
    notes: notesString, 
    quantity: Number(rawData.quantity),
    total_price: Number(rawData.totalPrice),
    status: initialStatus, 
  }).select().single();

  if (error || !orderData) {
    console.error("Errore Supabase:", error);
    return { success: false, message: "Errore tecnico. Riprova." };
  }

  // --- GESTIONE STRIPE ---
  if (paymentMethod === 'card') {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://tsccaffe.it"; //DA CAMBIARE QUANDO SI FA TESTING LOCALE
    let sessionUrl = null;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `Ordine #${orderData.id} - ${boxDescription}`,
                description: `Cliente: ${rawData.fullName}`,
              },
              unit_amount: Math.round(rawData.totalPrice * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/success?order_id=${orderData.id}`,
        cancel_url: `${baseUrl}/`, 
      });
      sessionUrl = session.url;
    } catch (e) {
      console.error("Errore Stripe:", e);
      return { success: false, message: "Errore pagamento." };
    }

    if (sessionUrl) redirect(sessionUrl);
  }

  // --- RITORNO PER PAGAMENTO IN CONTANTI ---
  revalidatePath("/admin"); 
  return { 
    success: true, 
    message: "Ordine inviato!", 
    orderId: orderData.id // <--- Posizionato correttamente qui!
  };
}

export async function confirmOrderPayment(orderId: string) {
    console.log("------------------------------------------------");
    console.log("1. INIZIO CONFERMA PER ID:", orderId);

    try {
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        
        // Controllo chiavi
        if (!serviceKey || !supabaseUrl) {
            console.error("❌ ERRORE: Chiavi mancanti!");
            return { 
                success: false, 
                message: `Chiavi mancanti su Vercel. URL: ${!!supabaseUrl}, KEY: ${!!serviceKey}` 
            };
        }

        const supabaseAdmin = createClient(
            supabaseUrl,
            serviceKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );

        const { data, error } = await supabaseAdmin
            .from("web_orders")
            .update({ status: 'pagato_online' })
            .eq('id', orderId)
            .select();

        if (error) {
            console.error("❌ ERRORE DATABASE:", error.message);
            return { success: false, message: error.message };
        }

        if (!data || data.length === 0) {
            console.warn("⚠️ Nessun ordine trovato con questo ID.");
            return { success: false, message: "Ordine non trovato nel database." };
        }

        console.log("✅ SUCCESSO! Ordine aggiornato:", data);
        console.log("------------------------------------------------");
        
        // IMPORTANTE: Restituiamo il risultato per vederlo nella pagina di test
        return { success: true, data: data };

    } catch (err: any) {
        console.error("❌ ERRORE CRITICO:", err.message);
        return { success: false, message: "Errore interno: " + err.message };
    }
}