'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/auth-store';

export function AuthHydration({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
