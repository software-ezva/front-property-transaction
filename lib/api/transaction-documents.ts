import { apiClient } from "@/lib/api-internal";
import { ENDPOINTS } from "@/lib/constants";
import {
  Document,
  DocumentStatus,
  DocumentCategory,
  CreateDocumentRequest,
  CreateDocumentResponse,
  DocumentResponse,
} from "@/types/documents";

export interface TransactionDocumentResponse {
  documentId: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  url?: string;
  isEditable?: boolean;
  isSignable?: boolean;
  couldBeRequestedForSignature?: boolean;
}

/**
 * API Client for Transaction Documents
 */
export class TransactionDocumentApiClient {
  /**
   * Get all documents for a specific transaction
   */
  static async getTransactionDocuments(
    transactionId: string
  ): Promise<Document[]> {
    const response = await apiClient.get<TransactionDocumentResponse[]>(
      `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}/documents`,
      {
        errorTitle: "Error loading transaction documents",
      }
    );

    // Transform backend response to our internal type
    return response.map((doc) => ({
      ...doc,
      category: doc.category as DocumentCategory,
      status: doc.status as DocumentStatus,
      url: `/documents/${doc.documentId}`, // Generate URL for document viewing
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    }));
  }

  /**
   * Create a new document from a template for a specific transaction
   */
  static async createDocumentFromTemplate(
    transactionId: string,
    documentTemplateId: string
  ): Promise<Document> {
    const requestData: CreateDocumentRequest = {
      documentTemplateId,
    };

    const response = await apiClient.post<CreateDocumentResponse>(
      `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}/documents`,
      requestData,
      {
        errorTitle: "Error creating document",
      }
    );

    // Transform backend response to our internal type
    return {
      documentId: response.documentId,
      title: response.title,
      category: response.category as DocumentCategory,
      status: response.status as DocumentStatus,
      url: response.url,
      createdAt:
        response.createdAt instanceof Date
          ? response.createdAt
          : new Date(response.createdAt),
      updatedAt:
        response.updatedAt instanceof Date
          ? response.updatedAt
          : new Date(response.updatedAt),
    };
  }

  /**
   * Get a specific document by ID
   */
  static async getTransactionDocument(
    transactionId: string,
    documentId: string
  ): Promise<Document> {
    const response = await apiClient.get<DocumentResponse>(
      `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}/documents/${documentId}`,
      {
        errorTitle: "Error loading document",
      }
    );

    // Transform backend response to our internal type
    return {
      documentId: response.documentId,
      title: response.title,
      category: response.category as DocumentCategory,
      status: response.status as DocumentStatus,
      url: response.url,
      createdAt:
        response.createdAt instanceof Date
          ? response.createdAt
          : new Date(response.createdAt),
      updatedAt:
        response.updatedAt instanceof Date
          ? response.updatedAt
          : new Date(response.updatedAt),
      isEditable: response.isEditable,
      isSignable: response.isSignable,
      couldBeRequestedForSignature: response.couldBeRequestedForSignature,
    };
  }

  /**
   * Check document status and readiness for edit
   */
  static async checkDocumentForEdit(
    transactionId: string,
    documentId: string
  ): Promise<Partial<Document>> {
    const response = await apiClient.patch<DocumentResponse>(
      `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}/documents/${documentId}`,
      {},
      {
        errorTitle: "Error checking document for edit",
      }
    );

    // Transform backend response to our internal type
    // Note: URL is not returned by check-for-edit endpoint
    return {
      documentId: response.documentId,
      title: response.title,
      category: response.category as DocumentCategory,
      status: response.status as DocumentStatus,
      createdAt:
        response.createdAt instanceof Date
          ? response.createdAt
          : new Date(response.createdAt),
      updatedAt:
        response.updatedAt instanceof Date
          ? response.updatedAt
          : new Date(response.updatedAt),
      isEditable: response.isEditable ?? false,
      isSignable: response.isSignable ?? false,
      couldBeRequestedForSignature:
        response.couldBeRequestedForSignature ?? false,
    };
  }

  /**
   * Update document status (mark as ready for signing)
   */
  static async updateDocumentFile(
    transactionId: string,
    documentId: string,
    _title: string, // Not used - endpoint doesn't support title updates
    isReadyForSigning: boolean = false
  ): Promise<Document> {
    const response = await apiClient.patch<DocumentResponse>(
      `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}/documents/${documentId}/edit`,
      { isReadyForSigning },
      { errorTitle: "Error updating document" }
    );

    return {
      ...response,
      category: response.category as DocumentCategory,
      status: response.status as DocumentStatus,
      createdAt:
        response.createdAt instanceof Date
          ? response.createdAt
          : new Date(response.createdAt),
      updatedAt:
        response.updatedAt instanceof Date
          ? response.updatedAt
          : new Date(response.updatedAt),
      isEditable: response.isEditable ?? false,
      isSignable: response.isSignable ?? false,
      couldBeRequestedForSignature:
        response.couldBeRequestedForSignature ?? false,
    };
  }
}

// Export individual methods for convenience
export const {
  getTransactionDocuments,
  createDocumentFromTemplate,
  getTransactionDocument,
  checkDocumentForEdit,
  updateDocumentFile,
} = TransactionDocumentApiClient;
