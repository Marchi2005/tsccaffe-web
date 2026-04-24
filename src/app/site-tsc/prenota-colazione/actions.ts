"use server";

import { supabase } from "@/lib/supabase";
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
  
  // 🔧 Recuperiamo l'intero carrello da page.tsx
  const cartDetailsStr = formData.get("cartDetails") as string;
  let parsedCart = [];
  try {
      parsedCart = JSON.parse(cartDetailsStr || "[]");
  } catch (e) {
      console.error("Errore parsing carrello");
  }

  // 🔧 Formattiamo il carrello come lista leggibile (Scontrino)
  // Es: "2x Cappuccino (Senza Lattosio)\n1x Cornetto Vuoto"
  const orderSummary = parsedCart.map((item: any) => `${item.qty}x ${item.name}`).join("\n");

  const rawData = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    address: address,
    deliveryType: deliveryType,
    preferredTime: formData.get("preferredTime"),
    paymentMethod: paymentMethod,
    boxType: formData.get("boxType") as string, // "Colazione per 1", "Colazione per 5+", ecc.
    notes: formData.get("notes") as string,
    quantity: formData.get("quantity") || 1,
    totalPrice: parseFloat(formData.get("totalPrice") as string),
  };

  const initialStatus = paymentMethod === 'card' ? 'bozza_in_attesa' : 'da_pagare_in_sede';

  // 🔧 Uniamo le note del cliente con il riepilogo dello scontrino
  // Così non dobbiamo modificare la struttura della tabella su Supabase!
  const finalNotes = `--- DETTAGLI SCONTRINO ---\n${orderSummary}\n\n--- NOTE CLIENTE ---\n${rawData.notes || 'Nessuna nota aggiuntiva'}`;

  // --- 2. SALVATAGGIO ORDINE SU SUPABASE ---
  const { data: orderData, error } = await supabase.from("web_orders").insert({
    full_name: rawData.fullName,
    phone: rawData.phone,
    address: rawData.address,
    delivery_type: rawData.deliveryType,
    preferred_time: rawData.preferredTime,
    payment_method: rawData.paymentMethod, 
    box_type: rawData.boxType, 
    notes: finalNotes, // <--- Tutte le info vanno qui dentro!
    quantity: Number(rawData.quantity),
    total_price: Number(rawData.totalPrice),
    status: initialStatus, 
  }).select().single();

  if (error || !orderData) {
    console.error("Errore Supabase:", error);
    return { success: false, message: "Errore tecnico. Riprova." };
  }

  // --- 3. GESTIONE STRIPE ---
  if (paymentMethod === 'card') {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://tsccaffe.it"; // Metti localhost:3000 se testi in locale
    let sessionUrl = null;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `Ordine #${orderData.id} - ${rawData.boxType}`,
                description: `Cliente: ${rawData.fullName}`,
              },
              unit_amount: Math.round(rawData.totalPrice * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/success-colazione?order_id=${orderData.id}`,
        cancel_url: `${baseUrl}/prenota-colazione`, 
      });
      sessionUrl = session.url;
    } catch (e) {
      console.error("Errore Stripe:", e);
      return { success: false, message: "Errore durante la creazione del pagamento." };
    }

    if (sessionUrl) redirect(sessionUrl);
  }

  // --- RITORNO PER PAGAMENTO IN CONTANTI/CASSA ---
  revalidatePath("/admin"); 
  return { 
    success: true, 
    message: "Ordine inviato!", 
    orderId: orderData.id 
  };
}

export async function confirmOrderPayment(orderId: string) {
    console.log("------------------------------------------------");
    console.log("1. INIZIO CONFERMA PER ID:", orderId);

    try {
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        
        if (!serviceKey || !supabaseUrl) {
            console.error("❌ ERRORE: Chiavi mancanti!");
            return { 
                success: false, 
                message: `Chiavi mancanti su Vercel. URL: ${!!supabaseUrl}, KEY: ${!!serviceKey}` 
            };
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

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
        
        return { success: true, data: data };

    } catch (err: any) {
        console.error("❌ ERRORE CRITICO:", err.message);
        return { success: false, message: "Errore interno: " + err.message };
    }
}