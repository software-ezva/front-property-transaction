import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-internal";
import { ENDPOINTS } from "@/lib/constants";
import { ItemStatus } from "@/types/workflow";

export interface UpcomingTaskItem {
  transactionId: string;
  description: string;
  order: number;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
  expectClosingDate?: string | null;
}

export function useUpcomingTasks(initialDays: number = 7) {
  const [tasks, setTasks] = useState<UpcomingTaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(initialDays);

  const fetchExpiringItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<UpcomingTaskItem[]>(
        `${ENDPOINTS.internal.EXPIRING_ITEMS}?days=${days}`
      );
      setTasks(data);
    } catch (err) {
      console.error("Error fetching expiring items:", err);
      setError("Failed to load upcoming tasks");
    } finally {
      setIsLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchExpiringItems();
  }, [fetchExpiringItems]);

  return {
    tasks,
    isLoading,
    error,
    days,
    setDays,
    refresh: fetchExpiringItems,
  };
}
