import { auth0, syncUserWithBackend } from "@/lib/auth0";
import { getDashboardRoute } from "@/lib/profile-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    const baseUrl = process.env.APP_BASE_URL || request.url;

    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/auth/login", baseUrl));
    }

    // Try to get access token from session or tokenSet
    const accessToken =
      session.accessToken || (session as any).tokenSet?.accessToken;

    if (!accessToken) {
      // If we don't have an access token, we might need to re-login
      return NextResponse.redirect(new URL("/auth/login", baseUrl));
    }

    try {
      // Synchronize user with backend using the centralized function
      const syncResult = await syncUserWithBackend(session, accessToken);

      // If we are here, the backend is ONLINE.
      // We need to update the session to clear any previous backendError
      // and update the profile if we got one.

      const profile = syncResult?.profile;
      const profileType = profile?.profileType;

      const updatedUser = { ...session.user };

      // Clear backend error flag since sync succeeded
      if ("backendError" in updatedUser) {
        delete updatedUser.backendError;
      }

      // Update profile if found
      if (profile && profileType) {
        updatedUser.profile = profile;
      }

      // Persist changes to session
      await auth0.updateSession({
        ...session,
        user: updatedUser,
      });

      // Determine redirect destination
      if (profile && profileType) {
        const redirectUrl = getDashboardRoute(profileType);
        return NextResponse.redirect(new URL(redirectUrl, baseUrl));
      } else {
        // Backend online, but no profile -> Role Selection
        return NextResponse.redirect(
          new URL("/signup/role-selection", baseUrl)
        );
      }
    } catch (syncError) {
      const errorMessage =
        syncError instanceof Error ? syncError.message : "Unknown error";
      console.error("Error syncing user in refetch-profile:", errorMessage);

      // Backend still OFFLINE or error occurred -> Service Unavailable
      return NextResponse.redirect(new URL("/service-unavailable", baseUrl));
    }

    // Fallback (should not be reached due to returns above)
    return NextResponse.redirect(new URL("/signup/role-selection", baseUrl));
  } catch (error) {
    console.error("Error refetching profile:", error);
    return NextResponse.redirect(new URL("/service-unavailable", baseUrl));
  }
}
