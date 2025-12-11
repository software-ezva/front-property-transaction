import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/types/transactions";
import { apiClient } from "@/lib/api-internal";
import { ENDPOINTS } from "@/lib/constants";

export interface ClientTransactionStats {
  total: number;
  inProgress: number;
  completed: number;
  upcomingDeadlines: number;
}

/**
 * Hook específico para transacciones de clientes
 * Filtra automáticamente por las transacciones del cliente autenticado
 */
export function useClientTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      // Llamada específica para transacciones del cliente
      const data = await apiClient.get<Transaction[]>(
        `${ENDPOINTS.internal.TRANSACTIONS}?role=client`,
        {
          errorTitle: "Error loading your transactions",
        }
      );
      setTransactions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error loading your transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calcula estadísticas de las transacciones del cliente
   */
  const getTransactionStats = (): ClientTransactionStats => {
    const total = transactions.length;
    const inProgress = transactions.filter((t) =>
      ["preparation", "active", "under_contract", "pending", "review"].includes(
        t.status
      )
    ).length;
    const completed = transactions.filter((t) =>
      ["sold", "leased", "completed"].includes(t.status)
    ).length;

    // Próximos deadlines (próximos 7 días)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingDeadlines = transactions.filter((t) => {
      if (!t.nextIncompleteItemDate) return false;
      const deadline = new Date(t.nextIncompleteItemDate);
      return deadline <= nextWeek && deadline >= new Date();
    }).length;

    return {
      total,
      inProgress,
      completed,
      upcomingDeadlines,
    };
  };

  /**
   * Obtiene la transacción más reciente activa
   */
  const getActiveTransaction = (): Transaction | null => {
    return (
      transactions.find((t) =>
        ["preparation", "active", "under_contract", "pending"].includes(
          t.status
        )
      ) || null
    );
  };

  /**
   * Verifica si hay acciones pendientes que requieren atención del cliente
   */
  const hasUrgentActions = (): boolean => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    return transactions.some((t) => {
      if (!t.nextIncompleteItemDate) return false;
      const deadline = new Date(t.nextIncompleteItemDate);
      return deadline <= tomorrow;
    });
  };

  useEffect(() => {
    fetchClientTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    stats: getTransactionStats(),
    activeTransaction: getActiveTransaction(),
    hasUrgentActions: hasUrgentActions(),
    refetch: fetchClientTransactions,
  };
}

/**
 * Hook para manejar una transacción específica del cliente
 */
export function useClientTransaction(transactionId: string) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<Transaction>(
        `${ENDPOINTS.internal.TRANSACTIONS}/${transactionId}`,
        {
          errorTitle: "Error loading transaction details",
        }
      );
      setTransaction(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error loading transaction details"
      );
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  /**
   * Permite al cliente agregar comentarios o solicitudes
   */
  const addClientNote = async (note: string) => {
    try {
      if (!transaction) return;

      const currentNotes = transaction.additionalNotes || "";
      const timestamp = new Date().toLocaleString();
      const newNote = `[Client - ${timestamp}]: ${note}`;
      const updatedNotes = currentNotes
        ? `${currentNotes}\n\n${newNote}`
        : newNote;

      await apiClient.patch(
        ENDPOINTS.internal.TRANSACTIONS,
        {
          transactionId,
          additionalNotes: updatedNotes,
        },
        {
          errorTitle: "Error adding your note",
        }
      );

      // Actualizar estado local
      setTransaction((prev) =>
        prev
          ? {
              ...prev,
              additionalNotes: updatedNotes,
              updatedAt: new Date().toISOString(),
            }
          : null
      );
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (transactionId) {
      fetchTransaction();
    }
  }, [transactionId, fetchTransaction]);

  return {
    transaction,
    loading,
    error,
    refetch: fetchTransaction,
    addClientNote,
  };
}
