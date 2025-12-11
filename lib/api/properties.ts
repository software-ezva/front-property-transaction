import { apiClient } from "@/lib/api-internal";
import { ENDPOINTS } from "@/lib/constants";
import { Property } from "@/types/properties";

export const getProperties = async (): Promise<Property[]> => {
  return apiClient.get<Property[]>(ENDPOINTS.internal.PROPERTIES);
};

export const createProperty = async (
  data: Omit<Property, "id" | "createdAt" | "updatedAt">
): Promise<Property> => {
  return apiClient.post<Property>(ENDPOINTS.internal.PROPERTIES, data);
};

export const getProperty = async (id: string): Promise<Property> => {
  return apiClient.get<Property>(`${ENDPOINTS.internal.PROPERTIES}/${id}`);
};

export const updateProperty = async (
  id: string,
  data: Partial<Omit<Property, "id" | "createdAt" | "updatedAt">>
): Promise<Property> => {
  return apiClient.patch<Property>(`${ENDPOINTS.internal.PROPERTIES}/${id}`, data);
};

export const deleteProperty = async (id: string): Promise<void> => {
  return apiClient.delete(`${ENDPOINTS.internal.PROPERTIES}/${id}`);
};
