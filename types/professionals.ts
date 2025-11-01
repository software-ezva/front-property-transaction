/**
 * Types for Supporting Professional profile
 */

export enum ProfessionalType {
  ATTORNEY = "Attorney",
  APPRAISER = "Appraiser",
  MORTAGAGE = "Mortgage",
  HOME_IMPROVEMENT = "Home Improvement",
  UTILITIES = "Utilities",
  HOME_SECURITY = "Home Security",
  HOME_INSPECTION = "Home Inspection",
  MOVING_STORAGE = "Moving Storage",
  HOME_WARRANTY = "Home Warranty",
  HOME_INSURANCE = "Home Insurance",
  ESCROW_TITLE = "Escrow Title",
  OTHER_HOME_SERVICES = "Other Home Services",
}

export interface SupportingProfessionalProfile {
  esign_name: string;
  esign_initials: string;
  phone_number: string;
  professional_of: string; // ProfessionalType enum value
  brokerages?: string[]; // Array de IDs de brokerages (ManyToMany)
}

export interface CreateSupportingProfessionalPayload {
  esign_name: string;
  esign_initials: string;
  phone_number: string;
  professional_of: string;
}

export interface SupportingProfessionalResponse {
  id: string;
  esign_name: string;
  esign_initials: string;
  phone_number: string;
  professional_of: string;
  created_at: string;
  updated_at: string;
}
