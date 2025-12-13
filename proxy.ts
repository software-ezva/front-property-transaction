import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0, syncUserWithBackend } from "./lib/auth0";

const protectedRoutes = [
  "/transaction-coordinator",
  "/client",
  "/broker",
  "/signup",
  "/viewer",
  "/real-estate-agent",
  "/supporting-professional",
];

const publicRoutes = ["/"];

export async function proxy(request: NextRequest) {
  // Only run the Auth0 middleware for /auth routes (callbacks, login, logout).
  // For protected routes we will use auth0.getSession to avoid returning
  // intermediate auth redirect responses that can cause extra middleware passes.
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return await auth0.middleware(request);
  }

  const isPublicRoute = publicRoutes.some(
    (route) => request.nextUrl.pathname === route
  );
  // Allow explicitly public routes to pass through without session checks.
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Only enforce protected-route redirects for navigation requests (browsers
  // requesting HTML). This prevents background XHR/fetch calls from being
  // redirected and re-triggering the middleware repeatedly.
  const acceptHeader = request.headers.get("accept") || "";
  const isNavigation =
    request.method === "GET" && acceptHeader.includes("text/html");

  if (isProtectedRoute && isNavigation) {
    try {
      const session = await auth0.getSession(request);

      if (!session?.user) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check if there was a backend error during login
      if (session.user.backendError) {
        return NextResponse.redirect(
          new URL("/service-unavailable", request.url)
        );
      }

      // If user is on role selection but has no profile, verify if profile exists in backend
      // This handles the case where backend was down during login but is up now
      if (
        request.nextUrl.pathname === "/signup/role-selection" &&
        !session.user.profile?.profileType
      ) {
        try {
          // Try to get access token from session or tokenSet
          const accessToken =
            session.accessToken || (session as any).tokenSet?.accessToken;

          if (accessToken) {
            try {
              const syncResult = await syncUserWithBackend(
                session,
                accessToken
              );
              if (syncResult?.profile?.profileType) {
                // Profile exists! Redirect to refetch endpoint to update session
                return NextResponse.redirect(
                  new URL("/api/auth/refetch-profile", request.url)
                );
              }
            } catch (syncError) {
              // Silent fail in middleware, let the user continue to role selection
              // or if it's a critical error, we could redirect to service-unavailable
              // But since we already checked backendError above, this is an optimistic check
            }
          }
        } catch (error) {
          console.error("Error verifying profile in middleware:", error);
        }
      }

      const profileType = session.user.profile?.profileType;

      // /viewer routes are accessible by any authenticated user (agents, clients, supporting professionals)
      // so we skip profile-based access checks for those routes
      const isViewerRoute = request.nextUrl.pathname.startsWith("/viewer");

      if (!isViewerRoute) {
        // Redirecciones basadas en el tipo de perfil usando utilidad centralizada
        const { canAccessRoute, getCorrectRoute } = await import(
          "./lib/profile-utils"
        );

        if (!canAccessRoute(profileType, request.nextUrl.pathname)) {
          const correctRoute = getCorrectRoute(profileType);

          // If the correct route is the same as the current one (e.g. profileType undefined
          // and user is already on /signup/role-selection), allow the request to proceed
          // to avoid redirect loops.
          // Also allow signup routes ONLY if the user does not have a profile yet.
          if (
            correctRoute === request.nextUrl.pathname ||
            (request.nextUrl.pathname.startsWith("/signup") && !profileType)
          ) {
            return NextResponse.next();
          }

          return NextResponse.redirect(new URL(correctRoute, request.url));
        }
      }
    } catch (error) {
      console.error("Error verificando sesión:", error);
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If this is a protected route but not a navigation request (e.g. an XHR/fetch),
  // allow it to proceed so APIs and background calls aren't redirected.
  if (isProtectedRoute && !isNavigation) {
    return NextResponse.next();
  }

  // Handle viewer routes - require authentication but allow any user type
  return NextResponse.next();
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
