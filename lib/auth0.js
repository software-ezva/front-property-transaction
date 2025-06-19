// lib/auth0.js

import { Auth0Client } from "@auth0/nextjs-auth0/server";

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
    // In v4, the AUTH0_SCOPE and AUTH0_AUDIENCE environment variables for API authorized applications are no longer automatically picked up by the SDK.
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
    // Configurar redirección por defecto después del login
    baseURL: process.env.APP_BASE_URL,
    routes: {
      callback: "/auth/callback",
      postLogoutRedirect: "/dashboard",
    },
    // Configurar redirección después del login exitoso
    afterCallback: (req, session, state) => {
      return session;
    },
  },
});
