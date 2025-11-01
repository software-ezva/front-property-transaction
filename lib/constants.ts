
export const ENDPOINTS = {
  api: {
    AGENT_PROFILE: "/agents",
    CLIENT_PROFILE: "/clients",
    TRANSACTIONS: "/transactions",
    PROPERTIES: "/properties",
    TEMPLATES: "/templates",
    DOCUMENTS: "/documents",
    DOCUMENT_TEMPLATES: "/document-templates",
    BROKER_PROFILE: "/brokers",
    SUPPORTING_PROFESSIONALS: "/supporting-professionals",
    BROKERAGE: "/brokerages",
    BROKER_BROKERAGE: "/brokers/me/brokerage",
    JOIN_BROKERAGE: (profileType: string) =>
      `/${profileType}/me/join-brokerage`,
    REGENERATE_ACCESS_CODE: (brokerageId: string) =>
      `/brokerages/${brokerageId}/regenerate-access-code`,
  },
  internal: {
    AGENT_PROFILE: "/api/agents",
    CLIENT_PROFILE: "/api/clients",
    TRANSACTIONS: "/api/transactions",
    PROPERTIES: "/api/properties",
    TEMPLATES: "/api/templates",
    DOCUMENTS: "/api/documents",
    DOCUMENT_TEMPLATES: "/api/document-templates",
    BROKER_PROFILE: "/api/brokers",
    SUPPORTING_PROFESSIONALS: "/api/supporting-professionals",
    BROKERAGE: "/api/brokers/brokerage",
    JOIN_BROKERAGE: (profileType: string) =>
      `/api/${profileType}/brokerage/join`,
    REGENERATE_ACCESS_CODE: "/api/brokers/brokerage/regenerate-access-code",
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
