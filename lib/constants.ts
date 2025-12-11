export const ENDPOINTS = {
  api: {
    TRANSACTION_COORDINATOR_AGENT_PROFILE: "/transaction-coordinators-agents/",
    REAL_ESTATE_AGENT_PROFILE: "/real-estate-agents",
    CLIENT_PROFILE: "/clients",
    TRANSACTIONS: "/transactions",
    EXPIRING_ITEMS: "/transactions/items/expiring",
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
    TRANSACTION_PEOPLE: (transactionId: string) =>
      `/transactions/${transactionId}/people`,
    TRANSACTION_REGENERATE_ACCESS_CODE: (transactionId: string) =>
      `/transactions/${transactionId}/regenerate-access-code`,
  },
  internal: {
    TRANSACTION_COORDINATOR_AGENT_PROFILE:
      "/api/transaction-coordinators-agents",
    REAL_ESTATE_AGENT_PROFILE: "/api/real-estate-agents",
    CLIENT_PROFILE: "/api/clients",
    TRANSACTIONS: "/api/transactions",
    EXPIRING_ITEMS: "/api/transactions/items/expiring",
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
    TRANSACTION_PEOPLE: (transactionId: string) =>
      `/api/transactions/${transactionId}/people`,
    TRANSACTION_REGENERATE_ACCESS_CODE: (transactionId: string) =>
      `/api/transactions/${transactionId}/regenerate-access-code`,
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
