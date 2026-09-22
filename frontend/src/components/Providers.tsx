'use client';

import { AuthProvider } from '@/context/AuthContext';
import { FavoritosProvider } from '@/context/FavoritosContext';
import { ToastProvider } from '@/context/ToastContext';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <FavoritosProvider>
        <ToastProvider>{children}</ToastProvider>
      </FavoritosProvider>
    </AuthProvider>
  );
}
