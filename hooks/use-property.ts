import { useState, useEffect, useCallback } from "react";
import { Property } from "@/types/properties";
import { getProperty, updateProperty } from "@/lib/api/properties";

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProperty(id);
      setProperty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch property");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleUpdateProperty = async (data: Partial<Property>) => {
    try {
      const updated = await updateProperty(id, data);
      setProperty(updated);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id, fetchProperty]);

  return {
    property,
    loading,
    error,
    refetch: fetchProperty,
    updateProperty: handleUpdateProperty,
  };
}
