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
