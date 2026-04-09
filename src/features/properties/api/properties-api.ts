import { api } from '@/lib/api-client';
import type { PaginatedResponse, Property } from '@/types';

export type GetPropertiesParams = {
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string; // e.g. "PUBLISHED"
  page?: number;
  limit?: number;
};

export async function getPropertiesApi(
  params: GetPropertiesParams,
): Promise<PaginatedResponse<Property>> {
  const { data } = await api.get<PaginatedResponse<Property>>('/properties', {
    params,
  });
  return data;
}

export async function getPropertyApi(id: string): Promise<Property> {
  const { data } = await api.get<Property>(`/properties/${id}`);
  return data;
}
