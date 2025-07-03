import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";
// Initialize the Auth0 client
export const auth0 = new Auth0Client({
  // Options are loaded from environment variables by default
  // Ensure necessary environment variables are properly set
  // domain: process.env.AUTH0_DOMAIN,
  // clientId: process.env.AUTH0_CLIENT_ID,
  // clientSecret: process.env.AUTH0_CLIENT_SECRET,
  // appBaseUrl: process.env.APP_BASE_URL,
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
    storeAccessToken: true,
  },

  // Synchronize user with backend after login/registration
  async beforeSessionSaved(session, idToken) {
    try {
      const accessToken = session.tokenSet?.accessToken;

      if (accessToken) {
        // Prepare user data for backend synchronization
        const userPayload = {
          sub: session.user.sub,
          email: session.user.email,
          name: session.user.name,
          firstName: session.user.first_name,
          lastName: session.user.last_name,
        };
        console.log("📤 Datos del usuario a sincronizar:", userPayload);

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
          // Check for profileType in the response
          const profile = syncResult?.profile;
          const profileType = profile?.profileType;
          console.log("perfil:", profile);
          console.log("tipo de perfil:", profileType);
          // Store only the profileType string in the session
          if (profileType) {
            session.user.profile = syncResult?.profile;
          }
          if (!profile) {
            session.user.redirectTo = "/signup/role-selection";
          } else if (profileType === "client") {
            session.user.redirectTo = "/client/dashboard";
          } else if (profileType === "real_estate_agent") {
            session.user.redirectTo = "/agent/dashboard";
          }
        } else {
          console.error(
            "Error synchronizing user:",
            syncResponse.status,
            syncResponse.statusText
          );
        }
      }
    } catch (syncError) {
      console.error("Error in user synchronization:", syncError);
      // Don't fail the session due to sync error
    }

    return session;
  },
});
