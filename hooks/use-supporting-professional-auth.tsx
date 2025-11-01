"use client";

import { useUser } from "@auth0/nextjs-auth0";

interface SupportingProfessionalProfile {
  esignName: string;
  esignInitials: string;
  phoneNumber: string;
  professionalOf: string;
  profileType: string;
}

interface SupportingProfessionalUser {
  id: string;
  name: string;
  email: string;
  role: string;
  profile: {
    esign_name: string;
    esign_initials: string;
    phone_number: string;
    professional_of: string;
  };
}

interface SupportingProfessionalUserForHeader {
  name: string;
  profile: string;
  avatar: string;
}

interface UseSupportingProfessionalAuthReturn {
  user: any;
  supportingProfessionalProfile: SupportingProfessionalProfile | null;
  supportingProfessionalUser: SupportingProfessionalUser | null;
  supportingProfessionalUserForHeader: SupportingProfessionalUserForHeader | null;
  isLoading: boolean;
  error: string | null;
}

export function useSupportingProfessionalAuth(): UseSupportingProfessionalAuthReturn {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return {
      user: null,
      supportingProfessionalProfile: null,
      supportingProfessionalUser: null,
      supportingProfessionalUserForHeader: null,
      isLoading: true,
      error: null,
    };
  }

  if (!user) {
    return {
      user: null,
      supportingProfessionalProfile: null,
      supportingProfessionalUser: null,
      supportingProfessionalUserForHeader: null,
      isLoading: false,
      error: "No user session found.",
    };
  }

  if (!user.profile) {
    return {
      user,
      supportingProfessionalProfile: null,
      supportingProfessionalUser: null,
      supportingProfessionalUserForHeader: null,
      isLoading: false,
      error: "No supporting professional profile found.",
    };
  }

  // El perfil guardado en la sesión
  const supportingProfessionalProfile =
    user.profile as SupportingProfessionalProfile;

  // Crear el supportingProfessionalUser completo
  const supportingProfessionalUser: SupportingProfessionalUser = {
    id: user.sub || user.id || "",
    name: user.first_name + " " + user.last_name || user.name || "Professional",
    email: user.email || "",
    role: supportingProfessionalProfile.profileType || "supporting_professional",
    profile: {
      esign_name: supportingProfessionalProfile.esignName,
      esign_initials: supportingProfessionalProfile.esignInitials,
      phone_number: supportingProfessionalProfile.phoneNumber,
      professional_of: supportingProfessionalProfile.professionalOf,
    },
  };

  // Crear el usuario para el header
  const supportingProfessionalUserForHeader: SupportingProfessionalUserForHeader =
    {
      name: String(
        user.first_name + " " + user.last_name || user.name || ""
      ),
      profile: String(
        supportingProfessionalProfile.profileType?.replace(/_/g, " ") || ""
      ),
      avatar: String(user.picture || ""),
    };

  return {
    user,
    supportingProfessionalProfile,
    supportingProfessionalUser,
    supportingProfessionalUserForHeader,
    isLoading: false,
    error: null,
  };
}

