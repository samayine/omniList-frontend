import { create } from 'zustand';
import type { User } from '@/types';

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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    clearTokenCookie();
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Called once on app mount to restore state from localStorage
  hydrate: () => {
    const token = localStorage.getItem('accessToken');
    const raw = localStorage.getItem('user');
    if (token && raw) {
      try {
        const user = JSON.parse(raw) as User;
        setTokenCookie(token); // Ensure cookie is in sync
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        clearTokenCookie();
      }
    }
  },
}));
