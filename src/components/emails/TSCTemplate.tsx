import * as React from 'react';
import {
  Html,
  Body,
  Container,
  Section,
  Img,
  Text,
  Link,
  Hr,
  Preview,
  Column,
  Row,
} from '@react-email/components';

interface EmailProps {
  messaggio: string;
  oggetto: string;
}

export const TSCTemplate = ({ messaggio, oggetto }: EmailProps) => {
  const formattedMessage = messaggio ? messaggio.replace(/\n/g, '<br />') : '';

  return (
    <Html>
      <Preview>{oggetto}</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* HEADER: Logo più grande */}
          <Section style={header}>
            <Img
              src="https://www.tsccaffe.it/icons/logo.png"
              width="180" 
              alt="TSC Caffè Logo"
              style={logo}
            />
          </Section>

          {/* CORPO: Contenuto Messaggio */}
          <Section style={content}>
            <Text style={greeting}>Gentile Cliente,</Text>
            <Text 
              style={paragraph} 
              dangerouslySetInnerHTML={{ __html: formattedMessage }} 
            />
            <div style={spacer}></div>
            <Text style={signOff}>
              Un cordiale saluto,<br />
              <strong style={{ color: '#0f172a' }}>Il Team TSC Caffè</strong>
            </Text>
          </Section>

          {/* FOOTER: Identico al sito (Dark Mode) */}
          <Section style={footer}>
            
            {/* 1. Brand & Slogan */}
            <Text style={brandTitle}>
              TABACCHI SAN CLEMENTE <span style={{ color: '#e11d48' }}>CAFFÈ</span>
            </Text>
            <Text style={footerDesc}>
              Non solo un bar, ma il tuo angolo di relax quotidiano. <br/>
              Tra un caffè Illy perfetto e un sorriso.
            </Text>

            {/* 2. Contatti & Indirizzo */}
            <Section style={contactBox}>
              <Text style={contactText}>
                📍 Via Galatina 95, 81100 San Clemente (CE)
              </Text>
              <Text style={contactText}>
                📞 <Link href="tel:+393715428345" style={linkWhite}>371 542 8345</Link>
              </Text>
            </Section>

            {/* 3. Social Links (Bottoni) */}
            <Section style={{ textAlign: 'center' as const, margin: '20px 0' }}>
              <Link href="https://instagram.com/tabacchisanclementecaffe" style={socialBtn}>Instagram</Link>
              &nbsp;&nbsp;
              <Link href="https://www.facebook.com/people/Tabacchi-San-Clemente/100012509505700/" style={socialBtn}>Facebook</Link>
              &nbsp;&nbsp;
              <Link href="https://www.tiktok.com/@tsccaffe" style={socialBtn}>TikTok</Link>
            </Section>

            <Hr style={hr} />

            {/* 4. Copyright & Credits MARCO */}
            <Text style={legalText}>
              © {new Date().getFullYear()} Tabacchi San Clemente di Ianniello Gianpaolo • P.IVA: 04124110612
            </Text>
            
            <Text style={creditsText}>
              Realizzato con ❤️ da{' '}
              <Link href="https://github.com/Marchi2005" style={creditsLink}>
                Marco Ianniello
              </Link>
            </Text>

             <Text style={privacyText}>
              <Link href="https://www.tsccaffe.it/privacy-policy" style={linkGray}>Privacy Policy</Link>
            </Text>

          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// --- STILI CSS ---
const main = {
  backgroundColor: '#f1f5f9', // slate-100
  fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
};

const header = {
  padding: '40px 0 20px 0',
  backgroundColor: '#ffffff',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const content = {
  padding: '20px 40px 40px 40px',
  backgroundColor: '#ffffff',
};

const greeting = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#0f172a',
  marginBottom: '16px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#334155', // slate-700
  margin: '0',
};

const spacer = {
  height: '30px',
};

const signOff = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#334155',
};

// --- STILI FOOTER (Dark Slate) ---
const footer = {
  backgroundColor: '#0f172a', // slate-900
  padding: '40px 20px',
  textAlign: 'center' as const,
  color: '#e2e8f0', // slate-200
};

const brandTitle = {
  fontSize: '18px',
  fontWeight: '800',
  letterSpacing: '1px',
  color: '#ffffff',
  margin: '0 0 10px 0',
  textTransform: 'uppercase' as const,
};

const footerDesc = {
  fontSize: '14px',
  color: '#94a3b8', // slate-400
  lineHeight: '20px',
  marginBottom: '25px',
};

const contactBox = {
  marginBottom: '20px',
};

const contactText = {
  fontSize: '14px',
  color: '#cbd5e1', // slate-300
  margin: '4px 0',
};

const linkWhite = {
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const socialBtn = {
  backgroundColor: '#1e293b', // slate-800
  color: '#ffffff',
  padding: '8px 16px',
  borderRadius: '99px',
  fontSize: '12px',
  fontWeight: '600',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
};

const hr = {
  borderColor: '#334155', // slate-700
  margin: '30px 0 20px 0',
};

const legalText = {
  fontSize: '12px',
  color: '#64748b', // slate-500
  marginBottom: '10px',
};

const creditsText = {
  fontSize: '12px',
  color: '#94a3b8', // slate-400
  marginBottom: '15px',
};

const creditsLink = {
  color: '#e11d48', // brand-red (rose-600)
  fontWeight: 'bold',
  textDecoration: 'none',
};

const privacyText = {
  fontSize: '11px',
};

const linkGray = {
  color: '#64748b',
  textDecoration: 'underline',
};

export default TSCTemplate;