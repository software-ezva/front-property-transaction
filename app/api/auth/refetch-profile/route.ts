import { auth0 } from "@/lib/auth0";
import { getDashboardRoute } from "@/lib/profile-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Try to get access token from session or tokenSet
    const accessToken =
      session.accessToken || (session as any).tokenSet?.accessToken;

    if (!accessToken) {
      // If we don't have an access token, we might need to re-login
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Prepare user data for backend synchronization
    const userPayload = {
      sub: session.user.sub,
      email: session.user.email,
      name: session.user.name,
      firstName: session.user.first_name,
      lastName: session.user.last_name,
    };

    // Synchronize user with backend
    const syncResponse = await fetch(
      `${process.env.BACKEND_API_URL}/users/sync`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      }
    );

    if (syncResponse.ok) {
      const syncResult = await syncResponse.json();
      const profile = syncResult?.profile;
      const profileType = profile?.profileType;

      if (profile && profileType) {
        // Update the session with the profile and clear backend error
        const updatedUser = { ...session.user, profile };
        if ("backendError" in updatedUser) {
          delete updatedUser.backendError;
        }

        await auth0.updateSession({
          ...session,
          user: updatedUser,
        });

        const redirectUrl = getDashboardRoute(profileType);
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }

    // If no profile found or sync failed, redirect to role selection
    // But if we are here, it means middleware detected a profile, so this is a fallback
    return NextResponse.redirect(
      new URL("/signup/role-selection", request.url)
    );
  } catch (error) {
    console.error("Error refetching profile:", error);
    return NextResponse.redirect(new URL("/service-unavailable", request.url));
  }
}
