import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In Next.js 16+, la funzione DEVE chiamarsi 'proxy'
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // --- LOG DI DEBUG (Controlla il terminale) ---
  console.log(`[Proxy] Host: ${hostname} | Path: ${pathname}`);

  // 1. PROTEZIONE AREA ADMIN
  if (pathname.startsWith('/admin')) {
    // Escludiamo la pagina di login e le API dal controllo cookie
    if (pathname !== '/admin/login' && !pathname.startsWith('/api/')) {
      const hasCookie = request.cookies.has('admin_session');
      
      if (!hasCookie) {
        console.log("Accesso Admin negato: Redirect al login");
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
    // Se siamo in admin, non facciamo rewrite dei domini
    return NextResponse.next();
  }

  // 2. LOGICA MULTI-DOMINIO
  // Definisci qui i domini (produzione e locale)
  const isLuna = hostname.includes('lunaevents.it') || hostname.includes('lunaevents.local');
  
  // Evitiamo loop infiniti se stiamo già servendo le cartelle interne
  if (pathname.startsWith('/site-tsc') || pathname.startsWith('/site-luna')) {
    return NextResponse.next();
  }

  // A. ROUTING LUNA EVENTS
  if (isLuna) {
    // Mappa tutto il traffico di Luna sulla cartella site-luna
    url.pathname = `/site-luna${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  // B. ROUTING TSC CAFFÈ (Default)
  // Mappa tutto il resto (tsccaffe.it, localhost, ecc) sulla cartella site-tsc
  url.pathname = `/site-tsc${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

// ... (tieni tutto il codice della funzione proxy uguale a prima) ...

// Sostituisci SOLO questo blocco config in fondo al file:
export const config = {
  matcher: [
    /*
     * Match di tutte le richieste ECCETTO:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /_static (Inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. File statici con estensione (immagini, favicon, fonts, ecc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};