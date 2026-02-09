// FILE: src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middlewareProxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const pathname = url.pathname;

  console.log(`[Proxy] Routing: ${pathname}`);

  // 1. GESTIONE ADMIN (Passa diretto)
  if (pathname.startsWith("/admin")) {
    if (pathname !== "/admin/login") {
      const hasCookie = request.cookies.has("admin_session");
      if (!hasCookie) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
    return NextResponse.next();
  }

  // 2. GESTIONE SITI (Rewrite)
  const isLuna = hostname.includes("lunaevents");
  const targetFolder = isLuna ? "site-luna" : "site-tsc";

  // Stop loop infiniti
  if (pathname.startsWith(`/${targetFolder}`)) {
    return NextResponse.next();
  }

  // Rewrite
  url.pathname = `/${targetFolder}${pathname}`;
  return NextResponse.rewrite(url);
}