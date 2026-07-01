import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';

import { LunaQuoteTemplate } from '@/components/emails/LunaQuoteTemplate';

const resend = new Resend(process.env.RESEND_API_KEY_LUNAEVENTS);

const USA_DOMINIO_VERIFICATO = true; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Abbiamo aggiunto 'pdfBase64' tra i dati distrutturati dal body
    const { email, name, quoteNumber, customMessage, pdfBase64 } = body;

    if (!email) {
      return NextResponse.json({ error: 'Mancano dati obbligatori (Email).' }, { status: 400 });
    }

    // Definizione del mittente
    const fromEmail = USA_DOMINIO_VERIFICATO 
      ? 'Luna Events <info@lunaevents.it>' 
      : 'Luna Events Test <onboarding@resend.dev>';

    // Gestione Sandbox
    const destinatarioFinale = USA_DOMINIO_VERIFICATO ? email : 'info@lunaevents.it'; 

    // Compilazione del Template Elegante con React Email
    const quoteHtml = await render(
      LunaQuoteTemplate({
        name,
        quoteNumber,
        customMessage
      })
    );

    // Configurazione degli allegati per Resend
    const attachments = [];
    if (pdfBase64) {
      attachments.push({
        filename: `Preventivo_LunaEvents_${quoteNumber}.pdf`,
        content: pdfBase64, // Resend accetta nativamente stringhe base64 come contenuto
      });
    }

    try {
      // Invio della mail tramite l'SDK di Resend
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [destinatarioFinale],
        subject: `Proposta di Preventivo ${quoteNumber} - Luna Events`,
        html: quoteHtml,
        replyTo: 'info@lunaevents.it',
        attachments: attachments // Passiamo l'array con il PDF allegato
      });

      if (error) {
        console.error("❌ Errore emesso dall'API di Resend:", error);
        return NextResponse.json({ 
          error: `Errore specifico di Resend: ${error.message}` 
        }, { status: 500 });
      }

      console.log(`👉 Preventivo ${quoteNumber} inviato correttamente a ${destinatarioFinale}. Allegato incluso: ${!!pdfBase64}`);
    } catch (emailError) {
      console.error("⚠️ Errore di rete verso i server di Resend:", emailError);
      return NextResponse.json({ error: "Errore di connessione durante l'invio dell'email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ Errore generico imprevisto nell'API Route:", error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}