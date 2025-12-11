import { useState, useEffect } from "react";
import { Transaction, TransactionStatus } from "@/types/transactions";
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from "@/lib/api/transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error loading transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (data: CreateTransactionRequest) => {
    try {
      const newTransaction = await createTransaction(data);
      // Reload the list after creating
      await fetchTransactions();
      return newTransaction;
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateTransaction = async (
    transactionId: string,
    data: UpdateTransactionRequest
  ) => {
    try {
      await updateTransaction(transactionId, data);
      // Update local state optimistically
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.transactionId === transactionId
            ? {
                ...transaction,
                status: data.status || transaction.status,
                additionalNotes:
                  data.additionalNotes !== undefined
                    ? data.additionalNotes
                    : transaction.additionalNotes,
                updatedAt: new Date().toISOString(),
              }
            : transaction
        )
      );
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId);
      // Remove from local state
      setTransactions((prev) =>
        prev.filter(
          (transaction) => transaction.transactionId !== transactionId
        )
      );
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction: handleCreateTransaction,
    updateTransaction: handleUpdateTransaction,
    deleteTransaction: handleDeleteTransaction,
  };
}

/**
 * Hook for managing a single transaction
 */
export function useTransaction(transactionId: string) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransaction(transactionId);
      setTransaction(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error loading transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTransaction = async (data: UpdateTransactionRequest) => {
    try {
      await updateTransaction(transactionId, data);

      // Optimistically update local state
      setTransaction((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: data.status || prev.status,
          additionalNotes:
            data.additionalNotes !== undefined
              ? data.additionalNotes
              : prev.additionalNotes,
          updatedAt: new Date().toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (transactionId) {
      fetchTransaction();
    }
  }, [transactionId]);

  return {
    transaction,
    loading,
    error,
    refetch: fetchTransaction,
    updateTransaction: handleUpdateTransaction,
  };
}
