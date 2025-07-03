/**
 * Constantes de la aplicación
 */

import { LogIn } from "lucide-react";
import { auth0 } from "./auth0";

// Endpoints de la ApiClientSide
export const ENDPOINTS = {
  // Perfiles
  api: {
    AGENT_PROFILE: "profiles/agent",
    CLIENT_PROFILE: "profiles/client",
  },

  // Salud del sistema
  HEALTH_CHECK: "health",

  // Autenticación
  auth0: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/login?screen_hint=signup",
    LOGOUT: "/auth/logout",
    CALLBACK: "/auth/callback",
    PROFILE: "/auth/profile",
    ACCESS_TOKEN: "/auth/access-token",
  },
};
