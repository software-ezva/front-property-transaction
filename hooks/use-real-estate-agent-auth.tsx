"use client";

import { useUser } from "@auth0/nextjs-auth0";

interface RealEstateAgentProfile {
  esign_name: string;
  esign_initials: string;
  license_number: string;
  mls_number?: string;
  profileType?: string;
}

interface RealEstateAgentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  profile: {
    esign_name: string;
    esign_initials: string;
    license_number: string;
    mls_number?: string;
  };
}

interface RealEstateAgentUserForHeader {
  name: string;
  profile: string;
  avatar: string;
}

interface UseRealEstateAgentAuthReturn {
  user: any;
  agentProfile: RealEstateAgentProfile | null;
  agentUser: RealEstateAgentUser | null;
  agentUserForHeader: RealEstateAgentUserForHeader | null;
  isLoading: boolean;
  error: string | null;
}

export function useRealEstateAgentAuth(): UseRealEstateAgentAuthReturn {
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
      error: "User not authenticated",
    };
  }

  // In a real implementation, we would validate the role here
  // const isAgent = user.role === 'real_estate_agent' || user['https://propmanager.com/role'] === 'real_estate_agent';

  const agentProfile: RealEstateAgentProfile = {
    esign_name: (user.profile as any)?.esignName || user.name || "",
    esign_initials: (user.profile as any)?.esignInitials || "",
    license_number: (user.profile as any)?.licenseNumber || "",
    mls_number: (user.profile as any)?.mlsNumber || "",
    profileType: "real_estate_agent",
  };

  const agentUser: RealEstateAgentUser = {
    id: user.sub || user.id || "",
    name:
      (user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.name) || "Agent",
    email: user.email || "",
    role: agentProfile.profileType || "real_estate_agent",
    profile: agentProfile,
  };

  const agentUserForHeader: RealEstateAgentUserForHeader = {
    name:
      (user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.name) || "Agent",
    profile: (agentProfile.profileType || "real_estate_agent").replace(
      /_/g,
      " "
    ),
    avatar: user.picture || "",
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
