'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { setNavState } from '@/lib/nav-state';
import type { Role } from '@/types';

interface ProtectedRouteProps {
  role?: Role;
  children: ReactNode;
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { isAuthenticated, user, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      const loginPath = pathname.startsWith('/admin') ? '/admin/login' : '/cliente/login';
      setNavState({ from: pathname });
      router.replace(loginPath);
      return;
    }
    if (role && user?.role !== role) {
      const destino = user?.role === 'ADMIN' ? '/admin' : '/cliente/inicio';
      router.replace(destino);
    }
  }, [ready, isAuthenticated, user, role, pathname, router]);

  if (!ready) return null;
  if (!isAuthenticated) return null;
  if (role && user?.role !== role) return null;

  return <>{children}</>;
}
