export interface PatchTransaction {
  status?: string;
  additionalNotes?: string;
}
export enum TransactionStatus {
  IN_PREPARATION = "in_preparation",
  ACTIVE = "active",
  UNDER_CONTRACT = "under_contract",
  SOLD_LEASED = "sold_leased",
  TERMINATED = "terminated",
  WITHDRAWN = "withdrawn",
}

export interface Transaction {
  transactionId: string;
  transactionType: string;
  status: string;
  additionalNotes: string | null;
  createdAt: string;
  updatedAt: string;
  propertyAddress: string;
  propertyValue: number;
  totalWorkflowItems: number;
  completedWorkflowItems: number;
  nextIncompleteItemDate: string | null;
  // Additional fields from API
  propertyPrice?: number;
  propertySize?: number;
  propertyBedrooms?: number;
  propertyBathrooms?: number;
}

export interface PersonInfo {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface SupportingProfessionalInfo extends PersonInfo {
  professionOf: string;
}

export interface TransactionPeople {
  accessCode: string;
  client: PersonInfo | null;
  realEstateAgent: PersonInfo | null;
  supportingProfessionals: SupportingProfessionalInfo[];
}
