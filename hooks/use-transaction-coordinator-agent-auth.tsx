"use client";

import { useUser } from "@auth0/nextjs-auth0";

interface TransactionCoordinatorAgentProfile {
  esignName: string;
  esignInitials: string;
  licenseNumber: string;
  profileType: string;
}

interface TransactionCoordinatorAgentUser {
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

interface TransactionCoordinatorAgentUserForHeader {
  name: string;
  profile: string;
  avatar: string;
}

interface UseTransactionCoordinatorAgentAuthReturn {
  user: any;
  transactionCoordinatorAgentProfile: TransactionCoordinatorAgentProfile | null;
  transactionCoordinatorAgentUser: TransactionCoordinatorAgentUser | null;
  transactionCoordinatorAgentUserForHeader: TransactionCoordinatorAgentUserForHeader | null;
  isLoading: boolean;
  error: string | null;
}

export function useTransactionCoordinatorAgentAuth(): UseTransactionCoordinatorAgentAuthReturn {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return {
      user: null,
      transactionCoordinatorAgentProfile: null,
      transactionCoordinatorAgentUser: null,
      transactionCoordinatorAgentUserForHeader: null,
      isLoading: true,
      error: null,
    };
  }

  if (!user) {
    return {
      user: null,
      transactionCoordinatorAgentProfile: null,
      transactionCoordinatorAgentUser: null,
      transactionCoordinatorAgentUserForHeader: null,
      isLoading: false,
      error: "No user session found.",
    };
  }

  if (!user.profile) {
    return {
      user,
      transactionCoordinatorAgentProfile: null,
      transactionCoordinatorAgentUser: null,
      transactionCoordinatorAgentUserForHeader: null,
      isLoading: false,
      error: "No agent profile found.",
    };
  }

  // El perfil guardado en la sesión
  const agentProfile = user.profile as TransactionCoordinatorAgentProfile;

  // Crear el agentUser completo
  const agentUser: TransactionCoordinatorAgentUser = {
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
  const agentUserForHeader: TransactionCoordinatorAgentUserForHeader = {
    name: String(user.first_name + " " + user.last_name || user.name || ""),
    profile: String(agentProfile.profileType?.replace(/_/g, " ") || ""),
    avatar: String(user.picture || ""),
  };

  return {
    user,
    transactionCoordinatorAgentProfile: agentProfile,
    transactionCoordinatorAgentUser: agentUser,
    transactionCoordinatorAgentUserForHeader: agentUserForHeader,
    isLoading: false,
    error: null,
  };
}
