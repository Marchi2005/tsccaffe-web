"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { DRINKS_DATA, PASTRIES_DATA, PRICE_SPREMUTA, PRICE_SUCCO } from "@/lib/schemas";

// --- 1. FUNZIONI DI SUPPORTO SERVER ---

/**
 * Ricalcola il prezzo di un singolo item basandosi solo sui dati ufficiali in schemas.ts
 */
const getPriceServer = (name: string) => {
  // Cerca nei drink
  const drink = DRINKS_DATA.find(d => name.includes(d.label));
  if (drink) {
    let price = drink.price || 0;
    // Logica Extra Ginseng/Dimensione da page.tsx
    if (name.toLowerCase().includes("grande")) {
      price += name.toLowerCase().includes("ginseng") ? 0.30 : 0.20;
    }
    return price;
  }
  // Cerca nei dolci
  const pastry = PASTRIES_DATA.find(p => name.includes(p.label));
  if (pastry) return pastry.price || 0;

  return 0;
};

async function sendTelegramNotification(orderData: any, itemsSummary: string, isTomorrow: boolean) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const isCard = orderData.payment_method === 'card';
  const statusEmoji = isCard ? "⏳ (Attesa Stripe)" : "✅ (Da pagare in cassa)";
  const deliveryEmoji = orderData.delivery_type === 'ritiro' ? "🏪 RITIRO IN SEDE" : "🛵 CONSEGNA A DOMICILIO";
  const giornoAlert = isTomorrow ? "⚠️🔴 ORDINE PER DOMANI 🔴⚠️" : "✅ ORDINE PER OGGI ✅";

  const message = `
${giornoAlert}
📦 *NUOVO ORDINE # ${orderData.id.toString().slice(-5)}*
--------------------------------
👤 *Cliente:* ${orderData.full_name}
📞 *Tel:* ${orderData.phone}
📍 *Tipo:* ${deliveryEmoji}
🏠 *Indirizzo:* ${orderData.address}
⏰ *Orario:* ${orderData.preferred_time}
📅 *Giorno:* ${isTomorrow ? 'DOMANI' : 'OGGI'}

🛒 *PRODOTTI:*
${itemsSummary}

${orderData.discount_applied > 0 ? `🎟️ *Sconto:* -${orderData.discount_applied.toFixed(2)}€` : ''}
💰 *TOTALE DA INCASSARE:* €${orderData.total_price.toFixed(2)}
--------------------------------
💳 *Metodo:* ${isCard ? 'CARTA ONLINE' : 'CONTANTI'}
📊 *Stato:* ${statusEmoji}
  `.trim();

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
    });
  } catch (err) { console.error("Errore Telegram:", err); }
}

// --- 2. ACTION PRINCIPALE ---

export async function submitOrder(prevState: any, formData: FormData) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-01-27.acacia" as any,
    typescript: true,
  });

  // Estrazione dati base
  const paymentMethod = formData.get("paymentMethod") as string; 
  const promoCodeId = formData.get("promoCodeId") as string | null;
  const isTomorrow = formData.get("isTomorrow") === "si";
  const preferredTime = formData.get("preferredTime") as string;
  const cartDetailsStr = formData.get("cartDetails") as string;
  const clientTotalPrice = parseFloat(formData.get("totalPrice") as string);
  
  let parsedCart = [];
  try {
    parsedCart = JSON.parse(cartDetailsStr || "[]");
  } catch (e) {
    return { success: false, message: "Errore nel carrello." };
  }

  // --- 🔒 SICUREZZA 1: VALIDAZIONE ORARIO (LEAD TIME 45 MIN) ---
  if (!isTomorrow) {
    const now = new Date();
    const nowInMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Gestione formato "08:30" o "08:00 - 09:00" (prende il primo orario utile)
    const timePart = preferredTime.includes("-") ? preferredTime.split(" - ")[0] : preferredTime;
    const [h, m] = timePart.split(':').map(Number);
    const chosenInMinutes = h * 60 + m;

    const LEAD_TIME = 45; // 45 minuti minimi di preparazione/consegna

    if (chosenInMinutes < (nowInMinutes + LEAD_TIME)) {
      return { 
        success: false, 
        message: "Tempo di preparazione insufficiente. Scegli un orario più avanti." 
      };
    }
  }

  // --- 🔒 SICUREZZA 2: RICALCOLO PREZZO E COUPON ---
  let serverPrice = 0;
  parsedCart.forEach((item: any) => {
    if (item.name.includes("Spremuta")) {
      serverPrice += PRICE_SPREMUTA * item.qty;
    } else if (item.name.includes("Succo")) {
      serverPrice += PRICE_SUCCO * item.qty;
    } else if (!item.name.startsWith("🎟️") && !item.name.startsWith("🎁") && !item.name.includes("Stripe")) {
      serverPrice += getPriceServer(item.name) * item.qty;
    }
  });

  // Commissioni Stripe
  if (paymentMethod === 'card') {
    serverPrice += Math.round(((serverPrice * 0.015) + 0.25) * 100) / 100;
  }

  // Verifica Coupon reale sul DB
  let serverDiscount = 0;
  if (promoCodeId) {
    const { data: promo } = await supabase.from('promo_codes').select('*').eq('id', promoCodeId).single();
    if (promo && promo.is_active) {
      if (promo.discount_type === 'percentage') {
        serverDiscount = Math.round((serverPrice * (promo.discount_value / 100)) * 100) / 100;
      } else {
        serverDiscount = promo.discount_value;
      }
      serverPrice -= serverDiscount;
    }
  }

  // Arrotondamento finale (stessa logica frontend)
  const finalServerTotal = Math.floor(serverPrice * 10) / 10;

  // Check finale: se lo scarto è > 0.50€ blocchiamo per sospetta manomissione
  if (Math.abs(finalServerTotal - clientTotalPrice) > 0.50) {
    return { success: false, message: "Errore validazione prezzi." };
  }

  // --- 3. SALVATAGGIO ---
  const deliveryType = formData.get("deliveryType");
  const address = deliveryType === 'ritiro' ? "RITIRO IN SEDE" : formData.get("address");
  const orderSummary = parsedCart.map((item: any) => `• ${item.qty}x ${item.name}`).join("\n");

  let finalNotes = `--- DETTAGLI SCONTRINO ---\n${orderSummary}\n\n--- NOTE CLIENTE ---\n${formData.get("notes") || 'Nessuna'}`;
  if (isTomorrow) finalNotes = `🚨 ORDINE PER DOMANI 🚨\n\n` + finalNotes;

  const { data: orderData, error } = await supabase.from("web_orders").insert({
    full_name: formData.get("fullName"),
    phone: formData.get("phone"),
    address: address,
    delivery_type: deliveryType,
    preferred_time: preferredTime, 
    payment_method: paymentMethod, 
    box_type: formData.get("boxType") || "Colazione", 
    notes: finalNotes,
    quantity: Number(formData.get("quantity") || 1),
    total_price: finalServerTotal, // Salviamo il prezzo calcolato dal server
    status: paymentMethod === 'card' ? 'bozza_in_attesa' : 'da_pagare_in_sede',
    promo_code_id: promoCodeId || null,
    discount_applied: serverDiscount,
  }).select().single();

  if (error || !orderData) {
    console.error("Errore Supabase:", error);
    return { success: false, message: "Errore tecnico salvataggio." };
  }

  if (promoCodeId) await supabase.rpc('increment_promo_uses', { p_promo_id: promoCodeId });

  await sendTelegramNotification(orderData, orderSummary, isTomorrow);

  // --- 4. GESTIONE STRIPE ---
  if (paymentMethod === 'card') {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://tsccaffe.it";
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "eur",
            product_data: {
              name: `Ordine #${orderData.id.toString().slice(-5)} - TSC Caffè`,
              description: `Colazione per ${orderData.full_name}`,
            },
            unit_amount: Math.round(finalServerTotal * 100),
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${baseUrl}/success-colazione?order_id=${orderData.id}`,
        cancel_url: `${baseUrl}/prenota-colazione`, 
      });
      if (session.url) redirect(session.url);
    } catch (e) {
      console.error("Stripe error:", e);
      return { success: false, message: "Errore Stripe." };
    }
  }

  revalidatePath("/admin"); 
  return { success: true, message: "Ordine inviato con successo!", orderId: orderData.id };
}

export async function confirmOrderPayment(orderId: string) {
  try {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!serviceKey || !supabaseUrl) return { success: false, message: "Configurazione server mancante." };

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await supabaseAdmin
      .from("web_orders")
      .update({ status: 'pagato_online' })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return { success: true, data: data };
  } catch (err: any) {
    console.error("Errore conferma pagamento:", err.message);
    return { success: false, message: err.message };
  }
}