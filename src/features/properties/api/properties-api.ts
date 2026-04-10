import { api } from '@/lib/api-client';
import type { PaginatedResponse, Property } from '@/types';

export type GetPropertiesParams = {
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  page?: number;
  limit?: number;
  onlyMine?: boolean;
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

export async function uploadImagesApi(files: File[]): Promise<{ url: string; mimeType: string; sizeBytes: number; order: number }[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const { data } = await api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export type CreatePropertyInput = {
  title: string;
  description: string;
  location: string;
  price: number;
  images?: { url: string; mimeType: string; sizeBytes: number }[];
};

export async function createPropertyApi(input: CreatePropertyInput): Promise<Property> {
  const { data } = await api.post<Property>('/properties', input);
  return data;
}

export type UpdatePropertyInput = Partial<CreatePropertyInput>;

export async function updatePropertyApi(id: string, input: UpdatePropertyInput): Promise<Property> {
  const { data } = await api.patch<Property>(`/properties/${id}`, input);
  return data;
}

export async function publishPropertyApi(id: string): Promise<Property> {
  const { data } = await api.patch<Property>(`/properties/${id}/publish`);
  return data;
}

export async function archivePropertyApi(id: string): Promise<Property> {
  const { data } = await api.patch<Property>(`/properties/${id}/archive`);
  return data;
}

export async function deletePropertyApi(id: string): Promise<{ message: string }> {
  const { data } = await api.delete(`/properties/${id}`);
  return data;
}
