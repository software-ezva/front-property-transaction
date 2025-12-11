import { useState, useEffect } from "react";
import { Property } from "@/types/properties";
import {
  getProperties,
  deleteProperty as apiDeleteProperty,
  createProperty as apiCreateProperty,
} from "@/lib/api/properties";

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProperties();
      setProperties(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch properties"
      );
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (
    data: Omit<Property, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newProperty = await apiCreateProperty(data);
      setProperties((prev) => [...prev, newProperty]);
      return newProperty;
    } catch (err) {
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await apiDeleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
    createProperty,
    deleteProperty,
  };
}
