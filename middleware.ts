import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  const authResponse = await auth0.middleware(request);

  // if path starts with /auth, let the auth middleware handle it
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authResponse;
  }

  const publicRoutes = ["/"];
  const isPublicRoute = publicRoutes.some(
    (route) => request.nextUrl.pathname === route
  );
  const protectedRoutes = ["/agent", "/client", "/signup"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) { 
    try {
      const session = await auth0.getSession(request);

      if (!session?.user) {
        console.log("Usuario no autenticado, redirigiendo al login");
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
      const profileType = session.user.profile?.profileType;

      console.log("Usuario autenticado:", session.user.email);
      if (
        request.nextUrl.pathname.startsWith("/agent") &&
        profileType !== "real_estate_agent"
      ) {
        return NextResponse.redirect(new URL("/client/dashboard", request.url));
      }

      // Si intenta acceder a /client y no es cliente, redirige
      if (
        request.nextUrl.pathname.startsWith("/client") &&
        profileType !== "client"
      ) {
        return NextResponse.redirect(new URL("/agent/dashboard", request.url));
      }
      
    } catch (error) {
      console.error("Error verificando sesión:", error);
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return authResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
