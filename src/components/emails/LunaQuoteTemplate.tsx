import * as React from 'react';
import {
  Html,
  Body,
  Container,
  Section,
  Img,
  Text,
  Link,
} from '@react-email/components';

interface LunaQuoteEmailProps {
  name: string;
  quoteNumber: string;
  customMessage: string;
}

// --- FOOTER CONDIVISO ---
const SharedFooter = () => (
  <Section style={footer}>
    <Text style={footerBrandTitle}>Luna Events</Text>
    <Text style={footerSubtitle}>di Tabacchi San Clemente Caffè</Text>
    <Text style={footerText}>Via Galatina 95, 81100 Caserta</Text>
    <Text style={footerText}>
      <Link href="mailto:info@lunaevents.it" style={linkBordeaux}>info@lunaevents.it</Link> • Tel: +39 371 542 8345
    </Text>

    {/* Social Links Coordinati */}
    <Section style={{ textAlign: 'center', margin: '20px 0' }}>
      <Link href="https://www.instagram.com/lunaevents.it" style={socialBtn}>Instagram</Link>
      &nbsp;&nbsp;
      <Link href="https://www.facebook.com/lunaevents.it" style={socialBtn}>Facebook</Link>
      &nbsp;&nbsp;
      <Link href="https://www.tiktok.com/@lunaevents.it" style={socialBtn}>TikTok</Link>
    </Section>

    <Text style={copyrightText}>
      © {new Date().getFullYear()} — Tutti i diritti riservati • P.IVA: 04124110612
    </Text>
    <Text style={disclaimerText}>
      Questa è una notifica automatica generata dal sistema. Si prega di non rispondere direttamente a questa email.
    </Text>
  </Section>
);

export const LunaQuoteTemplate = ({ name, quoteNumber, customMessage }: LunaQuoteEmailProps) => {
  // Converte i ritorni a capo in paragrafi o interruzioni pulite per React
  const formattedMessage = customMessage ? customMessage : "In allegato trovi la proposta personalizzata elaborata per il tuo evento.";

  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          {/* Header con Logo Assoluto */}
          <Section style={header}>
            <Img 
              src="https://www.lunaevents.it/icons/logo_luna.png" 
              width="220" 
              alt="Luna Events Logo" 
              style={logo} 
            />
          </Section>

          {/* Contenuto Principale */}
          <Section style={content}>
            <Text style={titleCustomer}>Il tuo Preventivo Luna Events</Text>
            
            <Text style={paragraphGreeting}>Gentile {name || 'Cliente'},</Text>
            
            {/* Messaggio Personalizzato inviato dall'Admin */}
            <Text style={paragraphMessage}>{formattedMessage}</Text>
            
            <Text style={paragraph}>
              Il documento allegato alla presente racchiude tutti i dettagli dei servizi proposti, le specifiche d'allestimento e i costi trasparenti relativi alle tue richieste.
            </Text>

            {/* Riferimento Pratica Discreto */}
            <Section style={referenceBox}>
              <Text style={referenceTitle}>Riferimento Pratica</Text>
              <Text style={referenceCode}>{quoteNumber}</Text>
            </Section>

            <Text style={paragraphClosing}>
              Restiamo a tua completa disposizione per qualsiasi modifica, chiarimento o per fissare un appuntamento dedicato.
            </Text>
          </Section>

          {/* Footer del Brand */}
          <SharedFooter />
        </Container>
      </Body>
    </Html>
  );
};

// --- STILI CSS ---
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#FFFFFF',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '16px',
  border: '1px solid #EAE5E0',
  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
};

const header = {
  textAlign: 'center' as const,
  padding: '30px 0 15px 0',
  borderBottom: '1px solid #F5F2EF',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const content = {
  padding: '10px 40px 0 40px',
};

const titleCustomer = {
  color: '#7A0018',
  fontSize: '24px',
  fontWeight: 'normal',
  marginBottom: '25px',
  fontFamily: '"Playfair Display", Georgia, serif',
  marginTop: '35px',
};

const paragraphGreeting = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#111111',
  marginBottom: '15px',
};

const paragraphMessage = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#333333',
  whiteSpace: 'pre-wrap' as const,
  marginBottom: '20px',
  fontStyle: 'italic',
  backgroundColor: '#FAF8F5',
  padding: '15px',
  borderRadius: '8px',
  borderLeft: '3px solid #7A0018',
};

const paragraph = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#4A4A4A',
  marginBottom: '20px',
};

const paragraphClosing = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#4A4A4A',
  marginTop: '25px',
  marginBottom: '10px',
};

const referenceBox = {
  marginTop: '25px',
  backgroundColor: '#FAF8F5',
  border: '1px solid #EAE5E0',
  padding: '15px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  maxWidth: '250px',
  margin: '25px auto',
};

const referenceTitle = {
  margin: '0',
  color: '#8A8580',
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  fontWeight: 'bold',
};

const referenceCode = {
  margin: '4px 0 0 0',
  fontFamily: 'monospace',
  color: '#7A0018',
  fontWeight: 'bold',
  fontSize: '15px',
};

const linkBordeaux = { color: '#7A0018', textDecoration: 'none', fontWeight: '500' };

const footer = {
  marginTop: '30px',
  borderTop: '1px solid #EAE5E0',
  padding: '25px 40px',
  textAlign: 'center' as const,
  color: '#8A8580',
};

const footerBrandTitle = { margin: '0', fontWeight: 'bold', color: '#4A4540', fontSize: '13px' };
const footerSubtitle = { margin: '2px 0 10px 0', fontStyle: 'italic', fontSize: '11px' };
const footerText = { margin: '2px 0', fontSize: '12px' };

const socialBtn = {
  display: 'inline-block',
  backgroundColor: '#FAF8F5',
  color: '#7A0018',
  border: '1px solid #EAE5E0',
  padding: '6px 14px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
};

const copyrightText = { margin: '15px 0 0 0', fontSize: '11px', color: '#B0A9A2' };
const disclaimerText = { margin: '15px 0 0 0', fontSize: '10px', color: '#C4BEB7', borderTop: '1px dashed #F2ECE6', paddingTop: '15px' };