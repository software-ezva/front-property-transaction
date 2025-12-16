import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";
import { getDashboardRoute } from "@/lib/profile-utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession();

    // Use APP_BASE_URL from environment if available, otherwise fallback to request URL
    // This fixes the issue where Cloud Run internal URL (0.0.0.0) is used for redirects
    const baseUrl = process.env.APP_BASE_URL || req.url;

    if (!session?.user) {
      return NextResponse.redirect(new URL("/api/auth/login", baseUrl));
    }

    // Check if there was a backend error during login (e.g. connection refused)
    if (session.user.backendError) {
      return NextResponse.redirect(new URL("/service-unavailable", baseUrl));
    }

    // The profile is populated in lib/auth0.js -> beforeSessionSaved
    const profileType = session.user.profile?.profileType;

    if (!profileType) {
      return NextResponse.redirect(new URL("/signup/role-selection", baseUrl));
    }

    const dashboardRoute = getDashboardRoute(profileType);
    return NextResponse.redirect(new URL(dashboardRoute, baseUrl));
  } catch (error) {
    console.error("Login callback error:", error);
    const baseUrl = process.env.APP_BASE_URL || req.url;
    return NextResponse.redirect(new URL("/", baseUrl));
  }
}
