import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";
import { getDashboardRoute } from "@/lib/profile-utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.redirect(new URL("/api/auth/login", req.url));
    }

    // Check if there was a backend error during login (e.g. connection refused)
    if (session.user.backendError) {
      return NextResponse.redirect(new URL("/service-unavailable", req.url));
    }

    // The profile is populated in lib/auth0.js -> beforeSessionSaved
    const profileType = session.user.profile?.profileType;

    if (!profileType) {
      return NextResponse.redirect(new URL("/signup/role-selection", req.url));
    }

    const dashboardRoute = getDashboardRoute(profileType);
    return NextResponse.redirect(new URL(dashboardRoute, req.url));
  } catch (error) {
    console.error("Login callback error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
