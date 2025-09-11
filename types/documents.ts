export enum DocumentStatus {
  PENDING = "Pending",
  WAITING = "Waiting",
  SIGNED = "Signed",
  READY = "Ready",
  REJECTED = "Rejected",
  ARCHIVED = "Archived",
}

export enum DocumentCategory {
  CONTRACT_AND_NEGOTIATION = "Contract and Negotiation",
  TITLE_AND_OWNERSHIP = "Title and Ownership",
  DISCLOSURE = "Disclosure",
  CLOSING_AND_FINANCING = "Closing and Financing",
  AGREEMENTS = "Real Estate Agent Agreements",
  LISTINGS_AND_MARKETING = "Real Estate Agent Listings and Marketing",
  PROPERTY_MANAGEMENT = "Property Management",
  INSURANCE = "Insurance",
  MISCELLANEOUS = "Miscellaneous",
}

export interface Document {
  documentId: string;
  title: string;
  category: DocumentCategory;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  status: DocumentStatus;
}

export interface CreateDocumentRequest {
  documentTemplateId: string;
}

export interface CreateDocumentResponse {
  documentId: string;
  title: string;
  category: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
}

export interface DocumentResponse {
  documentId: string;
  title: string;
  category: string;
  status: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}
