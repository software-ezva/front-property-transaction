// Alias for compatibility with existing code
export type ChecklistItem = ItemTemplate;
// Enum para tipos de transacción
export enum TransactionType {
  PURCHASE = "Purchase",
  LISTING_FOR_SALE = "Listing for Sale",
  LISTING_FOR_LEASE = "Listing for Lease",
  LEASE = "Lease",
  OTHER = "Other",
}

// Interfaces basadas en las entidades
export interface ItemTemplate {
  id: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  checklistTemplateId?: string;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  workflowTemplateId?: string;
  items: ItemTemplate[];
}

export interface WorkflowTemplate {
  id: string;
  transactionType: TransactionType;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  checklistTemplates: ChecklistTemplate[];
}

// Tipos para formularios
export interface CreateWorkflowTemplateData {
  transactionType: TransactionType;
  name: string;
  checklistTemplates: CreateChecklistTemplateData[];
}

export interface CreateChecklistTemplateData {
  name: string;
  description: string;
  order: number;
  items: CreateItemTemplateData[];
}

export interface CreateItemTemplateData {
  description: string;
  order: number;
}
