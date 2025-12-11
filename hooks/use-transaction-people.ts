import { useState, useEffect, useCallback } from "react";
import { TransactionPeople } from "@/types/transactions";
import {
  getTransactionPeople,
  regenerateAccessCode as apiRegenerateAccessCode,
} from "@/lib/api/transactions";

export function useTransactionPeople(transactionId: string) {
  const [people, setPeople] = useState<TransactionPeople | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const fetchPeople = useCallback(
    async (showLoading = true) => {
      if (!transactionId) return;
      try {
        if (showLoading) setLoading(true);
        setError(null);
        const data = await getTransactionPeople(transactionId);
        setPeople(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error loading transaction people"
        );
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [transactionId]
  );

  const regenerateAccessCode = async () => {
    try {
      setRegenerating(true);
      await apiRegenerateAccessCode(transactionId);
      // Refetch people to get the new access code
      await fetchPeople(false);
    } catch (err) {
      throw err;
    } finally {
      setRegenerating(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  return {
    people,
    loading,
    error,
    regenerating,
    refetch: fetchPeople,
    regenerateAccessCode,
  };
}
