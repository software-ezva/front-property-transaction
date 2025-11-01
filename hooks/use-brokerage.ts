import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-internal";
import { ENDPOINTS } from "@/lib/constants";
import type { Brokerage } from "@/types/brokerage";

interface UseBrokerageReturn {
  brokerage: Brokerage | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  regenerateAccessCode: () => Promise<void>;
}

export function useBrokerage(): UseBrokerageReturn {
  const [brokerage, setBrokerage] = useState<Brokerage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrokerage = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<Brokerage | null>(
        ENDPOINTS.internal.BROKERAGE
      );

      // El backend retorna null si el broker no está asignado a ningún brokerage (200 OK)
      setBrokerage(response);
    } catch (err: any) {
      console.error("Error fetching brokerage:", err);
      setError(err.message || "Failed to fetch brokerage information");
      setBrokerage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateAccessCode = async () => {
    try {
      setError(null);

      const response = await apiClient.post<Brokerage>(
        ENDPOINTS.internal.REGENERATE_ACCESS_CODE,
        {}
      );

      // Update only the access code, keep other data intact
      setBrokerage((prev) => {
        if (!prev) return response;
        return {
          ...prev,
          accessCode: response.accessCode,
        };
      });
    } catch (err: any) {
      console.error("Error regenerating access code:", err);
      setError(err.message || "Failed to regenerate access code");
      throw err; // Re-throw to allow component to handle error
    }
  };

  useEffect(() => {
    fetchBrokerage();
  }, []);

  return {
    brokerage,
    isLoading,
    error,
    refetch: fetchBrokerage,
    regenerateAccessCode,
  };
}
