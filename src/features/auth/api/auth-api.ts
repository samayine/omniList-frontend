import { api } from '@/lib/api-client';
import type { AuthResponse } from '@/types';

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function registerApi(
  email: string,
  password: string,
  role?: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', {
    email,
    password,
    role,
  });
  return data;
}

export async function getMeApi() {
  const { data } = await api.get('/auth/me');
  return data;
}
