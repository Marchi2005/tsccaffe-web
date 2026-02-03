import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // LOG DI DEBUG: Se non vedi questo nel terminale quando vai su /admin, 
  // il file è nella cartella sbagliata.
  console.log("proxy in esecuzione su percorso:", request.nextUrl.pathname);

  // 1. Intercetta solo le rotte che iniziano con /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Ignora la pagina di login stessa (altrimenti va in loop infinito)
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // 2. Controlla se esiste il cookie "admin_session"
    const hasCookie = request.cookies.has('admin_session');

    // 3. Se NON c'è il cookie, redirige al login
    if (!hasCookie) {
      console.log("Accesso negato: Redirect al login");
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configurazione: dice a Next.js su quali percorsi attivare il middleware
export const config = {
  matcher: '/admin/:path*',
};