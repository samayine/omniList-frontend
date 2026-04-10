import { create } from 'zustand';
import type { User } from '@/types';
import { getMeApi } from '@/features/auth/api/auth-api';
import { api } from '@/lib/api-client';

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (token: string, user: User) => void;
  logout: () => void;
  hydrate: () => void;
};

function setTokenCookie(token: string) {
  // Set cookie readable by middleware (not httpOnly — we need JS access)
  document.cookie = `accessToken=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
}

function clearTokenCookie() {
  document.cookie = 'accessToken=; path=/; max-age=0';
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (token, user) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setTokenCookie(token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    // Fire-and-forget server logout (clears any server-side session tracking)
    api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    clearTokenCookie();
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Called once on app mount: restore from localStorage, then verify with server
  hydrate: async () => {
    const token = localStorage.getItem('accessToken');
    const raw = localStorage.getItem('user');
    if (!token || !raw) return;
    try {
      const user = JSON.parse(raw) as User;
      setTokenCookie(token);
      set({ user, token, isAuthenticated: true }); // Optimistic restore
      // Verify token is still valid server-side
      await getMeApi();
    } catch {
      // Token rejected / user deleted — silently clear everything
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      clearTokenCookie();
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
