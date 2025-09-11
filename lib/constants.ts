/**
 * Constantes de la aplicación
 */

export const ENDPOINTS = {
  api: {
    AGENT_PROFILE: "/agents",
    CLIENT_PROFILE: "/clients",
    TRANSACTIONS: "/transactions",
    PROPERTIES: "/properties",
    TEMPLATES: "/templates",
    DOCUMENTS: "/documents",
    DOCUMENT_TEMPLATES: "/document-templates",
  },
  internal: {
    AGENT_PROFILE: "/api/agents",
    CLIENT_PROFILE: "/api/clients",
    TRANSACTIONS: "/api/transactions",
    PROPERTIES: "/api/properties",
    TEMPLATES: "/api/templates",
    DOCUMENTS: "/api/documents",
    DOCUMENT_TEMPLATES: "/api/document-templates",
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
