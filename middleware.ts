import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  //return await auth0.middleware(request);
  const auth0Response = await auth0.middleware(request);

  // Si es ruta de Auth0 (/auth/*), dejar que Auth0 la maneje
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return auth0Response;
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

      console.log("Usuario autenticado:", session.user.email);
    } catch (error) {
      console.error("Error verificando sesión:", error);
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
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
