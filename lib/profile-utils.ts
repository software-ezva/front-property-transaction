/**
 * Utilidades centralizadas para manejar tipos de perfil y redirecciones
 */

// Tipos de perfil válidos
export const PROFILE_TYPES = {
  CLIENT: "client",
  REAL_ESTATE_AGENT: "real_estate_agent",
  BROKER: "broker",
  SUPPORTING_PROFESSIONAL: "supporting_professional",
} as const;

export type ProfileType = (typeof PROFILE_TYPES)[keyof typeof PROFILE_TYPES];

// Rutas de dashboard por tipo de perfil
export const DASHBOARD_ROUTES = {
  [PROFILE_TYPES.CLIENT]: "/client/dashboard",
  [PROFILE_TYPES.REAL_ESTATE_AGENT]: "/agent/dashboard",
  [PROFILE_TYPES.BROKER]: "/broker/dashboard",
  [PROFILE_TYPES.SUPPORTING_PROFESSIONAL]: "/supporting-professional/dashboard",
} as const;

// Rutas base por tipo de perfil (para validaciones de middleware)
export const BASE_ROUTES = {
  [PROFILE_TYPES.CLIENT]: "/client",
  [PROFILE_TYPES.REAL_ESTATE_AGENT]: "/agent",
  [PROFILE_TYPES.BROKER]: "/broker",
  [PROFILE_TYPES.SUPPORTING_PROFESSIONAL]: "/supporting-professional",
} as const;

// Mensajes de estado por tipo de perfil
export const STATUS_MESSAGES = {
  [PROFILE_TYPES.CLIENT]: "Setting up your client area...",
  [PROFILE_TYPES.REAL_ESTATE_AGENT]: "Preparing your agent dashboard...",
  [PROFILE_TYPES.BROKER]: "Setting up your professional workspace...",
  [PROFILE_TYPES.SUPPORTING_PROFESSIONAL]:
    "Setting up your professional workspace...",
} as const;

/**
 * Obtiene la ruta del dashboard para un tipo de perfil
 */
export function getDashboardRoute(
  profileType: string | null | undefined
): string {
  if (
    !profileType ||
    profileType == null ||
    profileType === "" ||
    profileType == undefined
  )
    return "/signup/role-selection";

  const route = DASHBOARD_ROUTES[profileType as ProfileType];
  return route || "/signup/role-selection";
}

/**
 * Obtiene la ruta base para un tipo de perfil
 */
export function getBaseRoute(
  profileType: string | null | undefined
): string | null {
  if (!profileType) return null;

  return BASE_ROUTES[profileType as ProfileType] || null;
}

/**
 * Obtiene el mensaje de estado para un tipo de perfil
 */
export function getStatusMessage(
  profileType: string | null | undefined
): string {
  if (!profileType) return "Almost there...";

  return STATUS_MESSAGES[profileType as ProfileType] || "Almost there...";
}

/**
 * Verifica si un usuario puede acceder a una ruta específica
 */
export function canAccessRoute(
  profileType: string | null | undefined,
  routePath: string
): boolean {
  if (!profileType) return false;

  const allowedRoute = getBaseRoute(profileType);
  if (!allowedRoute) return false;

  return routePath.startsWith(allowedRoute);
}

/**
 * Obtiene la ruta de redirección correcta para un tipo de perfil
 * (útil para redirecciones en middleware)
 */
export function getCorrectRoute(
  profileType: string | null | undefined
): string {
  return getDashboardRoute(profileType);
}

/**
 * Verifica si un tipo de perfil es broker o supporting professional
 */
export function isBrokerType(profileType: string | null | undefined): boolean {
  return (
    profileType === PROFILE_TYPES.BROKER ||
    profileType === PROFILE_TYPES.SUPPORTING_PROFESSIONAL
  );
}

/**
 * Verifica si un tipo de perfil es válido
 */
export function isValidProfileType(
  profileType: string | null | undefined
): profileType is ProfileType {
  if (!profileType) return false;
  return Object.values(PROFILE_TYPES).includes(profileType as ProfileType);
}
