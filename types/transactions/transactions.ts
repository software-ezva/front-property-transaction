export interface TransactionUpdatePayload {
  status?: string;
  clientId?: string;
  additionalNotes?: string;
}

export interface ItemUpdatePayload {
  status?: string;
  expectClosingDate?: string;
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
  clientName: string | null;
  totalWorkflowItems: number;
  completedWorkflowItems: number;
  nextIncompleteItemDate: string | null;
  // Additional fields from API
  propertyPrice?: number;
  propertySize?: number;
  propertyBedrooms?: number;
  propertyBathrooms?: number;
  clientEmail?: string;
  clientPhoneNumber?: string;
}
