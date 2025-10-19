import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Login sayfası ve public assets için middleware'i atla
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isPublicFile =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.includes(".");

  if (isLoginPage || isPublicFile) {
    return NextResponse.next();
  }

  // Session cookie kontrolü (basit - NextAuth __Secure-next-auth.session-token)
  const sessionCookie =
    request.cookies.get("__Secure-next-auth.session-token") ||
    request.cookies.get("next-auth.session-token");

  if (!sessionCookie) {
    // Session yok, login'e yönlendir
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|sw.js|manifest.json).*)",
  ],
};

