"use client";

import { useUser } from "@auth0/nextjs-auth0";

// Interfaz adaptada para el hook (camelCase para uso en frontend)
interface BrokerProfileAdapted {
  esignName: string;
  esignInitials: string;
  professionalOf: string;
  profileType: string;
}

interface BrokerUser {
  id: string;
  name: string;
  email: string;
  role: string;
  profile: {
    esign_name: string;
    esign_initials: string;
    professional_of: string;
  };
}

interface BrokerUserForHeader {
  name: string;
  profile: string;
  avatar: string;
}

interface UseBrokerAuthReturn {
  user: any;
  brokerProfile: BrokerProfileAdapted | null;
  brokerUser: BrokerUser | null;
  brokerUserForHeader: BrokerUserForHeader | null;
  isLoading: boolean;
  error: string | null;
}

export function useBrokerAuth(): UseBrokerAuthReturn {
  const { user, isLoading } = useUser();

  if (isLoading) {
    console.log("🔄 Hook broker: Cargando usuario...");
    return {
      user: null,
      brokerProfile: null,
      brokerUser: null,
      brokerUserForHeader: null,
      isLoading: true,
      error: null,
    };
  }

  if (!user) {
    console.log("❌ Hook broker: No hay usuario");
    return {
      user: null,
      brokerProfile: null,
      brokerUser: null,
      brokerUserForHeader: null,
      isLoading: false,
      error: "No user session found.",
    };
  }

  console.log("👤 Hook broker: Usuario encontrado:", user);

  if (!user.profile) {
    console.log("❌ Hook broker: Usuario sin perfil");
    return {
      user,
      brokerProfile: null,
      brokerUser: null,
      brokerUserForHeader: null,
      isLoading: false,
      error: "No broker profile found.",
    };
  }

  // El perfil guardado en la sesión
  const profile = user.profile as any;
  console.log("📋 Hook broker: Perfil del usuario:", profile);
  console.log("🏷️ Hook broker: Tipo de perfil:", profile.profileType);

  // Crear el brokerProfile con datos adaptados
  const brokerProfile: BrokerProfileAdapted = {
    esignName: profile.esignName || "",
    esignInitials: profile.esignInitials || "",
    professionalOf:
      profile.professionalOf || profile.licenseNumber || "Professional",
    profileType: profile.profileType || "broker",
  };

  console.log("🔧 Hook broker: BrokerProfile creado:", brokerProfile);

  // Crear el brokerUser completo
  const brokerUser: BrokerUser = {
    id: user.sub || user.id || "",
    name: user.first_name + " " + user.last_name || user.name || "Professional",
    email: user.email || "",
    role: profile.profileType || "broker",
    profile: {
      esign_name: profile.esignName || "",
      esign_initials: profile.esignInitials || "",
      professional_of:
        profile.professionalOf || profile.licenseNumber || "Professional",
    },
  };

  // Crear el usuario para el header
  const brokerUserForHeader: BrokerUserForHeader = {
    name: String(user.first_name + " " + user.last_name || user.name || ""),
    profile: String(
      profile.professionalOf?.replace(/_/g, " ") ||
        profile.profileType?.replace(/_/g, " ") ||
        "Professional"
    ),
    avatar: String(user.picture || ""),
  };

  return {
    user,
    brokerProfile,
    brokerUser,
    brokerUserForHeader,
    isLoading: false,
    error: null,
  };
}
