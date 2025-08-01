"use client";

import { useUser } from "@auth0/nextjs-auth0";

interface ClientProfile {
  esign_name: string;
  esign_initials: string;
  date_of_birth: string;
  preferred_locations?: string[];
  budget_range?: { min: number; max: number };
  profileType?: string;
}

interface ClientUser {
  id: string;
  name: string;
  email: string;
  role: string;
  profile: {
    esign_name: string;
    esign_initials: string;
    date_of_birth: string;
    preferred_locations?: string[];
    budget_range?: { min: number; max: number };
  };
}

interface ClientUserForHeader {
  name: string;
  profile: string;
  avatar: string;
}

interface UseClientAuthReturn {
  user: any;
  clientProfile: ClientProfile | null;
  clientUser: ClientUser | null;
  clientUserForHeader: ClientUserForHeader | null;
  isLoading: boolean;
  error: string | null;
}

export function useClientAuth(): UseClientAuthReturn {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return {
      user: null,
      clientProfile: null,
      clientUser: null,
      clientUserForHeader: null,
      isLoading: true,
      error: null,
    };
  }

  if (!user) {
    return {
      user: null,
      clientProfile: null,
      clientUser: null,
      clientUserForHeader: null,
      isLoading: false,
      error: "No user session found.",
    };
  }

  if (!user.profile) {
    return {
      user,
      clientProfile: null,
      clientUser: null,
      clientUserForHeader: null,
      isLoading: false,
      error: "No client profile found.",
    };
  }

  // El perfil guardado en la sesión
  const clientProfile = user.profile as ClientProfile;

  // Crear el clientUser completo
  const clientUser: ClientUser = {
    id: user.sub || user.id || "",
    name: user.first_name + " " + user.last_name || user.name || "Client",
    email: user.email || "",
    role: clientProfile.profileType || "client",
    profile: {
      esign_name: clientProfile.esign_name,
      esign_initials: clientProfile.esign_initials,
      date_of_birth: clientProfile.date_of_birth,
      preferred_locations: clientProfile.preferred_locations,
      budget_range: clientProfile.budget_range,
    },
  };

  // Crear el usuario para el header
  const clientUserForHeader: ClientUserForHeader = {
    name: String(user.first_name + " " + user.last_name || user.name || ""),
    profile: clientProfile.profileType?.replace(/_/g, " ") || "client",
    avatar: String(user.picture || ""),
  };

  return {
    user,
    clientProfile,
    clientUser,
    clientUserForHeader,
    isLoading: false,
    error: null,
  };
}
