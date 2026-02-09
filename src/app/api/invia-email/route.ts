import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { TSCTemplate } from '@/components/emails/TSCTemplate';
import { createClient } from '@supabase/supabase-js'; // Importiamo Supabase

const resend = new Resend(process.env.RESEND_API_KEY);

console.log("--- DEBUG CHIAVI SUPABASE ---");
console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "OK" : "MANCANTE");
console.log("ANON KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "OK" : "MANCANTE");
console.log("SERVICE KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "OK PRESENTE!" : "❌ MANCANTE O NULLA");
console.log("-----------------------------");

// Logica di selezione chiave
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Se manca la Service Key, il codice usa la Anon Key e QUINDI FALLISCE l'insert
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, message, senderType } = body;

    // 1. Controllo Dati
    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Mancano dati obbligatori' }, { status: 400 });
    }

    // 2. Configurazione Mittente
    let fromEmail = 'Tabacchi San Clemente Caffè <info@tsccaffe.it>'; 
    let replyToEmail = 'info@tsccaffe.it';

    if (senderType === 'supporto') {
      fromEmail = 'TSC Caffè Assistenza Clienti <supporto@tsccaffe.it>';
      replyToEmail = 'info@tsccaffe.it'; 
    }

    // 3. Render HTML
    const emailHtml = await render(TSCTemplate({ 
      messaggio: message, 
      oggetto: subject 
    }));

    // 4. Invio con Resend
    const data = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: emailHtml,
      replyTo: replyToEmail,
      bcc: ['info@tsccaffe.it'] // Manteniamo la copia carbone per sicurezza
    });

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    // 5. SALVATAGGIO SU SUPABASE (La novità!) 💾
    // Non blocchiamo l'utente se il salvataggio fallisce, ma lo facciamo in background
    const { error: dbError } = await supabase
      .from('email_logs')
      .insert([
        { 
          recipient: to, 
          subject: subject, 
          sender_type: senderType,
          status: 'sent'
        }
      ]);
    
    if (dbError) {
      console.error("Errore salvataggio DB:", dbError);
      // Non ritorniamo errore all'utente perché l'email è partita comunque
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Errore sconosciuto' }, { status: 500 });
  }
}