import { apiClient } from "@/lib/api-internal";
import { ENDPOINTS } from "@/lib/constants";
import {
  Transaction,
  TransactionStatus,
  TransactionPeople,
} from "@/types/transactions";
import type { TransactionUpdatePayload } from "@/types/transactions/transactions";

export interface CreateTransactionRequest {
  propertyId: string;
  workflowTemplateId: string;
  additionalNotes?: string;
}

export interface CreateTransactionResponse {
  transactionId: string;
  message: string;
}

export interface UpdateTransactionRequest {
  status?: string;
  additionalNotes?: string;
}

/**
 * API Client for Transactions
 */
export class TransactionApiClient {
  /**
   * Get all transactions
   */
  static async getTransactions(): Promise<Transaction[]> {
    return apiClient.get<Transaction[]>(ENDPOINTS.internal.TRANSACTIONS, {
      errorTitle: "Error loading transactions",
    });
  }

  /**
   * Get a specific transaction by ID
   */
  static async getTransaction(transactionId: string): Promise<Transaction> {
    return apiClient.get<Transaction>(
      `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}`,
      {
        errorTitle: "Error loading transaction",
      }
    );
  }

  /**
   * Create a new transaction
   */
  static async createTransaction(
    data: CreateTransactionRequest
  ): Promise<CreateTransactionResponse> {
    const payload: any = {
      propertyId: data.propertyId,
      workflowTemplateId: data.workflowTemplateId,
    };

    if (data.additionalNotes && data.additionalNotes.trim() !== "") {
      payload.additionalNotes = data.additionalNotes;
    }

    return apiClient.post<CreateTransactionResponse>(
      ENDPOINTS.internal.TRANSACTIONS,
      payload,
      {
        errorTitle: "Error creating transaction",
      }
    );
  }

  /**
   * Update a transaction
   */
  static async updateTransaction(
    transactionId: string,
    data: UpdateTransactionRequest
  ): Promise<void> {
    const payload: TransactionUpdatePayload = {};

    if (data.status) {
      payload.status = data.status;
    }

    if (data.additionalNotes !== undefined) {
      payload.additionalNotes = data.additionalNotes;
    }

    await apiClient.patch(
      `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}`,
      payload,
      {
        errorTitle: "Error updating transaction",
      }
    );
  }

  /**
   * Delete a transaction
   */
  static async deleteTransaction(transactionId: string): Promise<void> {
    await apiClient.delete(
      `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}`,
      {
        errorTitle: "Error deleting transaction",
      }
    );
  }

  /**
   * Get people involved in the transaction
   */
  static async getTransactionPeople(
    transactionId: string
  ): Promise<TransactionPeople> {
    return apiClient.get<TransactionPeople>(
      ENDPOINTS.internal.TRANSACTION_PEOPLE(transactionId),
      {
        errorTitle: "Error loading transaction people",
      }
    );
  }

  /**
   * Regenerate transaction access code
   */
  static async regenerateAccessCode(transactionId: string): Promise<void> {
    await apiClient.post(
      ENDPOINTS.internal.TRANSACTION_REGENERATE_ACCESS_CODE(transactionId),
      {},
      {
        errorTitle: "Error regenerating access code",
      }
    );
  }
}

// Export individual methods for convenience
export const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionPeople,
  regenerateAccessCode,
} = TransactionApiClient;
