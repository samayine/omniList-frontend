import { api } from '@/lib/api-client';
import type { Property } from '@/types';

export const getFavoritesApi = async (): Promise<Property[]> => {
  const { data } = await api.get('/favorites');
  return data.map((fav: any) => fav.property);
};

export const addFavoriteApi = async (propertyId: string) => {
  const { data } = await api.post('/favorites', { propertyId });
  return data;
};

export const removeFavoriteApi = async (propertyId: string) => {
  const { data } = await api.delete('/favorites', { data: { propertyId } });
  return data;
};
