import { api } from '@/lib/api-client';

export type AdminMetrics = {
  users: number;
  properties: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  favorites: number;
};

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const { data } = await api.get<AdminMetrics>('/admin/metrics');
  return data;
}

export async function getAdminProperties(page = 1, limit = 20) {
  const { data } = await api.get('/admin/properties', { params: { page, limit } });
  return data;
}

export async function disablePropertyApi(id: string) {
  const { data } = await api.patch(`/admin/properties/${id}/disable`);
  return data;
}

export async function restorePropertyApi(id: string) {
  const { data } = await api.patch(`/admin/properties/${id}/restore`);
  return data;
}

// ── User Management (Admin-only /users endpoints) ──

export type AdminUser = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>('/users');
  return data;
}

export async function updateUserRoleApi(id: string, role: string) {
  const { data } = await api.patch(`/users/${id}`, { role });
  return data;
}

export async function deleteUserApi(id: string) {
  const { data } = await api.delete(`/users/${id}`);
  return data;
}
