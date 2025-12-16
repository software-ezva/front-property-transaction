import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";
import { ApiServerClient } from "./api-server";

export interface SyncUserResult {
  profile?: {
    profileType?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Synchronizes the user with the backend and retrieves their profile
 */
export async function syncUserWithBackend(
  session: any,
  accessToken: string
): Promise<SyncUserResult> {
  try {
    const userPayload = {
      sub: session.user.sub,
      email: session.user.email,
      name: session.user.name,
      firstName: session.user.first_name || session.user.given_name,
      lastName: session.user.last_name || session.user.family_name,
    };

    // Use the server API client to perform synchronization
    console.log("[DEBUG] Syncing user with backend...");
    console.log("[DEBUG] Backend URL:", process.env.BACKEND_API_URL);
    console.log(
      "[DEBUG] Access Token (first 10 chars):",
      accessToken.substring(0, 10) + "..."
    );
    console.log("[DEBUG] Auth0 Audience:", process.env.AUTH0_AUDIENCE);

    // DEBUG: Log environment variables at runtime
    console.log("--- [DEBUG] RUNTIME ENVIRONMENT VARIABLES ---");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("APP_BASE_URL:", process.env.APP_BASE_URL);
    console.log("BACKEND_API_URL:", process.env.BACKEND_API_URL);
    console.log("AUTH0_DOMAIN:", process.env.AUTH0_DOMAIN);
    console.log("AUTH0_CLIENT_ID:", process.env.AUTH0_CLIENT_ID);
    console.log("AUTH0_SECRET (Exists?):", !!process.env.AUTH0_SECRET);
    console.log(
      "AUTH0_CLIENT_SECRET (Exists?):",
      !!process.env.AUTH0_CLIENT_SECRET
    );
    console.log("AUTH0_AUDIENCE:", process.env.AUTH0_AUDIENCE);
    console.log("AUTH0_SCOPE:", process.env.AUTH0_SCOPE);
    console.log("AUTH0_COOKIE_SAME_SITE:", process.env.AUTH0_COOKIE_SAME_SITE);
    console.log("AUTH0_COOKIE_SECURE:", process.env.AUTH0_COOKIE_SECURE);
    console.log("---------------------------------------------");

    const syncResult = await ApiServerClient.post<SyncUserResult>(
      "/users/sync",
      userPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return syncResult;
  } catch (error) {
    console.error("Error syncing user with backend:", error);
    throw error;
  }
}

// Initialize the Auth0 client
export const auth0 = new Auth0Client({
  // Options are loaded from environment variables by default
  // Ensure necessary environment variables are properly set
  // domain: process.env.AUTH0_DOMAIN,
  // clientId: process.env.AUTH0_CLIENT_ID,
  // clientSecret: process.env.AUTH0_CLIENT_SECRET,
  // appBaseURL: process.env.APP_BASE_URL,
  // secret: process.env.AUTH0_SECRET,
  authorizationParameters: {
    // In v4, the AUTH0_SCOPE and AUTH0_AUDIENCE environment variables for ApiClientSide authorized applications are no longer automatically picked up by the SDK.
    // Instead, we need to provide the values explicitly.
    scope: process.env.AUTH0_SCOPE,
    audience: process.env.AUTH0_AUDIENCE,
  },
  session: {
    rolling: true,
    absoluteDuration: 6 * 60 * 60, // 6 session hours
    inactivityDuration: 2 * 60 * 60, // 2 inactivity hours
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      name: "prtra_session",
    },
  },

  // Synchronize user with backend after login/registration
  async beforeSessionSaved(session, idToken) {
    try {
      const accessToken = session.tokenSet?.accessToken;

      if (accessToken) {
        try {
          const syncResult = await syncUserWithBackend(session, accessToken);

          // Check for profileType in the response
          const profile = syncResult?.profile;
          const profileType = profile?.profileType;

          // Store the complete profile in the session
          if (profile && profileType) {
            session.user.profile = profile;
          }

          // Set redirect URL based on profile type using centralized utility
          const { getDashboardRoute } = await import("./profile-utils");
          const redirectUrl = getDashboardRoute(profileType);
          session.user.redirectTo = redirectUrl;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error("❌ Error synchronizing user:", errorMessage);
          // If server error or network error, mark as backend error
          // "fetch failed" usually means network error (ECONNREFUSED, etc)
          if (
            error instanceof Error &&
            (error.message.includes("500") ||
              error.message.includes("fetch failed"))
          ) {
            session.user.backendError = true;
          }
        }
      }
    } catch (syncError) {
      console.error("Error in user synchronization:", syncError);
      // Mark session as having a backend error so middleware can handle it
      session.user.backendError = true;
    }

    return session;
  },
});
