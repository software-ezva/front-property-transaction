/**
 * Constantes de la aplicación
 */

import { LogIn } from "lucide-react";
import { auth0 } from "./auth0";

export const ENDPOINTS = {
  api: {
    AGENT_PROFILE: "/agents",
    CLIENT_PROFILE: "/clients",
    TRANSACTIONS: "/transactions",
    PROPERTIES: "/properties",
  },
  internal: {
    AGENT_PROFILE: "/api/agents",
    CLIENT_PROFILE: "/api/clients",
    TRANSACTIONS: "/api/transactions",
    PROPERTIES: "/api/properties",
  },

  HEALTH_CHECK: "health",
  auth0: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/login?screen_hint=signup",
    LOGOUT: "/auth/logout",
    CALLBACK: "/auth/callback",
    PROFILE: "/auth/profile",
    ACCESS_TOKEN: "/auth/access-token",
  },
};
