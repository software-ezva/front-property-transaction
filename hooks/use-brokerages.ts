import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-internal";
import type { Brokerage } from "@/types/brokerage";

interface UseBrokeragesReturn {
  brokerages: Brokerage[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBrokerages(): UseBrokeragesReturn {
  const [brokerages, setBrokerages] = useState<Brokerage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrokerages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<Brokerage[]>("/api/brokerages");

      setBrokerages(response || []);
    } catch (err: any) {
      console.error("Error fetching brokerages:", err);
      setError(err.message || "Failed to fetch brokerages");
      setBrokerages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokerages();
  }, []);

  return {
    brokerages,
    isLoading,
    error,
    refetch: fetchBrokerages,
  };
}
