import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// CONFIGURAZIONE DI SICUREZZA
// Definisce quali percorsi il middleware deve controllare.
// Esclude immagini, file statici e chiamate API per non rallentare il sito.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const pathname = url.pathname;

  // -----------------------------------------------------------
  // 1. SICUREZZA ADMIN (Server-Side)
  // -----------------------------------------------------------
  // Se qualcuno prova ad entrare in /admin senza permesso, viene bloccato QUI,
  // prima ancora che la pagina venga caricata.
  if (pathname.startsWith("/admin")) {
    // Escludiamo la pagina di login dal controllo (altrimenti loop infinito)
    if (pathname !== "/admin/login") {
      const hasCookie = request.cookies.has("admin_session");
      
      if (!hasCookie) {
        // Redirect forzato al login se non c'è il cookie
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
    // Se è admin, non facciamo rewrite dei domini, lasciamo passare
    return NextResponse.next();
  }

  // -----------------------------------------------------------
  // 2. GESTIONE MULTI-SITO (Luna vs TSC)
  // -----------------------------------------------------------
  
  // Riconoscimento del dominio (incluso localhost per test)
  // Se l'host contiene "lunaevents", serviamo il sito Luna.
  const isLuna = hostname.includes("lunaevents");
  
  // Determiniamo la cartella interna corretta
  const targetFolder = isLuna ? "site-luna" : "site-tsc";

  // PREVENZIONE LOOP INFINITI
  // Se Next.js ha già riscritto l'URL internamente (es. siamo già su /site-tsc/menu),
  // ci fermiamo per evitare che il server vada in loop.
  if (pathname.startsWith(`/${targetFolder}`)) {
    return NextResponse.next();
  }

  // REWRITE (RISCRITTURA INVISIBILE)
  // L'utente vede:  tsccaffe.it/menu
  // Il server serve: src/app/site-tsc/menu
  // L'URL nel browser NON cambia.
  url.pathname = `/${targetFolder}${pathname}`;
  
  return NextResponse.rewrite(url);
}