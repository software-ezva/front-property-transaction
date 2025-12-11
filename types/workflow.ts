// Workflow timeline types
export enum ItemStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface ItemUpdate {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

export interface Item {
  id: string;
  description: string;
  order: number;
  status: ItemStatus;
  expectClosingDate?: string;
  updates?: ItemUpdate[];
}

export interface Checklist {
  id: string;
  name: string;
  order: number;
  items: Item[];
}

export interface Workflow {
  id: string;
  name: string;
  checklists: Checklist[];
}

// API Response types
export interface UpdateItemResponse {
  id: string;
  description: string;
  order: number;
  status: ItemStatus;
  expectClosingDate?: string;
  message?: string;
}
