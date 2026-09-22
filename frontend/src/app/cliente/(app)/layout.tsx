'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ClienteLayout } from '@/components/layout/ClienteLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute role="CLIENTE">
      <ClienteLayout>{children}</ClienteLayout>
    </ProtectedRoute>
  );
}
