"use client";

import { useUser } from "@auth0/nextjs-auth0";

interface AgentProfile {
  esignName: string;
  esignInitials: string;
  licenseNumber: string;
  profileType: string;
}

interface AgentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  profile: {
    esign_name: string;
    esign_initials: string;
    license_number: string;
  };
}

interface AgentUserForHeader {
  name: string;
  profile: string;
  avatar: string;
}

interface UseAgentAuthReturn {
  user: any;
  agentProfile: AgentProfile | null;
  agentUser: AgentUser | null;
  agentUserForHeader: AgentUserForHeader | null;
  isLoading: boolean;
  error: string | null;
}

export function useAgentAuth(): UseAgentAuthReturn {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return {
      user: null,
      agentProfile: null,
      agentUser: null,
      agentUserForHeader: null,
      isLoading: true,
      error: null,
    };
  }

  if (!user) {
    return {
      user: null,
      agentProfile: null,
      agentUser: null,
      agentUserForHeader: null,
      isLoading: false,
      error: "No user session found.",
    };
  }

  if (!user.profile) {
    return {
      user,
      agentProfile: null,
      agentUser: null,
      agentUserForHeader: null,
      isLoading: false,
      error: "No agent profile found.",
    };
  }

  // El perfil guardado en la sesión
  const agentProfile = user.profile as AgentProfile;

  // Crear el agentUser completo
  const agentUser: AgentUser = {
    id: user.sub || user.id || "",
    name: user.first_name + " " + user.last_name || user.name || "Agent",
    email: user.email || "",
    role: agentProfile.profileType || "realestateagent",
    profile: {
      esign_name: agentProfile.esignName,
      esign_initials: agentProfile.esignInitials,
      license_number: agentProfile.licenseNumber,
    },
  };

  // Crear el usuario para el header
  const agentUserForHeader: AgentUserForHeader = {
    name: String(user.first_name + " " + user.last_name || user.name || ""),
    profile: String(agentProfile.profileType?.replace(/_/g, " ") || ""),
    avatar: String(user.picture || ""),
  };

  return {
    user,
    agentProfile,
    agentUser,
    agentUserForHeader,
    isLoading: false,
    error: null,
  };
}
