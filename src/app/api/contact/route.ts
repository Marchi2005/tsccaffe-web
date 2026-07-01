import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { render } from '@react-email/render';

import { LunaAdminTemplate, LunaCustomerTemplate } from '@/components/emails/LunaEventsTemplate';

const resend = new Resend(process.env.RESEND_API_KEY_LUNAEVENTS);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

const USA_DOMINIO_VERIFICATO = true; 

function formattaDataItaliano(specificDate: string, month: string, year: string, time: string): string {
  if (specificDate) {
    try {
      const dataObj = new Date(specificDate);
      return dataObj.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return specificDate;
    }
  }
  if (month && year) {
    const timeInfo = time ? ` (${time})` : '';
    return `${month} ${year}${timeInfo}`;
  }
  return "Data da definire";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, type, message, specificDate, periodYear, periodMonth, periodTime } = body;

    if (!name || !email || !phone || !type) {
      return NextResponse.json({ error: 'Mancano dati obbligatori.' }, { status: 400 });
    }

    const dataFormattataInItaliano = formattaDataItaliano(specificDate, periodMonth, periodYear, periodTime);

    // ============================================================
    // STEP 1: Salvataggio nel database Supabase
    // ============================================================
    const { error: dbError } = await supabase
      .from('luna_preventivi') 
      .insert([
        { 
          customer_name: name, 
          customer_email: email, 
          customer_phone: phone,
          event_type: type,
          event_date_info: dataFormattataInItaliano,
          specific_date: specificDate || null, 
          customer_message: message || null,
          status: 'nuovo'
        }
      ]);
    
    if (dbError) {
      console.error("❌ Errore critico DB Supabase:", dbError);
      return NextResponse.json({ error: `Errore salvataggio dati` }, { status: 500 });
    }

    const fromEmail = USA_DOMINIO_VERIFICATO 
      ? 'Luna Events <info@lunaevents.it>' 
      : 'Luna Events Test <onboarding@resend.dev>';

    const adminRecipient = 'info@lunaevents.it'; 

    // Costruzione delle Props destinate ai Template React Email
    const emailProps = {
      name,
      email,
      phone,
      type,
      dateInfo: dataFormattataInItaliano,
      message: message || '',
    };

    // ============================================================
    // STEP 2: EMAIL ALL'ADMIN
    // ============================================================
    try {
      const adminHtml = await render(LunaAdminTemplate(emailProps));

      await resend.emails.send({
        from: fromEmail,
        to: [adminRecipient],
        subject: `✨ Nuovo Preventivo - ${type} da ${name}`,
        html: adminHtml,
        replyTo: email,
      });

    } catch (adminEmailError) {
      console.error("⚠️ Errore mail Admin:", adminEmailError);
    }

    // ============================================================
    // STEP 3: EMAIL DI CONFERMA AL CLIENTE
    // ============================================================
    try {
      const customerHtml = await render(LunaCustomerTemplate(emailProps));

      await resend.emails.send({
        from: fromEmail,
        to: [email], 
        subject: `Ricezione Richiesta Preventivo - Luna Events`,
        html: customerHtml,
      });

    } catch (customerEmailError) {
      console.error("⚠️ Errore mail Cliente:", customerEmailError);
    }

    return NextResponse.json({ success: true, message: "Richiesta registrata correttamente!" });

  } catch (error: any) {
    console.error("❌ Errore generico imprevisto nell'API Route:", error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}