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

interface LunaEmailProps {
  name: string;
  email: string;
  phone: string;
  type: string;
  dateInfo: string;
  message: string;
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

    {/* Social Links Aggiornati (Tutti lunaevents.it + TikTok) */}
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

// ============================================================
// TEMPLATE 1: EMAIL ALL'ADMIN
// ============================================================
export const LunaAdminTemplate = ({ name, email, phone, type, dateInfo, message }: LunaEmailProps) => {
  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img 
              src="https://www.lunaevents.it/icons/logo_luna.png" 
              width="220" 
              alt="Luna Events Logo" 
              style={logo} 
            />
          </Section>

          <Section style={content}>
            <Text style={titleAdmin}>✨ Nuova Richiesta Ricevuta dal Sito</Text>

            <table style={table}>
              <tbody>
                <tr style={trBorder}><td style={tdLabel}>Nome Cliente:</td><td style={tdValueDark}>{name}</td></tr>
                <tr style={trBorder}><td style={tdLabel}>Email:</td><td style={tdValue}><Link href={`mailto:${email}`} style={linkBordeaux}>{email}</Link></td></tr>
                <tr style={trBorder}><td style={tdLabel}>Telefono:</td><td style={tdValue}><Link href={`tel:${phone}`} style={linkBordeaux}>{phone}</Link></td></tr>
                <tr style={trBorder}><td style={tdLabel}>Tipo Evento:</td><td style={tdValueBordeauxBold}>{type}</td></tr>
                <tr style={trBorder}><td style={tdLabel}>Data / Periodo:</td><td style={tdValueDark}>{dateInfo}</td></tr>
              </tbody>
            </table>

            <Section style={messageBox}>
              <Text style={messageBoxTitle}>Messaggio allegato:</Text>
              <Text style={messageText}>{message || "Nessun testo inserito."}</Text>
            </Section>
          </Section>

          <SharedFooter />
        </Container>
      </Body>
    </Html>
  );
};

// ============================================================
// TEMPLATE 2: EMAIL AL CLIENTE
// ============================================================
export const LunaCustomerTemplate = ({ name, email, phone, type, dateInfo, message }: LunaEmailProps) => {
  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img 
              src="https://www.lunaevents.it/icons/logo_luna.png" 
              width="220" 
              alt="Luna Events Logo" 
              style={logo} 
            />
          </Section>

          <Section style={content}>
            <Text style={titleCustomer}>Grazie della richiesta, {name}!</Text>
            
            <Text style={paragraph}>
              Abbiamo ricevuto la tua richiesta di preventivo. Siamo felici che tu stia valutando la nostra realtà per l'organizzazione del tuo evento: <strong style={colorBordeaux}>{type}</strong>.
            </Text>
            
            <Text style={paragraph}>
              Noi verificheremo con cura la disponibilità della data indicata (<strong>{dateInfo}</strong>) ed elaboreremo una proposta su misura per te. Ti ricontatteremo al più presto.
            </Text>

            <Section style={messageBox}>
              <Text style={messageBoxTitle}>Il messaggio che ci hai inviato:</Text>
              <Text style={messageText}>{message || "Nessun testo aggiuntivo inserito."}</Text>
            </Section>

            <Section style={contactRecapBox}>
              <Text style={messageBoxTitle}>I tuoi recapiti di contatto:</Text>
              <Text style={recapText}><strong>Email:</strong> {email}</Text>
              <Text style={recapText}><strong>Telefono:</strong> {phone}</Text>
              <Text style={recapDisclaimer}>Se noti delle imprecisioni nei tuoi recapiti, rispondi pure a questo messaggio indicandoci i dati corretti.</Text>
            </Section>
          </Section>

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

const titleAdmin = {
  color: '#7A0018',
  fontSize: '20px',
  fontWeight: 'normal',
  borderBottom: '1px solid #7A0018',
  paddingBottom: '8px',
  marginTop: '30px',
};

const titleCustomer = {
  color: '#7A0018',
  fontSize: '24px',
  fontWeight: 'normal',
  marginBottom: '20px',
  fontFamily: '"Playfair Display", Georgia, serif',
  marginTop: '35px',
};

const paragraph = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#4A4A4A',
  marginBottom: '20px',
};

const colorBordeaux = { color: '#7A0018' };

const table = { width: '100%', borderCollapse: 'collapse' as const, margin: '25px 0', fontSize: '15px' };
const trBorder = { borderBottom: '1px solid #F5F2EF' };
const tdLabel = { padding: '10px 0', fontWeight: 'bold', color: '#666666', width: '140px' };
const tdValueDark = { padding: '10px 0', color: '#111111', fontWeight: '500' };
const tdValue = { padding: '10px 0' };
const tdValueBordeauxBold = { padding: '10px 0', color: '#7A0018', fontWeight: 'bold' };
const linkBordeaux = { color: '#7A0018', textDecoration: 'none', fontWeight: '500' };

const messageBox = {
  marginTop: '25px',
  backgroundColor: '#FAF8F5',
  padding: '22px',
  borderRadius: '8px',
  borderLeft: '4px solid #7A0018',
  marginBottom: '25px',
};

const contactRecapBox = {
  backgroundColor: '#FAF8F5',
  border: '1px solid #EAE5E0',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '10px',
};

const messageBoxTitle = {
  margin: '0 0 8px 0',
  color: '#7A0018',
  fontSize: '13px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  fontWeight: 'bold',
};

const messageText = {
  fontStyle: 'italic',
  whiteSpace: 'pre-wrap' as const,
  margin: '0',
  fontSize: '14.5px',
  lineHeight: '1.6',
  color: '#444444',
};

const recapText = { margin: '4px 0', fontSize: '14px', color: '#555555' };
const recapDisclaimer = { margin: '12px 0 0 0', fontSize: '11px', color: '#999999', fontStyle: 'italic' };

const footer = {
  marginTop: '20px',
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